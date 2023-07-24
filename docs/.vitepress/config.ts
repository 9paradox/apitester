import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/apitester/',
  title: 'apitester - A simple rest api testing framework',
  description:
    'A simple rest api testing framework. Crafted with easy to use method call and method chaining, so you can write clean api testing automation scripts in javascript and typescript.',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: 'apitester',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/introduction/what-is-apitester' },
      { text: 'Examples', link: '/docs/examples/simple' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          {
            text: 'What is apitester?',
            link: '/docs/introduction/what-is-apitester',
          },
          { text: 'Getting started', link: '/docs/introduction/get-started' },
          {
            text: 'Setting up Testcases',
            link: '/docs/introduction/setting-up-testcases',
          },
        ],
      },
      {
        text: 'Examples',
        items: [{ text: 'Simple examples', link: '/docs/examples/simple' }],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/9paradox/apitester' },
    ],
  },
});
