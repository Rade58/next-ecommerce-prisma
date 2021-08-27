/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";
import { useEffect } from "react";

import { useRouter } from "next/router";

import type { Profile, User, Order } from "@prisma/client";

import { getSession, useSession } from "next-auth/client";

import prismaClient from "../../lib/prisma";

import Layout from "../../components/4_admin_page/Layout";

import TabsView from "../../components/4_admin_page/TabsView";

export interface PropsI {
  profiles: (Profile & {
    user: User;
  })[];
}

type paramsType = {
  // SAME NAME AS [id].tsx
  id: string;
};

export const getServerSideProps: GetServerSideProps<PropsI | {}, paramsType> =
  async (ctx) => {
    // LETS GET SESSION FIRST
    const session = await getSession({ req: ctx.req });

    if (!session) {
      ctx.res.writeHead(302, { Location: "/" });

      return {
        props: {},
      };
    }

    const id = ctx.params?.id;

    // LET'S ALSO REDIRECT IF WE HAVE WRONG PROFILE
    if ((session as unknown as any).profile.id !== id) {
      ctx.res.writeHead(302, { Location: "/" });

      return {
        props: {},
      };
    }

    // OBTAIN PROFILE AND CHECK FOR ROLE

    const profile = await prismaClient.profile.findUnique({
      where: {
        id: id || "",
      },
      select: {
        role: true,
      },
    });

    // CHECKING THE ROLE ON PROFILE
    // REDIRECT TO PROFILE PAGE
    if (profile?.role !== "ADMIN") {
      ctx.res.writeHead(302, { Location: `/profile/${id}` });

      return {
        props: {},
      };
    }

    // WE WILL GET USERS FOR NOW AND LATER WHAEN WE FIND OUT HOW TO
    // SEED DATBASE WE WILL QUERY FOR SEEDED DATA
    // SEEDED DAT IS DUMMY DATA WE CAN POPULATE DATBASE WITH
    // SO IT WOULD BE EASER FOR OUR DEVELOPMENT

    // WE ARE GETTING EVERY PROFILE WHICH ROLE IS NOT ADMIN
    // BUT WE ARE GOING TO QUERY User SINCE WE WANT TO ORDER BY

    // MAYBE IT WOULD BE BETTER FOR US TO CREATE RAW QUERY
    // BUT THIS ALSO WORKS

    // BECAUSE WITH RAW QUERIES, DATES ARENT TURNED TO Date
    // AN WE DON'T NEET TO CHERRY PICK LIKE BELLOW

    // ONLY THING WITH ROW QUERIES YOU WOULD LAACK TYPESCCRIPT SUPPORT
    // FOR RESULT

    const profiles = await prismaClient.profile.findMany({
      // WE WILL TAKE ONLY 10 RECORDS
      take: 10,
      //
      where: {
        role: {
          not: "ADMIN",
        },
      },
      select: {
        // I'M EXCLUDING Dates BECAUSE
        // I CAN'T SERIALIZE THEM
        // I CAN'T PSS THEM AS PROPS BEFORE TRANSFORMING THEM TO ISOS STRINGS

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
        // I DON'T KNOW IS IT GOOD PRACTICE TO ORDER LIKE
        // THIS AND DISPLAY TO USER
        // I'M JUST SHOWING YOU THAT
        // YOU CAN USE THIS
        // AND LATTER WHEN I SHOW YOU PAGINATION
        // WE ARE GOING TO USE THIS KIND OF ORDERING TOO
        createdAt: "desc",
      },
    });

    console.log({ profiles });

    // FOR NOW, WE WILL ONLY RETURN USER AND PROFILE
    // AND LATER LIKE I SAID, WE ARE GOING TO PASS
    // PRODUCTS AND ORDERS TOO
    return {
      props: {
        profiles,
      },
    };
  };

const AdminPage: NP<PropsI> = (props) => {
  const { query } = useRouter();

  console.log({ props, query });

  return (
    <Layout>
      <TabsView />
    </Layout>
  );
};

export default AdminPage;
