import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
// WE NEED THIS
import sendgridMail from "@sendgrid/mail";
//

// WE INITIALIZE WITH API KEY
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  // TAKING EVVERYTHING WE NEED FROM THE BODY
  const { name, email, message } = req.body;

  // OK, THIS IS VERY IMPORTANT
  // THIS IS A EMAIL WE ARE SENDING FROM
  // IT IS IMPORTANT THAT YOU FORM HIM
  // FROM YOUR DOMAIN WE WERE SETTING UP IN SENDGRID BEFORE
  // SO IT NEEDS TO BE LIKE THIS:
  //    <whatever you want>@<your valid domain>
  // OTHERWISE YOU WILL GET ERROR FROM SENDGRID

  const sendingFrom = "RadeDev@moutfull.xyz"; // YES, WE SETTED moutfull.xyz AS OUR DOMAIN BEFORE

  // ---- CREATING MESSAGE STRING
  // THIS IS GOING TO BE DISPLAYED AS AN EMAIL MESSAGE
  const msg = `
    Name: ${name}\r\n
    Message: ${message}
  `;

  // ---- THIS IS INFO WE PROVIDE TO SENDGRID
  // WHERE TO SEND EMAIL AND FROM WHO
  // AND THE REST OF THE STUFF LIKKE SUBJECT
  const data = {
    to: email,
    from: sendingFrom,
    subject: "Hello World",
    text: msg,
    html: msg.replace(/\r\n/g, "<br/>"),
  };

  try {
    // WE CAN NOW SEND EMAIL
    const emailResponse = await sendgridMail.send(data);
    res.status(200).json(emailResponse);
  } catch (err) {
    console.log({ err });

    res.status(400).json(err);
  }
});

export default handler;
