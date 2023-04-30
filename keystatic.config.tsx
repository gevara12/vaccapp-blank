import { ComponentBlocks } from "./components/ComponentBlocks";
import { makeId } from "./utils/makeId";
import {
  collection,
  config,
  fields,
  GitHubConfig,
  LocalConfig,
  singleton,
} from "@keystatic/core";

const storage: LocalConfig["storage"] | GitHubConfig["storage"] =
  process.env.NODE_ENV === "development"
    ? { kind: "local" }
    : {
        kind: "github",
        repo: {
          owner: "gevara12",
          name: "vaccapp-blank",
        },
      };

export default config({
  storage,
  singletons: {
    home: singleton({
      label: "Home",
      path: "content/pages/home/",
      schema: {
        heading: fields.document({
          formatting: {
            inlineMarks: {
              bold: true,
            },
          },
          label: "Heading (note: text that is bolded will show up in red)",
        }),
      },
    }),
    about: singleton({
      label: "About",
      path: "content/pages/about/",
      schema: {
        content: fields.document({
          formatting: true,
          dividers: true,
          links: true,
          layouts: [
            [1, 1],
            [1, 1, 1],
            [2, 1],
            [1, 2, 1],
          ],
          label: "Content",
          componentBlocks: ComponentBlocks,
        }),
      },
    }),
  },
  collections: {
    authors: collection({
      label: "Authors",
      path: "content/authors/*",
      slugField: "name",
      schema: {
        name: fields.slug({
          name: {
            label: "Name",
            validation: {
              length: {
                min: 1,
              },
            },
          },
        }),
        role: fields.text({ label: "Role" }),
        avatar: fields.image({
          label: "Author avatar",
          directory: "public/images/authors",
        }),
      },
    }),
    posts: collection({
      label: "Инфекции",
      path: "content/posts/*/",
      slugField: "title",
      schema: {
        title: fields.slug({
          name: {
            label: "Название",
          },
        }),
        vaccines: fields.array(
          fields.relationship({
            label: "Infection vaccine",
            collection: "vaccines",
          }),
          {
            label: "Вакцины",
            itemLabel: (props) => props.value || "Please select a vaccine",
          }
        ),
        // summary: fields.text({
        //   label: "Summary",
        //   validation: { length: { min: 4 } },
        // }),
        // publishedDate: fields.date({ label: "Published Date" }),
        // coverImage: fields.image({
        //   label: "Image",
        //   directory: "public/images/posts",
        // }),
        // wordCount: fields.integer({
        //   label: "Word count",
        // }),
        // authors: fields.array(
        //   fields.relationship({
        //     label: "Post author",
        //     collection: "authors",
        //   }),
        //   {
        //     label: "Authors",
        //     itemLabel: (props) => props.value || "Please select an author",
        //   }
        // ),
        contraindications: fields.document({
          formatting: true,
          dividers: true,
          links: true,
          layouts: [
            [1, 1],
            [1, 1, 1],
            [2, 1],
            [1, 2, 1],
          ],
          label: "Противопоказания",
          componentBlocks: ComponentBlocks,
        }),
        reactionsAndComplications: fields.document({
          formatting: true,
          dividers: true,
          links: true,
          layouts: [
            [1, 1],
            [1, 1, 1],
            [2, 1],
            [1, 2, 1],
          ],
          label: "Возможные реакции и осложнения",
          componentBlocks: ComponentBlocks,
        }),
        id: fields.text({ defaultValue: makeId(5), label: "ID" }),
      },
    }),
    vaccines: collection({
      label: "Вакцины",
      path: "content/vaccines/*",
      slugField: "name",
      schema: {
        name: fields.slug({
          name: {
            label: "Название",
            validation: {
              length: {
                min: 1,
              },
            },
          },
        }),
        firstVaccination: fields.text({
          label: "Возраст 1",
        }),
        secondVaccination: fields.text({
          label: "Вторая вакцинация",
        }),
        avatar: fields.image({
          label: "Author avatar",
          directory: "public/images/authors",
        }),
      },
    }),
    externalArticles: collection({
      label: "External Article",
      path: "content/externalArticles/*/",
      slugField: "title",
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            validation: { length: { min: 4 } },
          },
        }),
        directLink: fields.url({
          label: "Article Link",
        }),
        source: fields.text({
          label: "Link Source",
          defaultValue: "Read more.",
        }),
        coverImage: fields.image({
          label: "Cover Image",
          directory: "public/images/external-articles",
        }),
        summary: fields.text({
          label: "Summary",
          validation: { length: { min: 4, max: 200 } },
        }),
        publishedDate: fields.date({ label: "Published Date" }),
      },
    }),
  },
});
