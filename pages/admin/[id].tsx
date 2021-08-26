/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";
import { useEffect } from "react";

import { useRouter } from "next/router";

import type { Profile, User, Order } from "@prisma/client";

import { getSession, useSession } from "next-auth/client";

import prismaClient from "../../lib/prisma";

import Layout from "../../components/4_admin_page/Layout";

export interface PropsI {
  placeholder: string;
  profiles: Profile[];
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

    return {
      props: {
        placeholder: "",
      },
    };
  };

const AdminPage: NP<PropsI> = (props) => {
  const { query } = useRouter();

  console.log({ props, query });

  return (
    <Layout>
      <div>Admin page</div>
    </Layout>
  );
};

export default AdminPage;
