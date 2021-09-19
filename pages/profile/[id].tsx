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
import PastOrders from "../../components/3_profile_page/PastOrders";

export interface PropsI {
  profile: {
    id: string;
    addrss: string | null;
    country: string | null;
    city: string | null;
    ordersHistory: Order[];
    postalCode: string | null;
    taxPrice: number | null;
    user: {
      id: string;
      email: string | null;
      name: string | null;
      image: string | null;
    };
  };
}

type paramsType = {
  // SAME NAME AS [id].tsx
  id: string;
};

export const getServerSideProps: GetServerSideProps<PropsI | {}, paramsType> =
  async (ctx) => {
    const { params } = ctx;

    const profileId = params?.id || "";

    // GETTING SESSION
    // SESSION SHOUD HAVE userId
    // BECAUSE WE INSERTED IT THER THROU session CALLLBACK
    // IN NEXT-AUTH CONFIGURATION
    // DON'T FORGET TO PASS REQUST
    // YOU CAN PASS WHOLE CONTEXT IF YOU WANT
    const session = await getSession({ req: ctx.req });

    const headers = ctx.req.headers;

    // LET'S FETCH PROFILE
    // WE CAN DO A JOIN TO GET User RECORD TOGETHER
    // WITH Profile RECORD
    // BECAUSE Profile RECORD HAS A FORAIGN KEY OF User (id)

    const profileWithUser = await prismaClient.profile.findUnique({
      where: {
        id: profileId,
      },
      select: {
        id: true,
        addrss: true,
        country: true,
        city: true,
        ordersHistory: true,
        postalCode: true,
        // I INCLUDED USER LIKE THIS
        user: {
          select: {
            email: true,
            name: true,
            image: true,
            id: true,
          },
        },

        // I WON'T INCLUDE DATES (FOR Profile OR FOR User)
        // BECAUSE PRISMA RETURNS     Date   OBJECT
        // I CAN'T PASS Date INSTANCES AS PROPS
        // I WOULD NEED TO STRINGIFY THEM
        // AND I DON'T REALLY NEED DATE OBJECTS HERE
      },
      /* include: {
        user: true,
      }, */
    });

    console.log({ profileWithUser, session, headers });

    // LET'S DO REDIRECT IF THERE IS NO PROFILE
    // OR USER ON SESSION DOESN'T MATCH WITH OBTAINED USER

    // IF YOU REMEMBER WE WERE THE ONE TO ATTACH userId ON SESSIN
    // THROUGH CALLBACK IN NEXT-AUTH CONFIGURATION

    if (!profileWithUser) {
      ctx.res.writeHead(302, { Location: "/" });

      return {
        props: {
          profile: {},
        },
      };
    }

    if (session?.userId !== profileWithUser.user.id) {
      ctx.res.writeHead(302, { Location: "/" });
      return {
        props: {
          profile: {},
        },
      };
    }

    // console.log(!profileWithUser, session);

    return {
      props: {
        profile: profileWithUser,
      },
    };
  };

const ProfilePage: NP<PropsI> = (props) => {
  // FOR NOW LET'S JUST SHOW STUFF
  // LETS SHOW WHAT IS IN THE PROPS

  const { profile } = props;

  const { query } = useRouter();

  console.log({ props, query });

  const { id, country, user, city, addrss, postalCode, taxPrice } = profile;

  return (
    <Layout>
      <UpdateProfile
        id={id}
        name={user.name || ""}
        addrss={addrss || ""}
        city={city || ""}
        country={country || ""}
        postalCode={postalCode || ""}
        taxPrice={taxPrice || 0}
      />
      <PastOrders orders={props.profile.ordersHistory} />
    </Layout>
  );
};

export default ProfilePage;
