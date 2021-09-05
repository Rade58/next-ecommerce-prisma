import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";
import { supabase as supaClient } from "../../../lib/supabase";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { text } = req.body as { text: string };

  try {
    //  const slugs = await prismaClient.$queryRaw<
    //    { value: string; label: string }[]
    //  >(/* sql */ `
    //    SELECT "public"."Product"."productId" AS value,
    //          name AS label FROM "public"."Product"
    //    WHERE to_tsvector(name) @@ to_tsquery(${text});
    //  `);

    // const slugs = await supaClient
    // .from('"public"."Product"')
    // .select()
    // .textSearch("name", `'${text}'`);

    const slugs = await supaClient.from("users").select("name").limit(10);

    console.log(slugs);

    return res.status(200).json("some");
  } catch (err) {
    console.error(err);

    return res.status(400).send("something wen wrong");
  }
});

export default handler;
