import config from "../../keystatic.config";
import { createReader } from "@keystatic/core/reader";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const appDirectory = path.join(process.cwd(), "");

console.log("appDirectory", appDirectory);

const reader = createReader(appDirectory, config);

const getVaccineData = async () => {
  const postSlugs = await reader.collections.vaccines.list();

  // console.log("postSlugs", postSlugs);

  return await Promise.all(
    postSlugs.map(async (slug) => {
      const vaccine = await reader.collections.vaccines.read(slug);

      // console.log("vacc", vaccine);

      return {
        ...vaccine,
        slug,
      };
    })
  );
};

export default async function vaccines(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const resData = await getVaccineData();

  console.log(JSON.stringify(resData, null, 2));
  res.status(200).json(resData);
  res.end();
}
