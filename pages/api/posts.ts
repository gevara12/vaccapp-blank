import config from "../../keystatic.config";
import { createReader } from "@keystatic/core/reader";
import { NextApiRequest, NextApiResponse } from "next";

const reader = createReader("", config);

const getPostData = async () => {
  const postSlugs = await reader.collections.posts.list();

  return await Promise.all(
    postSlugs.map(async (slug) => {
      const post = await reader.collections.posts.read(slug);
      const content = (await post?.content()) || [];
      return {
        ...post,
        content,
        slug,
      };
    })
  );
};

export default async function posts(req: NextApiRequest, res: NextApiResponse) {
  const resData = await getPostData();

  // console.log(JSON.stringify(resData, null, 2));
  res.status(200).json(resData);
  res.end();
}
