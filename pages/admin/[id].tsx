/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";
import { useEffect } from "react";

import { useRouter } from "next/router";

// CONVINIENTLY WE HAVE TYPE GENERATED FOR US
// BUT I DIDN'T USE THEM ALL BECAUSE I COPIED
// TYPES AFTER QUERY
// BY HOVERING OVER RESULT
import type { /*  Profile, User, */ Order } from "@prisma/client";

// WE NEED SESSION
import { getSession, useSession } from "next-auth/client";

// WE NEED PRISMA CLIENT
import prismaClient from "../../lib/prisma";

import Layout from "../../components/3_profile_page/Layout";
import UpdateProfile from "../../components/3_profile_page/UpdateProfile";

export interface PropsI {
  placeholder: string;
}

type paramsType = {
  // SAME NAME AS [id].tsx
  id: string;
};

export const getServerSideProps: GetServerSideProps<PropsI | {}, paramsType> =
  async (ctx) => {
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
    // <Layout>

    <div>Admin page</div>
  );
  {
    /* </Layout> */
  }
};

export default AdminPage;
