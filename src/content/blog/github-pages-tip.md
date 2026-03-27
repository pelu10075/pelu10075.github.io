---
title: GitHub Pages 배포 체크리스트
description: 사용자 사이트(pelu10075.github.io) 저장소에서 Pages를 켤 때 확인할 것들입니다.
pubDate: 2026-03-27
tags:
  - github
---

## 저장소 이름

`username.github.io` 형식의 저장소는 **루트 도메인**(`https://username.github.io`)에 바로 올라갑니다. 지금 이 프로젝트 폴더 이름과 맞춰 두었습니다.

## Pages 설정

1. GitHub 저장소 → **Settings** → **Pages**
2. **Build and deployment** → Source를 **GitHub Actions**로 선택합니다.
3. 워크플로가 `dist` 폴더를 올리도록 되어 있으면, 첫 푸시 후 몇 분 안에 사이트가 갱신됩니다.

## 커스텀 도메인 (선택)

나중에 도메인을 연결하면 `public/CNAME` 파일과 DNS 설정이 필요합니다. 기본 `github.io` 주소만 쓰면 이 단계는 건너뛰어도 됩니다.
