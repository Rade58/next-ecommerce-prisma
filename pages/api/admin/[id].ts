import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import verifyCurrentUser from "../../../middlewares/verifyCurrentUser";

import prismaClient from "../../../lib/prisma";

import type { UpdateProductsDataRecord } from "../../../components/4_admin_page/ProductsTable";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(verifyCurrentUser);

handler.delete(async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(403).send("unauthorized");

  const body = req.body;

  if (body.model === "product") {
    const productIdsArray = body.data as string[];

    try {
      let resArr = [];

      for (const productId of productIdsArray) {
        const resData = await prismaClient.product.delete({
          where: {
            productId,
          },
        });
        resArr.push(resData);
      }

      console.log(JSON.stringify(resArr, null, 2));

      const allProductsCount = await prismaClient.product.count({
        where: {
          adminId: {
            equals: id as string,
          },
        },
      });

      // REFETCHING PRODUCTS
      const products = await prismaClient.product.findMany({
        where: {
          admin: {
            is: {
              id: id as string,
            },
          },
        },
        take: body.loadedProductCount as number,
        orderBy: {
          name: "asc",
        },
      });

      return res.status(200).send({
        // deleteCount: resArr.length,
        allProductsCount,
        products,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).end();
    }
  }

  console.log(JSON.stringify({ id, body }, null, 2));

  res.status(200).end();
});

handler.put(async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(403).send("unauthorized");

  const body = req.body;

  if (body.model === "product") {
    const upProdDataRec = body.data as UpdateProductsDataRecord;

    try {
      // console.log()

      for (const key in upProdDataRec) {
        const ob = upProdDataRec[key];

        const productId = Object.keys(ob)[0];

        const dataArr = ob[productId];

        /*  const resData = await prismaClient.product.update({
          where: {
            productId
          }
        }); 
        resArr.push(resData); */
      }

      /* const allProductsCount = await prismaClient.product.count({
        where: {
          adminId: {
            equals: id as string,
          },
        },
      });

      // REFETCHING PRODUCTS
      const products = await prismaClient.product.findMany({
        where: {
          admin: {
            is: {
              id: id as string,
            },
          },
        },
        take: body.loadedProductCount as number,
        orderBy: {
          name: "asc",
        },
      });

      return res.status(200).send({
        // deleteCount: resArr.length,
        allProductsCount,
        products,
      }); */
    } catch (err) {
      console.error(err);
      return res.status(400).end();
    }
  }

  // console.log(JSON.stringify({ id, body }, null, 2));

  // res.status(200).end();
});

handler.post(async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(403).send("unauthorized");

  const body = req.body;

  // console.log(JSON.stringify({ id, body }, null, 2));

  // res.status(200).end();
});

export default handler;
