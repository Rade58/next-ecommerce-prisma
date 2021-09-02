import path from "path";
import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

// WE WILL USE MULTER LIKE I SAID
import multer from "multer";
// import express from "express";
// import type { Multer } from "multer";
// import type { Express } from "express";

//
// import verifyCurrentUser from "../../../middlewares/verifyCurrentUser";
//
// import prismaClient from "../../../lib/prisma";
//
// import type { UpdateProductsDataRecord } from "../../../components/4_admin_page/ProductsTable";

const handler = nc<NextApiRequest, NextApiResponse>();

// THIS IS HOW WE INITIALIZE STORAGE ENGINE
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // PASSING null ON THE PLACE WHERE POSSIBLE ERROR GOES (WE DON'T ANTICIPATE ERROR THERE)
    cb(
      null,
      // SECOND ARGUMENT IS OUR FOLDER WE CREATED NOT LONG AGO
      "uploads/"
    );
  },
  // FILENAME CALLBACK
  filename(req, file, cb) {
    // WE NEED TO FORMAT FILE NAME
    // BECAUSE WHAT IF SOMEONE NAMES FILE WITH A NAME
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
  // BUT E NEED TO RESTRICT SOME FILES FROM BEING UPLOADED
  // WE WANT JUST IMAGES
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// BUILDING THAT FILTERING FUNCTION WE CALLED IN fileFlter CALLBACJ
function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const filetypes = /jpeg|jpg|png/;

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

// -------------

// SIMULATING __dirname (BECAUSE IT IS NOT AVAILABLE WHEN WE USE import/export (I ASUME))

// MARKING STATIC FOLDER
// handler.use(
// "/uploads",
// express.static(
// path.join(/* this argument is __dirname */ path.resolve(), "/uploads")
// )
// );
//
// handler.use(verifyCurrentUser);

// ADDING MIDDLEWARE (FOR UPLOADING OF SINGLE FILE)
// I ADDED NAME IMAGE AND THT MEANS WHEN WE UPLOAD FROM THE FRONT END
// WE NEED TO NAME IT image
handler.use(upload.single("image"));

handler.post(async (req, res) => {
  // SO WE SHOULD HAVE ACCES OF THE IMAGE PATH IN HERE
  // AN IT SHOULD BE ON REQUEST OBJECT LIKE THIS

  interface File {
    file: Express.Multer.File;
  }

  interface Req extends NextApiRequest, File {
    //
  }

  // const imagePath = (req as unknown as {file: Express.Multer.File}).file.path

  const imagePath = (req as Req).file.path;

  // WE WILL SEND BACK IMAGE PATH
  // BECAUSE WE ARE GOING TO STORE THAT PATH INSIDE Product RECORD

  console.log({ imagePath });

  return res.status(201).send(imagePath);

  //
});

export default handler;
