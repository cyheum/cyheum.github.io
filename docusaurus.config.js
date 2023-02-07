// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "cyh.kr",
  tagline: "안녕하세요, 프론트엔드 개발자 최예흠의 블로그입니다.",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://cyheum.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/cyheum.github.io",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "cyheum", // Usually your GitHub org/user name.
  projectName: "cyheum.github.io", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "ko",
    locales: ["ko"],
  },
  plugins: ["docusaurus-plugin-sass"],
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          routeBasePath: "/",
          blogTitle: "YeHeum's",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/cyheum/cyh.kr.git",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.scss"),
        },
        // gtag: {
        //   trackingID: "G-999123123",
        //   anonymizeIP: true,
        // },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "YeHeum's",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.svg",
        },
        items: [
          { to: "/tags", label: "Tags", position: "left" },
          { to: "/archive", label: "Archive", position: "left" },
          {
            href: "https://github.com/cyheum/cyh.kr.git",
            label: "GitHub",
            position: "right",
          },
          {
            href: "https://congruous-garment-4ee.notion.site/YeHeum-Choi-7b14f477133743339db43cc7fa20ac06",
            label: "resume",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        defaultMode: "dark",
        respectPrefersColorScheme: true,
      },
      // algolia: {
      //   appId: "YOUR_APP_ID",
      //   // 공개 API 키: 커밋해도 문제가 생기지 않습니다.
      //   apiKey: "YOUR_SEARCH_API_KEY",
      //   indexName: "YOUR_INDEX_NAME",
      //   // 옵션: 아래 문서를 참고
      //   contextualSearch: true,
      //   // 옵션: history.push 대신 window.location을 통해 탐색해야 하는 도메인을 지정합니다. 여러 문서 사이트를 크롤링하고 window.location.href를 사용하여 해당 사이트로 이동하려는 경우에 유용한 알골리아 설정입니다.
      //   externalUrlRegex: "external\\.com|domain\\.com",
      //   // 옵션: 알골리아에서 URL 일부를 바꿉니다. 다른 baseUrl을 사용하는 여러 배포본에 대해 같은 검색 인덱스를 사용할 경우 유용합니다. `from` 파라미터에 정규식이나 문자열을 사용할 수 있습니다. 예를 들면 localhost:3000 과 myCompany.com/docs 같은 경우입니다.
      //   replaceSearchResultPathname: {
      //     from: "/docs/", // or as RegExp: /\/docs\//
      //     to: "/",
      //   },
      //   // 옵션: 알골리아 검색 파라미터
      //   searchParameters: {},
      //   // 옵션: 기본적으로 활성화된 검색 페이지 경로(비활성화하려면 `false`로 설정)
      //   searchPagePath: "search",
      // },
    }),
};

module.exports = config;
