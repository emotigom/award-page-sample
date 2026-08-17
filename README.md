# AI Photo Card Lab

[Demo](https://emotigom.github.io/award-page-sample/) · [MIT License](LICENSE)

No-build 정적 포토카드 생성기. 카메라 입력, Canvas 합성, PNG 출력을 브라우저에서 처리한다.

## Runtime

- HTML, CSS, ES modules
- MediaDevices, Canvas 2D, Blob URL
- 외부 런타임 의존성 없음

## Structure

| Path | Responsibility |
| --- | --- |
| `index.html` | UI 및 접근성 구조 |
| `config.js` | 앱 기본값, 테마, 필터, 프레임 |
| `app.js` | 카메라 수명주기, Canvas 렌더링, PNG 출력 |
| `style.css` | 레이아웃, 토큰, 반응형 스타일 |
| `assets/` | 카드 합성용 정적 에셋 |

## Run

```bash
python3 -m http.server 8000
```

`http://localhost:8000`

## Configuration

`config.js`가 제품별 변형 지점이다.

| Export | Scope |
| --- | --- |
| `APP_CONFIG.stageAsset` | 배경 에셋 경로 |
| `APP_CONFIG.canvas` | 출력 해상도 |
| `APP_CONFIG.downloadPrefix` | PNG 파일명 접두사 |
| `APP_CONFIG.default*` | 초기 테마, 필터, 프레임 |
| `THEME_PRESETS` | 화면 문구, 카드 문구, 강조색 |
| `FILTERS` | Canvas 2D 필터 프리셋 |
| `FRAMES` | 테두리, 글로우, 밴드, 라벨 |

`index.html`의 `data-theme`, `data-filter`, `data-frame` 값은 각 설정 객체의 키와 일치해야 한다.

## Deployment

정적 호스팅 대상은 저장소 루트다. 카메라는 `localhost` 또는 HTTPS 보안 컨텍스트가 필요하다.

## Data boundary

카메라 스트림과 촬영 이미지는 브라우저 메모리에서만 처리한다. 업로드, 분석, 영구 저장소는 포함하지 않는다.

## License

[MIT](LICENSE). 저장소 고유 에셋 포함.
