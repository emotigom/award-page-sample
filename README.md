# AI Photo Card Lab

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

카메라로 사진을 찍고 주제, 보정, 프레임과 문구를 골라 시상식 포토카드를 만드는 브라우저 앱입니다. 서버, 데이터베이스, 회원가입 없이 동작하며 촬영한 사진은 외부로 전송되지 않습니다.

## 실행

저장소를 내려받아 로컬 웹 서버로 `index.html`을 열면 됩니다.

```bash
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000`으로 접속하고 카메라 권한을 허용합니다. GitHub Pages에서도 바로 체험할 수 있습니다.

- https://emotigom.github.io/award-page-sample/

## 기능

- 브라우저 카메라 촬영
- 성장·플레이어·감사·우리 반 MVP 주제
- 자연스럽게·밝게·선명하게·흑백 보정
- 골드·핑크·시안 프레임
- 제목과 소개 문구 편집
- 900 × 1200 PNG 저장
- 모바일·태블릿·PC 반응형 화면

## 파일 구성

- `index.html`: 화면 구조와 접근성 정보
- `style.css`: 시상식 무대 디자인과 반응형 레이아웃
- `app.js`: 카메라, 카드 렌더링, PNG 저장 기능
- `assets/stage-camera-ring-textless.png`: 시상식 무대 배경
- `LICENSE`: MIT 라이선스

## 개인정보 보호

카메라 영상과 촬영 이미지는 사용자의 브라우저 메모리에서만 처리합니다. 별도의 서버 업로드나 분석 기능은 포함하지 않습니다.

## 라이선스

소스 코드와 저장소 고유 에셋은 [MIT License](LICENSE)로 제공됩니다. 누구나 사용, 수정, 배포 및 상업적으로 이용할 수 있습니다.
