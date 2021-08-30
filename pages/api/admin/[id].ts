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

  // console.log(JSON.stringify({ id, body }, null, 2));

  if (body.model === "product") {
    const upProdDataRec = body.data as UpdateProductsDataRecord;

    try {
      // console.log()
      // throw new Error("Hello world");

      for (const keyNo in upProdDataRec) {
        const ob = upProdDataRec[keyNo];

        const productNamePropNames = Object.keys(ob);

        const updateDataRec: Record<string, any> = {};

        let productId: string = "";

        for (const i in productNamePropNames) {
          const productName = productNamePropNames[i];

          if (!productId) {
            productId = ob[productName].productId;
          }

          const dataOb = ob[productName];

          const propName = dataOb.propName;

          let value: any = dataOb.value;

          if (
            dataOb.propName === "price" ||
            dataOb.propName === "countInStock"
          ) {
            value = Number(value);
          }

          updateDataRec[propName] = value;
        }

        const prodUpdated = await prismaClient.product.update({
          where: {
            productId,
          },
          data: updateDataRec,
        });

        console.log({ prodUpdated });
      }

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
        // allProductsCount,
        products,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).end();
    }
  }

  // console.log(JSON.stringify({ id, body }, null, 2));

  res.status(200).end();
});

handler.post(async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(403).send("unauthorized");

  const body = req.body;

  if (body.model === "product") {
    const newProductData = body.data as {
      name: string;
      brand: string;
      countInStock: number;
      price: number;
      description: string;
      image: string;
      category: string;
    };

    newProductData.countInStock = Number(newProductData.countInStock);
    newProductData.price = Number(newProductData.price);

    try {
      const newProduct = await prismaClient.product.create({
        data: {
          admin: {
            connect: {
              id: id as string,
            },
          },
          ...newProductData,
        },
      });

      console.log({ newProduct });

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
        take: (body.loadedProductCount as number) + 1,
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

export default handler;
