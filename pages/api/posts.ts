import { createReader } from '@keystatic/core/reader';
import { NextApiRequest, NextApiResponse } from 'next';

import config from '../../keystatic.config';

const reader = createReader('', config);

const getPostData = async () => {
  const postSlugs = await reader.collections.posts.list();

  return await Promise.all(
    postSlugs.map(async (slug) => {
      const post = await reader.collections.posts.read(slug);

      const vaccinesData = post
        ? await Promise.all(
            Array.from(post.vaccines, async (vaccineSlug) => {
              const vaccine = await reader.collections.vaccines.read(
                vaccineSlug || '',
              );
              return { ...vaccine, slug: vaccineSlug };
            }),
          )
        : [];

      console.log('pppost', post);

      const reactionsAndComplications =
        (await post?.reactionsAndComplications()) || [];

      return {
        ...post,
        vaccines: vaccinesData,
        reactionsAndComplications,
        slug,
      };
    }),
  );
};

export default async function posts(req: NextApiRequest, res: NextApiResponse) {
  const resData = await getPostData();

  // console.log(JSON.stringify(resData, null, 2));
  res.status(200).json(resData);

  res.end();
  // const data = await JSON.stringify(resData);
  // return {
  //   props: {
  //     posts: data,
  //   },
  // };
}
