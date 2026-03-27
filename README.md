# pelu10075.github.io

[Astro](https://astro.build/)로 만든 포트폴리오 + 마크다운 블로그입니다. [GitHub Pages](https://pages.github.com/)에 배포합니다.

## 로컬에서 실행

Node.js 22 이상이 필요합니다.

```sh
npm install
npm run dev
```

브라우저에서 `http://localhost:4321` 을 엽니다.

## 블로그 글 추가

`src/content/blog/` 폴더에 `.md` 파일을 추가하고, 상단에 프론트매터를 넣습니다.

```yaml
---
title: 제목
description: 한 줄 요약
pubDate: 2026-03-27
tags:
  - 태그
---
```

## GitHub에 올리기

1. GitHub에서 저장소 `pelu10075/pelu10075.github.io` 를 만듭니다 (이미 있으면 생략).
2. 이 폴더에서:

```sh
git init
git add .
git commit -m "Initial portfolio site with blog"
git branch -M main
git remote add origin https://github.com/pelu10075/pelu10075.github.io.git
git push -u origin main
```

3. 저장소 **Settings → Pages** 에서 **Build and deployment** 의 Source를 **GitHub Actions** 로 선택합니다.
4. `main`에 푸시할 때마다 `.github/workflows/deploy.yml` 이 사이트를 빌드해 `https://pelu10075.github.io` 에 반영합니다.

## 빌드만 확인

```sh
npm run build
```

결과물은 `dist/` 에 생성됩니다.
