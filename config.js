export const APP_CONFIG = Object.freeze({
  stageAsset: "assets/stage-camera-ring-textless.png",
  canvas: Object.freeze({ width: 900, height: 1200 }),
  downloadPrefix: "award-photo-card",
  defaultTheme: "student",
  defaultFilter: "natural",
  defaultFrame: "gold"
});

export const THEME_PRESETS = Object.freeze({
  student: {
    appTitle: "나만의 AI 포토카드",
    appSubtitle: "무대 조명 속 주인공처럼 촬영하고, 보정하고, 저장해 봐요.",
    cardTitle: "올해의 중학생",
    cardMessage: "오늘의 노력과 성장을 담은 포토카드",
    accent: "#ffe08a"
  },
  player: {
    appTitle: "AI Player Card Lab",
    appSubtitle: "최고의 순간을 스포츠 카드처럼 완성해 봐요.",
    cardTitle: "최고의 플레이어",
    cardMessage: "팀을 빛낸 오늘의 하이라이트",
    accent: "#8fe7ff"
  },
  parents: {
    appTitle: "Thank You Photo Card Lab",
    appSubtitle: "감사한 마음을 시상식 포토카드로 전해 봐요.",
    cardTitle: "사랑하는 부모님",
    cardMessage: "늘 응원해 주셔서 감사합니다",
    accent: "#fb8fd0"
  },
  mvp: {
    appTitle: "Class MVP Photo Card",
    appSubtitle: "우리 반의 빛나는 순간을 카드 한 장에 담아 봐요.",
    cardTitle: "우리 반 MVP",
    cardMessage: "함께해서 더 멋진 오늘의 주인공",
    accent: "#7cf8d8"
  }
});

export const FILTERS = Object.freeze({
  natural: "none",
  bright: "brightness(1.18) contrast(1.04) saturate(1.12)",
  sharp: "contrast(1.18) saturate(1.25)",
  mono: "grayscale(1) contrast(1.12)"
});

export const FRAMES = Object.freeze({
  gold: {
    border: "#ffe08a",
    glow: "rgba(255, 224, 138, 0.52)",
    band: "rgba(12, 8, 10, 0.9)",
    accent: "#ffe08a",
    label: "SPARK PHOTO CARD"
  },
  stage: {
    border: "#fb8fd0",
    glow: "rgba(251, 143, 208, 0.5)",
    band: "rgba(38, 9, 28, 0.9)",
    accent: "#fb8fd0",
    label: "STAGE LIGHT PHOTO"
  },
  cyan: {
    border: "#8fe7ff",
    glow: "rgba(143, 231, 255, 0.5)",
    band: "rgba(5, 25, 35, 0.9)",
    accent: "#8fe7ff",
    label: "STAR CARD FRAME"
  }
});
