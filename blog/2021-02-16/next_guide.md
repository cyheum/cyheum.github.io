---
slug: "next_guide_1"
title: "[Next.js] 우리의 사이트에 날개를 달아보자 - 1"
authors: [yeheum]
tags: [SSR, next, next.js, react]
---

![](https://images.velog.io/images/cyheum/post/4e567e6e-d810-41a2-9b9e-8ab63fe7ff12/nextjs.png)

**로고부터 마음에 드는 Next.js를 알아보도록 하자!**

# \* 서버사이드 렌더링? (SSR)

> 서버사이드 렌더링이란 서버에서 리액트 코드를 실행해서 렌더링하는 것을 말한다.

**그렇다면 서버사이드 렌더링이 왜 필요한 것인가?**

- 검색 엔진 최적화 (SEO)를 도와준다.
- 빠른 첫 페이지 렌더링을 도와준다.

요즘 주변을 보면 굉장히 많은 스타트업들이 생겨나고 또 보여진다.
그렇다면 각 회사들이 살아남으려면 그만큼 사용자들에게 잘 노출되어야 한다.

구글을 제외한 다른 검색 엔진에서는 자바스크립트를 실행하지 않기 때문에 클라이언트 렌더링만 하는 사이트는 내용이 없는 사이트와 동일하게 처리된다
=> 구글도 SSR 사이트에 더 높은 점수를 부여함.

자 그러면 Next.js를 사용해 보기 전에 먼저 직접 서버사이드 렌더링 환경을 구축해 보자.

## # 서버사이드 렌더링 초급

- 리액트에서 제공하는 renderToString, hydrate 함수를 사용해 본다.
- 서버에서 생성된 데이터를 클라이언트로 전달하는 방법을 알아본다.
- styled-component로 작성된 스타일이 서버사이드 렌더링 시 어떻게 처리되는지 알아본다.
- 서버용 번들 파일을 만드는 방법을 알아본다.

```
mkdir test-ssr
cd test-ssr
npm init -y
npm install react react-dom
npm install @babel/core @babel/preset-env @babel/preset-react
npm install webpack webpack-cli babel-loader clean-webpack-plugin html-webpack-plugin
```

### 1. 클라이언트에서만 렌더링해 보기

![](https://images.velog.io/images/cyheum/post/a54eaf84-f17d-46fd-8b5f-b6bcd119731e/image.png)

프로젝트 루트에 src폴더를 만들고 그 밑에 Home.js, About.js 파일을 만든다.
각 파일은 웹사이트의 페이지를 나타내며 페이지 전환을 테스트하는 용도로 사용된다.

```js
// Home.js
import React from "react";

export default function Home() {
 return (
   <div>
     <h3>This is home page</h3>
   </div>
 );
}

// About.js
import React from "react";

export default function Ablut() {
 return (
   <div>
     <h3>This is about page</h3>
   </div>
 );
}
```

이 Home.js와 About.js를 렌더링하는 App 컴포넌트를 만들어 보자.
App 컴포넌트는 버튼을 통해 각 페이지로 이동할 수 있는 기능을 제공한다.

```js
import React, { useState, useEffect } from "react";
import Home from "./Home";
import About from "./About";

export default function App({ page }) {
  const [page, setPage] = useState(page);

  useEffect(() => {
    window.onpopstate = (e) => {
      setPage(e.state);
    };
  }, []);

  function onChangePage(e) {
    const newPage = e.target.dataset.page;
    window.history.pushState(newPage, "", `/${newPage}`);
    setPage(newPage);
  }
  const PageComponent = page === "home" ? Home : About;

  return (
    <div className='container'>
      <button data-page='home' onClick={onChangePage}>
        Home
      </button>
      <button data-page='about' onClick={onChangePage}>
        About
      </button>
      <PageComponent />
    </div>
  );
}
```

** onpopstate 는 뭘까? **
[\* onpopstate(MDN)](https://developer.mozilla.org/ko/docs/Web/API/WindowEventHandlers/onpopstate)

![](https://images.velog.io/images/cyheum/post/aae4ef9d-fe2e-406f-8b43-ac47b0ea02d0/image.png)

즉 popstate를 통해서 서버사이드 렌더링시 두 개의 페이지 간에 state를 복사해주기 때문에 state 관리가 가능한 것 같다!

src 폴더 밑에 index.js 파일을 만들고 앞에서 만든 App 컴포넌트를 렌더링해 보자.

```js
import React from "react";
import ReactDom from "react-dom";
import App from "./App";

ReactDom.render(<App page='home' />, document.getElementById("root"));
```

**이제 웹팩을 설정해 보자! (나는 웹팩이 제일 어려운 것 같다)**

프로젝트 루트에 webpack.config.js 파일을 만들고 다음 코드를 입력한다.

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./template/index.html",
    }),
  ],
  mode: "production",
};
```

이제 template 폴더를 만들고 그 밑에 index.html 파일을 만든다.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>test-ssr</title>
  </head>
  <body>
    <div id="root" />
  </body>
</html>
```

**바벨 설정하기**

자바스크립트 파일을 컴파일 하기 위해 바벨 설정 파일을 작성해 보자.
루트에 babellnofig.js 파일을 만들자

```js
const presets = ["@babel/preset-react", "@babel/preset-env"];
const plugins = [];
module.exports = { presets, plugins };
```

babel.config.js 파일의 설정은 babel-loader가 실행될 때 적용된다.

** 클라이언트 렌더링 확인하기 !!**
![](https://images.velog.io/images/cyheum/post/2442f9d7-ba5d-41e3-a063-90f31002104d/image.png)
이제 웹펙을 실행해 보자.
`npx webpack`
![](https://images.velog.io/images/cyheum/post/2bfaa368-3737-4e05-999c-4b34bdbfe500/image.png)

이건 안되고..

![](https://images.velog.io/images/cyheum/post/7a6223b6-a3cb-48bd-8721-9e13f7399a1c/image.png)
![](https://images.velog.io/images/cyheum/post/410d38c3-db8e-4bdb-b836-2bbdceb1fad5/image.png)
이건 된다!

url이 file://로 시작하기 때문에 push State 메서드를 호출할 때 에러가 발생하기 때문이다. 이는 서버를 직접 띄우는 방식을 이용하면 해결된다.

당연하게도 첫 요청에 대한 응답으로 돌아오는 HTML 에는 버튼이나 문구를 표현하는 돔 요소가 없다. 버튼이나 문구의 돔 요소는 자바스크립트가 실행되면서 추가된다. 만약 브라우저 옵션에서 자바스크립트 실행을 허용하지 않고 실행해 보면 화면에는 아무것도 보이지 않는 것을 확인할 수 있다.

### 2. 서버사이드 렌더링 함수 사용해 보기

**서버사이드 렌더링 함수 네 개**

- renderToString : 정적 페이지를 렌더링할 때 사용
- renderToNodeStream : 상동
- renderToStaticMarkup : 최초 렌더링 이후에도 계속해서 상태 변화에 따라 화면을 갱신해야 할 때 사용
- renderToStaticNodeStream : 상동

먼저 **서버사이드 렌더링에 필요한 패키지**를 설치해 보자.

`npm install express @babel/cli @babel/plugin-transform-modules-commonjs`

웹 서버를 띄우기 위해 express 패키지를 설치하고, 서버에서 사용될 자바스크립트 파일을 컴파일 할 때 사용하기 위해 @babel/cli 패키지를 설치한다.
=> 서버에서도 JSX 문법으로 작성된 자바스크립트를 실행해야 하므로

ESM으로 작성된 모듈 시스템을 commonJS로 변경하기 위해서 그 뒤에 패키지를 설치했다.

**웹 서버 코드 작성하기**

src 폴더 밑에 server.js 파일을 만들고 다음 코드를 입력하자.

```js
import express from "express";
import fs from "fs";
import path from "path";
import { renderToString } from "react-dom/server";
import React from "react";
import App from "./App";

const app = express();
const html = fs.readFileSync(
  path.resolve(__dirname, "../dist/index.html"),
  "utf8"
);
app.use("/dist", express.static("dist"));
app.get("/favicon.ico", (req, res) => res.sendStatus(204));
app.get("*", (req, res) => {
  const renderString = renderToString(<App page='home' />);
  const result = html.replace(
    '<div id="root"></div>',
    `<div id="root">${renderString}</div>`
  );
  res.send(result);
});

app.listen(3000);
```

책을 보면서 작성할 뿐이니 모르는 부분들이 많다. 정리해보도록 하자.

- react-dom 패키지의 server 폴더 밑에 서버에서 사용되는 기능이 모여 있다.
- express 객체인 app 변수를 이용해서 미들웨어와 url 경로 설정을 할 수 있따.
- renderToString 함수를 사용해서 App 컴포넌트를 렌더링한다. renderToString 함수는 문자열을 반환한다.

**바벨 설정하기**

서버와 클라이언트에서 필요한 바벨 플러그인과 프리셋은 다음과 같다.

- 클라이언트
  - 바벨 프리셋: @babel/preset-react, @babel/preset-env
  - 바벨 플러그인: 없음
- 서버
  - 바벨 프리셋: @babel/preset-react
  - 바벨 플러그인: @babel/plugin-transform-modules-commonjs

이제 프로젝트 루트에 .bablerc.common.js, .babelrc.server.js, .babelrc.client.js 파일을 만들고 다음 코들르 입력한다.

```js
// .babelrc.common.js
const presets = ["@babel/preset-react"];
const plugins = [];
module.exports = { presets, plugins };

// .babelrc.client.js
const config = require("./.babelrc.common.js");
config.presets.push("@babel/preset-env");
module.exports = config;

// .babelrc.server.js
const config = require("./.babelrc.common.js");
config.plugins.push("@babel/plugin-transform-modules-commonjs");
module.exports = config;
```

공통으로 사용되는 설정은 .babel.common.js 에서 관리하고 클라이언트와 서버측 에서는 이 설정을 가져와서 사용한다.

**웹팩 설정하기**

웹팩 설정 파일에서는 HTML에 추가되는 번들 파일의 경로와 바벨 설정 파일의 경로를 수정해야 한다.

![](https://images.velog.io/images/cyheum/post/50033c42-6b23-4b30-93ad-f6910949aa2e/image.png)

퍼블릭패스와 옵션을 추가했다.

- publicPath 설정은 html-webpack-plugin이 HTML 생성 시 HTML 내부 리소스 파일의 경로를 만들 때 사용된다. publicPath 설정 없이 생성된 HTML 파일은 브라우저에서 바로 실행하면 문제가 없지만 서버사이드 렌더링을 할 때는 문제가 된다.

**기타 설정 및 프로그램 실행하기**

서버 측 코드는 @babel/cli를 이용해서 바벨만 실행하고, 클라이언트 측 코드는 웹팩을 실행한다. package.json을 수정해보자.

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build-server": "babel src --out-dir dist-server --config-file ./.babelrc.server.js",
    "build": "npm run build-server && webpack",
    "start": "node dist-server/server.js"
  },
```

서버사이드 렌더링을 하면 이미 돔 요소가 만들어진 상태이기 때문에 클라이언트 측에서 또다시 렌더링할 필요가 없다. 단, 각 돔 요소에 필요한 이벤트 처리 함수를 연결해야 한다. 이벤트 처리함수를 연결하지 않으면 화면은 잘 보이지만 사용자가 버튼을 눌러도 반응하지 않는다.
리액트에서 제공하는 hydrate 함수는 서버사이드 렌더링의 결과로 만들어진 돔 요소에 필요한 이벤트 처리 함수를 붙여 준다.

index.js 파일에서 hydrate 함수를 사용하도록 추가해보자.

```js
ReactDom.hydrate(<App page='home' />, document.getElementById("root"));
```

이제 다음과 같이 실행해 보자.

`npm run build`
`npm start`

![](https://images.velog.io/images/cyheum/post/7c034533-e109-456f-9a22-30634ce60ac9/image.png)

![](https://images.velog.io/images/cyheum/post/acac3734-b1e5-426d-8bed-b3cae0e55367/image.png)

그리고 브라우저에서 로컬호스트 3000으로 접속해 보면 화면이 제대로 렌더링되고 페이지를 전환하는 버튼도 잘 동작하는 것을 확인 할 수 있다.

내용이 좀 길어서 서버 데이터를 클라이언트로 전달하는 부분부터 다음 블로깅에 쓰려고 한다.
