import { defineConfig } from 'vitepress'
import { loadTheme } from 'shiki'
const lightThemeConfig = await loadTheme('./themes/solarized-light.json')
const darkThemeConfig = await loadTheme('./themes/one-dark-pro.json')

export default defineConfig({
  appearance: true,
  title: 'litUI',
  titleTemplate: 'Vue',
  base: '/',
  description: 'A lightweight and practical UI component library of Vue 3',
  ignoreDeadLinks: true,
  lang: 'en-US',
  lastUpdated: true,
  markdown: {
    theme: {
      light: lightThemeConfig,
      dark: darkThemeConfig
    },
    lineNumbers: true
  },
  outDir: '../public',
  cleanUrls: 'without-subfolders',
  themeConfig: {
    logo: 'lit.svg',
    siteTitle: false,
    nav: [
      {
        text: 'components',
        link: '/comments'
      }
    ],
    sidebar: {
      '/components/': [
        {
          text: 'basic',
          collapsible: true,
          collapsed: true,
          items: []
        }
      ]
    },
    outline: 2,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/liting-yes/litui' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Liting'
    },
    lastUpdatedText: 'Updated Date'
  }
})
