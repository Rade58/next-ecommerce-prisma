import path from "path";
import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

// WE WILL USE MULTER LIKE I SAID
import multer from "multer";
import type { Multer } from "multer";
import type { Express } from "express";
//

import verifyCurrentUser from "../../../middlewares/verifyCurrentUser";

import prismaClient from "../../../lib/prisma";

import type { UpdateProductsDataRecord } from "../../../components/4_admin_page/ProductsTable";

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
  fileFilter: function (req, file, cb) {},
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

handler.use(verifyCurrentUser);

handler.post(async (req, res) => {
  //
});

export default handler;
