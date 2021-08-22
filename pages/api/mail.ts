import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
// WE NEED THIS
import sendgridMail from "@sendgrid/mail";
//

// WE INITIALIZE WITH API KEY
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { name, email, message } = req.body;

  // ---- FORING MESSAGE STRING FROM VALUES FROM BOSY
  const msg = `
    Name: ${name}\r\n
    Email: ${email}\r\n
    Message: ${message}
  `;

  // ---- DATA
  const data = {
    to: "bajic.rade2@gmail.com",
    from: "radedev@moutfull.xyz",
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
