import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'slingshot-pipelines',
  tagline: 'Component-aware CI/CD for GitHub Actions',
  favicon: 'img/logo.svg',

  future: {
    v4: true,
  },

  // GitHub Pages: https://slingshot-pipelines.github.io/docs/
  url: 'https://slingshot-pipelines.github.io',
  baseUrl: '/docs/',
  organizationName: 'slingshot-pipelines',
  projectName: 'docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: ['@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  presets: [
    [
      'classic',
      {
        // Docs-only mode: docs are served from the site root.
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/slingshot-pipelines/docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'slingshot-pipelines',
      logo: {
        alt: 'slingshot-pipelines logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/slingshot-pipelines',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/'},
            {label: 'Getting started', to: '/getting-started/adopt-in-a-repo'},
            {label: 'Example: rx-refill-reminders', to: '/examples/rx-refill-reminders'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'slingshot-pipelines on GitHub', href: 'https://github.com/slingshot-pipelines'},
            {label: 'rx-refill-reminders on GitHub', href: 'https://github.com/rx-refill-reminders'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} slingshot-pipelines. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'hcl'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
