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

      // console.log(JSON.stringify(resArr, null, 2));

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
      // console.error(err);
      return res.status(400).end();
    }
  }

  // console.log(JSON.stringify({ id, body }, null, 2));

  res.status(200).end();
});

handler.put(async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(403).send("unauthorized");

  const body = req.body;

  // console.log(JSON.stringify({ id, body }, null, 2));

  if (body.model === "order") {
    try {
      const updatedOrder = await prismaClient.order.update({
        where: {
          id: body.orderId as string,
        },
        data: {
          deliveredAt: (body.markDelivered as boolean)
            ? new Date(Date.now())
            : null,
          isDelivered: (body.markDelivered as boolean) ? true : false,
        },
      });

      const orders = (
        await prismaClient.order.findMany({
          orderBy: {
            createdAt: "desc",
          },
          select: {
            buyer: {
              select: {
                id: true,
                user: {
                  select: {
                    email: true,
                    name: true,
                  },
                },
              },
            },
            items: {
              select: {
                quantity: true,
                product: {
                  select: {
                    price: true,
                  },
                },
              },
            },
            isDelivered: true,
            createdAt: true,
            deliveredAt: true,
            payedAt: true,
            id: true,
          },
        })
      ).map((order, i) => {
        const { items } = order;

        let price = 0;

        for (let item of items) {
          const { product, quantity } = item;

          price = price + product.price * quantity;
        }

        return {
          ...order,
          createdAt: order.createdAt.toISOString(),
          deliveredAt: order.deliveredAt?.toISOString()
            ? order.deliveredAt?.toISOString()
            : null,
          payedAt: order.payedAt?.toISOString()
            ? order.payedAt?.toISOString()
            : null,
          orderId: order.id,
          ...order.buyer,
          buyer: order.buyer.user.name || order.buyer.user.email,
          buyerProfileId: order.buyer.id,
          id: i + 1,
          user: null,
          price,
          items: null,
        };
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error(error);

      res.status(400).send("Something went wrong");
    }
  }

  if (body.model === "profile") {
    console.log({ body });

    try {
      const updatedProfile = await prismaClient.profile.update({
        where: {
          id: body.profileId as string,
        },
        data: {
          role: body.newRole,
        },
      });

      const profiles = (
        await prismaClient.profile.findMany({
          take: body.loadedProfilesNum as number,
          where: {
            role: {
              not: "ADMIN",
            },
          },
          select: {
            createdAt: false,
            updatedAt: false,

            addrss: true,
            city: true,
            country: true,
            id: true,
            paymentMethod: true,
            postalCode: true,
            role: true,
            taxPrice: true,

            user: {
              select: {
                updatedAt: false,
                createdAt: false,
                email: true,
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        })
      ).map((prof, i) => {
        // I NEED TO DO USER OBJECT NORMALIZATION
        const data = {
          ...prof,
          profileId: prof.id,
          ...prof.user,
          userId: prof.user.id,
          id: i + 1,
        };

        // @ts-ignore
        data.user = "";

        return data;
      });

      return res.status(200).json(profiles);
    } catch (err) {
      console.error(err);

      return res.status(400).send("database problem");
    }
  }

  if (body.model === "product") {
    const upProdDataRec = body.data as UpdateProductsDataRecord;

    try {
      // console.log()
      // throw new Error("Hello world");

      for (const keyNo in upProdDataRec) {
        const ob = upProdDataRec[keyNo];

        const propNumStrings = Object.keys(ob);

        const updateDataRec: Record<string, any> = {};

        let productId: string = "";

        for (const i in propNumStrings) {
          const numString = propNumStrings[i];

          console.log();

          if (!productId) {
            productId = ob[numString].productId;
          }

          const dataOb = ob[numString];

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

      const allProductsCount = await prismaClient.product.count({
        where: {
          adminId: {
            equals: id as string,
          },
        },
      });

      console.log(allProductsCount);

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

      console.log(products[0], products[2]);

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

      /* const allProductsCount = await prismaClient.product.count({
        where: {
          adminId: {
            equals: id as string,
          },
        },
      }); */

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

      console.log({ products });

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

export default handler;
