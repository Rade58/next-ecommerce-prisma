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
    const session = (await getSession()) || { userId: "" };

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
        taxPrice: true,
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

    console.log({ profileWithUser });

    // LET'S DO REDIRECT IF THERE IS NO PROFILE
    // OR USER ON SESSION DOESN'T MATCH WITH OBTAINED USER
    if (!profileWithUser || session.userId !== profileWithUser.user.id) {
      ctx.res.writeHead(302, { Location: "/" });

      return {
        props: {
          profile: {},
        },
      };
    }

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

  return (
    <div>
      🦉
      <br />
      {JSON.stringify({ profile }, null, 2)}
    </div>
  );
};

export default ProfilePage;
