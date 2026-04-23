# pelu10075.github.io

[Astro](https://astro.build/)로 만든 포트폴리오 + 마크다운 블로그입니다. [GitHub Pages](https://pages.github.com/)에 배포합니다.

## 로컬에서 실행

Node.js 22 이상이 필요합니다.

```sh
npm install
npm run dev
```

브라우저에서 `http://localhost:4321` 을 엽니다.

## 포트폴리오(홈) 내용 수정

표시 문구·링크·프로젝트 목록은 **`src/config/site.ts`** 한 파일에서 다룹니다. 히어로, 소개, 스킬, 프로젝트, CP, 블로그 섹션 라벨, 연락처 등을 여기서 고치면 됩니다. **`siteLogo`**(상단 `// msp` 로고), **`siteFooter`**(푸터 두 줄, `{{year}}`는 연도로 바뀜)도 같은 파일 하단에 있습니다. HTML이 필요한 문단(굵게 등)은 문자열 안에 `<strong>` 태그를 넣을 수 있습니다.

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

3. 저장소 **Settings → Pages** 에서 **Build and deployment** 의 Source를 **GitHub Actions** 로 선택합니다. (**Deploy from a branch** 나 Jekyll 기본 워크플로가 아니어야 합니다.)
4. **Actions** 탭에서 **Deploy to GitHub Pages** 워크플로만 사용합니다. `Build with Jekyll` / `jekyll-build-pages` 가 돌면 Pages 소스가 잘못된 것입니다. Settings → Pages에서 다시 **GitHub Actions** 를 고르고, 필요하면 잘못된 워크플로를 비활성화합니다.
5. `main`에 푸시할 때마다 `.github/workflows/deploy.yml` 이 `npm run build` 로 `dist/` 를 올려 `https://pelu10075.github.io` 에 반영합니다.

### 사이트에 README만 보일 때

이 저장소의 실제 사이트는 **`npm run build` 결과인 `dist/`** 입니다. `dist/` 는 보통 Git에 올리지 않고, **CI가 빌드한 뒤 GitHub Pages에만** 올라갑니다.

- **Settings → Pages → Build and deployment** 가 **GitHub Actions** 가 아니라 **Deploy from a branch** (`main` / `(root)` 등)이면, 루트에는 `index.html`이 없어서 Jekyll/기본 페이지가 **README.md** 위주로 보여 줄 수 있습니다. Source를 **GitHub Actions** 로 바꿉니다.
- 바꾼 뒤 **Actions** 탭에서 **Deploy to GitHub Pages** 가 성공(초록)인지 확인합니다. 처음이면 **Settings → Environments → github-pages** 에서 배포 승인이 필요할 수 있습니다.
- `pages-build-deployment`(Jekyll)만 돌고 Astro 워크플로가 안 돌면, 위 Pages 소스 설정을 다시 확인합니다.

## 빌드만 확인

```sh
npm run build
```

결과물은 `dist/` 에 생성됩니다.
