import config from "../../keystatic.config";
import { createReader } from "@keystatic/core/reader";
import { NextApiRequest, NextApiResponse } from "next";

const reader = createReader("", config);

const getVaccineData = async () => {
  const postSlugs = await reader.collections.vaccines.list();
  return await Promise.all(
    postSlugs.map(async (slug) => {
      const vaccine = await reader.collections.vaccines.read(slug);
      return {
        ...vaccine,
        slug,
      };
    })
  );
};

export default async function posts(req: NextApiRequest, res: NextApiResponse) {
  const resData = await getVaccineData();

  console.log(JSON.stringify(resData, null, 2));
  res.status(200).json(resData);
}
