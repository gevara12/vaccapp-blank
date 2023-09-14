import {
  GitHubConfig,
  LocalConfig,
  collection,
  config,
  fields,
  singleton,
} from '@keystatic/core';

import { ComponentBlocks } from './components/ComponentBlocks';
import { makeId } from './utils/makeId';

const storage: LocalConfig['storage'] | GitHubConfig['storage'] =
  process.env.NODE_ENV === 'development'
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: {
          owner: 'gevara12',
          name: 'vaccapp-blank',
        },
      };

export default config({
  storage,
  singletons: {
    home: singleton({
      label: 'Home',
      path: 'content/pages/home/',
      schema: {
        heading: fields.document({
          formatting: {
            inlineMarks: {
              bold: true,
            },
          },
          label: 'Heading (note: text that is bolded will show up in red)',
        }),
      },
    }),
    about: singleton({
      label: 'About',
      path: 'content/pages/about/',
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
          label: 'Content',
          componentBlocks: ComponentBlocks,
        }),
      },
    }),
  },
  collections: {
    posts: collection({
      label: 'Инфекции',
      path: 'content/posts/*/',
      slugField: 'title',
      schema: {
        title: fields.slug({
          name: {
            label: 'Название',
          },
        }),
        vaccines: fields.array(
          fields.relationship({
            label: 'Infection vaccine',
            collection: 'vaccines',
          }),
          {
            label: 'Вакцины',
            itemLabel: (props) => props?.value || 'Выберите вакцину',
          },
        ),

        contraindications: fields.document({
          formatting: true,
          dividers: true,
          links: true,
          layouts: [
            [1, 1],
            [1, 1, 1],
            [2, 1],
            [1, 2],
            [1, 2, 1],
          ],
          label: 'Противопоказания',
          // componentBlocks: ComponentBlocks,
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
          label: 'Возможные реакции и осложнения',
          componentBlocks: ComponentBlocks,
        }),
        id: fields.text({ defaultValue: makeId(5), label: 'ID' }),
      },
    }),
    vaccines: collection({
      label: 'Вакцины',
      path: 'content/vaccines/*',
      slugField: 'name',
      schema: {
        name: fields.slug({
          name: {
            label: 'Название',
            validation: {
              length: {
                min: 1,
              },
            },
          },
        }),
        isAnimate: fields.select({
          label: 'Вид вакцины',
          options: [
            { value: 'animate', label: 'Живая' },
            { value: 'inanimate', label: 'Неживая' },
          ],
          defaultValue: 'inanimate',
        }),
        firstVaccination: fields.text({
          label: 'Возраст 1',
        }),
        secondVaccination: fields.text({
          label: 'Вторая вакцинация',
        }),
        avatar: fields.image({
          label: 'Author avatar',
          directory: 'public/images/authors',
        }),
      },
    }),
  },
});
