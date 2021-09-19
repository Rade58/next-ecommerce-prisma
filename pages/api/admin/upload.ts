import path from "path";
import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

// WE WILL USE MULTER LIKE I SAID
import multer from "multer";
//

import verifyAdmin from "../../../middlewares/verifyAdmin";

const handler = nc<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.log(error);

    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// THIS IS HOW WE INITIALIZE STORAGE ENGINE
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // PASSING null ON THE PLACE WHERE POSSIBLE ERROR GOES (WE DON'T ANTICIPATE ERROR THERE)
    cb(
      null,
      // SECOND ARGUMENT IS OUR FOLDER WE CREATED NOT LONG AGO
      // BUT DON'T FORGET THAT WE SERVE STATIC FILES FROM public
      // FOLDER
      // IN OUR CASE WE WILL UPLOAD TO /public/uploads
      "./public/uploads/" // (DONT FORGET . (DOT))
      // BUT LATTER ON WHEN WE USE IMAGE AT FRONTEND
      // WE LOAD IMAGE WITHOUT public PART OF THE PATH
    );
  },
  // FILENAME CALLBACK
  filename(req, file, cb) {
    // WE NEED TO FORMAT FILE NAME
    // BECAUSE WHAT IF SOMEONE NAMES THEIR FILE WITH A NAME
    // THAT ALLREADY EXISTS FOR SOME OTHER FILE

    // AND WE WILL USE path.extname MODULE, TO GET EXTENSION FROM THE ORIGINAL NAME
    // OF THE FILE

    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// LETS BUILD A MIDDLEWARE
const upload = multer({
  storage,
  // BUT WE NEED TO RESTRICT SOME FILES FROM BEING UPLOADED
  // WE WANT JUST IMAGES, NOT OTHER TYPES OF FILES
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// FILTERING FUNCTION WE ALREADY CALLED ABOVE INSIDE fileFlter CALLBAC
function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const filetypes = /jpeg|jpg|png|svg/;

  const correctExtname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const correctMimeType = filetypes.test(file.mimetype);

  if (correctExtname && correctMimeType) {
    return cb(null, true);
  } else {
    return cb(new Error("Wrong file type."));
  }
}

//
handler.use(verifyAdmin);

// ADDING MIDDLEWARE (FOR UPLOADING ONLY OF SINGLE FILE)
// I ADDED FIELD NAME: "image", BECAUSE THAT MEANS WHEN WE UPLOAD FROM THE FRONT END
// WE NEED TO NAME FIELD AS  `image`
handler.use(upload.single("image"));

handler.post(async (req, res) => {
  interface File {
    file: Express.Multer.File;
  }

  interface Req extends NextApiRequest, File {
    //
  }
  // SO WE SHOULD HAVE ACCES OF THE IMAGE PATH IN HERE
  // AN IT SHOULD BE ON REQUEST OBJECT LIKE THIS

  let imagePath = (req as Req).file.path;

  // WE WANT TO REMOVE /paublic FROM THE PATH
  const toCutString = "public";
  const val = toCutString.length;

  imagePath = imagePath.slice(val, imagePath.length);

  // WE WILL SEND BACK IMAGE PATH
  // BECAUSE WE ARE GOING TO STORE THAT PATH INSIDE Product RECORD

  // console.log({ imagePath });

  return res.status(201).send(imagePath);
});

export default handler;

// WE WILL RECONFIGURE OUT ROUTE
// BECAUSE SINCE WE USE MULTIPART FORM DATA, WE DON'T WANT
// BODY PARSER
export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
