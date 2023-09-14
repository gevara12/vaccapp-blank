import { createReader } from '@keystatic/core/reader';
import { DocumentRenderer } from '@keystatic/core/renderer';
import type { InferGetStaticPropsType } from 'next';

import Divider from '../components/Divider';
import Seo from '../components/Seo';
import config from '../keystatic.config';

async function getHomeData() {
  const reader = createReader('', config);
  const homePage = await reader.singletons.home.read();
  const homePageHeading = await (homePage?.heading() || []);

  return {
    ...homePage,
    heading: homePageHeading,
  };
}

// async function getPostData() {
//   const postSlugs = await reader.collections.posts.list();
//   const postData = await Promise.all(
//     postSlugs.map(async (slug) => {
//       const post = await reader.collections.posts.read(slug);
//       console.log('post', post);
//       const content = (await post?.reactionsAndComplications()) || [];
//       return {
//         ...post,
//         content,
//         slug,
//       };
//     }),
//   );
//   return postData;
// }

export async function getStaticProps() {
  const [home] = await Promise.all([getHomeData()]);

  return {
    props: {
      home,
      // posts,
    },
  };
}

export default function Home({
  home,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="px-4 md:px-28 max-w-7xl mx-auto">
      <Seo />
      {home.heading && (
        <>
          <DocumentRenderer
            document={home.heading}
            renderers={{
              inline: {
                bold: ({ children }) => {
                  return <span className="text-cyan-700">{children}</span>;
                },
              },
              block: {
                paragraph: ({ children }) => {
                  return (
                    <h1 className="text-center font-bold text-2xl max-w-xs sm:text-5xl sm:max-w-2xl lg:text-7xl lg:max-w-[60rem] mx-auto">
                      {children}
                    </h1>
                  );
                },
              },
            }}
          />
          <Divider />
        </>
      )}
    </div>
  );
}
