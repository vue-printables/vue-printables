import { defineConfig } from "vitepress";
import path from "path";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue Printables",
  description:
    "A set of Vue.js composables that uses Fabric.js to facilitate designing a custom product.",
  base: "/",
  sitemap: {
    hostname: "https://vue-printables.vuedoo.org",
  },
  head: [
    ["link", { rel: "icon", href: "favicon.ico" }],
    ["meta", { property: "og:type", content: "website" }],
    [
      "meta",
      {
        property: "og:title",
        content:
          "Vue Printables - A set of Vue.js composables that uses Fabric.js to facilitate designing a custom product.",
      },
    ],
    ["meta", { property: "og:site_name", content: "Vue Printables" }],
    [
      "meta",
      {
        property: "og:image",
        content: "https://vue-printables.vuedoo.org/card.png",
      },
    ],
    [
      "meta",
      {
        property: "og:url",
        content: "https://vue-printables.vuedoo.org/",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Vue Printables is a beautiful image viewer component for Vue.js projects, making it easy to create stunning zoomable images for ecommerce, art galleries, infographics, and any other image you need to zoom into.",
      },
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "Vue Printables" }],
    [
      "meta",
      {
        name: "twitter:description",
        content:
          "A set of Vue.js composables that uses Fabric.js to facilitate designing a custom product.",
      },
    ],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://vue-printables.vuedoo.org/card.png",
      },
    ],
    [
      "meta",
      {
        name: "google-site-verification",
        content: "UwPimFC7pZ67l3VejqZhlU959GVThm_sFfwSvR-j1mg",
      },
    ],
  ],
  appearance: "force-dark",
  themeConfig: {
    search: { provider: "local" },
    outline: [2, 3],
    logo: "/logo.svg",
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/introduction" },
    ],
    sidebar: [
      {
        text: "Quick start",
        items: [
          { text: "Introduction", link: "/guide/introduction" },
          { text: "Installation", link: "/guide/installation" },
        ],
      },
      {
        text: "Composables",
        items: [
          { text: "useCanvas()", link: "/guide/useCanvas" },
          { text: "useText()", link: "/guide/useText" },
          { text: "useImage()", link: "/guide/useImage" },
        ],
      },
      {
        text: "Examples",
        items: [
          {
            text: "Front/Back Product Design",
            link: "/examples/frontBackProduct",
          },
          { text: "Full Editor", link: "/examples/fullEditor" },
          // { text: "Multiple Instances", link: "/examples/multiInstances" },
        ],
      },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/vue-printables/vue-printables",
      },
      {
        icon: {
          svg: '<svg role="img" xmlns="http://www.w3.org/2000/svg" width="540" height="210" viewBox="0 0 18 7" style="width: 24px"><path fill="#CB3837" d="M0 0h18v6H9v1H5V6H0V0zm1 5h2V2h1v3h1V1H1v4zm5-4v5h2V5h2V1H6zm2 1h1v2H8V2zm3-1v4h2V2h1v3h1V2h1v3h1V1h-6z"/><path fill="#FFF" d="M1 5h2V2h1v3h1V1H1zM6 1v5h2V5h2V1H6zm3 3H8V2h1v2zM11 1v4h2V2h1v3h1V2h1v3h1V1z"/></svg>',
        },
        link: "https://www.npmjs.com/package/vue-printables",
      },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025 vue-printables",
    },
  },
  vite: {
    resolve: {
      alias: {
        "~": path.join(process.cwd(), "/src"),
      },
    },
  },
});
