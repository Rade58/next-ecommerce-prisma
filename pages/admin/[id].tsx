/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";
import { useEffect } from "react";

import { useRouter } from "next/router";

import type { Profile, User, Order, Role } from "@prisma/client";

import { getSession, useSession } from "next-auth/client";

import prismaClient from "../../lib/prisma";

import Layout from "../../components/4_admin_page/Layout";

import TabsView from "../../components/4_admin_page/TabsView";

export interface PropsI {
  profiles: {
    id: number;
    addrss: string | null;
    city: string | null;
    country: string | null;
    profileId: string;
    paymentMethod: string | null;
    postalCode: string | null;
    role: Role;
    taxPrice: number | null;

    user: { email: string; id: string; name: string };
  }[];
  products: {
    id: number;
    createdAt: string;
    updatedAt: string;
    productId: string;
    adminId: string;
    name: string;
    image: string;
    description: string;
    brand: string;
    category: string | null;
    price: number;
    countInStock: number;
    rating: number;
    numReviews: number;
  }[];
  productsCount: number;
  profilesCount: number;
}

type paramsType = {
  // SAME NAME AS [id].tsx
  id: string;
};

export const getServerSideProps: GetServerSideProps<PropsI | {}, paramsType> =
  async (ctx) => {
    const session = await getSession({ req: ctx.req });

    if (!session) {
      ctx.res.writeHead(302, { Location: "/" });

      return {
        props: {},
      };
    }

    const id = ctx.params?.id;

    if ((session as unknown as any).profile.id !== id) {
      ctx.res.writeHead(302, { Location: "/" });

      return {
        props: {},
      };
    }

    const profile = await prismaClient.profile.findUnique({
      where: {
        id: id || "",
      },
      select: {
        role: true,
        id: true,
      },
    });

    if (profile?.role !== "ADMIN") {
      ctx.res.writeHead(302, { Location: `/profile/${id}` });

      return {
        props: {},
      };
    }

    const profiles = (
      await prismaClient.profile.findMany({
        take: 10,
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
          createdAt: "desc",
        },
      })
    ).map((prof, i) => {
      return {
        ...prof,
        id: i + 1,
        profileId: prof.id,
      };
    });

    const profilesCount = await prismaClient.profile.count({
      where: {
        role: {
          not: "ADMIN",
        },
      },
    });

    console.log({ profiles });

    // GETTING PRODUCTS

    const products = (
      await prismaClient.product.findMany({
        where: {
          admin: {
            is: {
              id: profile.id,
            },
          },
        },
        take: 200,
        orderBy: {
          name: "asc",
        },
      })
    ).map((prod, i) => {
      return {
        ...prod,
        createdAt: prod.createdAt.toISOString(),
        updatedAt: prod.updatedAt.toISOString(),
        id: i + 1,
      };
    });

    const productsCount = await prismaClient.product.count({
      where: {
        adminId: {
          equals: profile.id,
        },
      },
    });

    return {
      props: {
        profiles,
        products,
        productsCount,
        profilesCount,
      },
    };
  };

const AdminPage: NP<PropsI> = (props) => {
  const { query } = useRouter();

  console.log({ props, query });

  return (
    <Layout>
      <TabsView {...props} />
    </Layout>
  );
};

export default AdminPage;
