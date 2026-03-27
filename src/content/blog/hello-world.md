---
title: 블로그를 시작합니다
description: GitHub Pages로 올린 포트폴리오 사이트에 마크다운 블로그를 붙였습니다.
pubDate: 2026-03-27
tags:
  - astro
  - github-pages
---

이 글은 `src/content/blog/` 아래에 있는 마크다운 파일입니다. 새 글을 쓰려면 같은 폴더에 `.md` 파일을 추가하고, 위와 같은 **프론트매터**를 넣으면 됩니다.

## 마크다운 예시

- 목록
- **굵게**, *기울임*
- [링크](https://pages.github.com/)

코드 블록도 사용할 수 있습니다.

```ts
const site = 'https://pelu10075.github.io';
```

배포는 `main` 브랜치에 푸시할 때 GitHub Actions가 자동으로 빌드합니다.
