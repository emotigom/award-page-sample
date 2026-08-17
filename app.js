const cameraView = document.querySelector("#cameraView");
const photoCanvas = document.querySelector("#photoCanvas");
const startCameraButton = document.querySelector("#startCameraButton");
const takePhotoButton = document.querySelector("#takePhotoButton");
const saveButton = document.querySelector("#saveButton");
const statusText = document.querySelector("#statusText");
const statusCard = document.querySelector(".status-card");
const appTitle = document.querySelector("#appTitle");
const appSubtitle = document.querySelector("#appSubtitle");
const cardTitle = document.querySelector("#cardTitle");
const cardMessage = document.querySelector("#cardMessage");
const themeOptions = document.querySelector("#themeOptions");
const filterOptions = document.querySelector("#filterOptions");
const frameOptions = document.querySelector("#frameOptions");

const ctx = photoCanvas.getContext("2d");

let stream = null;
let capturedImage = null;
let selectedTheme = "student";
let selectedFilter = "natural";
let selectedFrame = "gold";

const stageImage = loadImage("assets/stage-camera-ring-textless.png");

const themePresets = {
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
};

const filters = {
  natural: "none",
  bright: "brightness(1.18) contrast(1.04) saturate(1.12)",
  sharp: "contrast(1.18) saturate(1.25)",
  mono: "grayscale(1) contrast(1.12)"
};

const frames = {
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
};

function loadImage(src) {
  const image = new Image();
  image.src = src;
  image.addEventListener("load", renderCard);
  return image;
}

function setStatus(message, ready = false) {
  statusText.textContent = message;
  statusCard.classList.toggle("is-ready", ready);
}

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    setStatus("이 브라우저에서는 카메라를 사용할 수 없습니다");
    return;
  }

  try {
    stopCamera();
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
      audio: false
    });

    cameraView.srcObject = stream;
    await cameraView.play();
    cameraView.classList.add("is-active");
    takePhotoButton.disabled = false;
    startCameraButton.textContent = "카메라 다시 켜기";
    setStatus("카메라 준비 완료", true);
  } catch (error) {
    takePhotoButton.disabled = true;
    setStatus("카메라 권한을 확인해 주세요");
    console.error("카메라를 시작하지 못했습니다.", error);
  }
}

function stopCamera() {
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
  stream = null;
}

function takePhoto() {
  if (!stream || !cameraView.videoWidth || !cameraView.videoHeight) {
    setStatus("먼저 카메라를 켜 주세요");
    return;
  }

  capturedImage = document.createElement("canvas");
  capturedImage.width = cameraView.videoWidth;
  capturedImage.height = cameraView.videoHeight;

  const imageCtx = capturedImage.getContext("2d");
  imageCtx.translate(capturedImage.width, 0);
  imageCtx.scale(-1, 1);
  imageCtx.drawImage(cameraView, 0, 0, capturedImage.width, capturedImage.height);

  setStatus("사진 촬영 완료", true);
  renderCard();
}

function drawRoundRect(target, x, y, width, height, radius) {
  target.beginPath();
  target.moveTo(x + radius, y);
  target.lineTo(x + width - radius, y);
  target.quadraticCurveTo(x + width, y, x + width, y + radius);
  target.lineTo(x + width, y + height - radius);
  target.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  target.lineTo(x + radius, y + height);
  target.quadraticCurveTo(x, y + height, x, y + height - radius);
  target.lineTo(x, y + radius);
  target.quadraticCurveTo(x, y, x + radius, y);
  target.closePath();
}

function fillRoundRect(x, y, width, height, radius, color) {
  ctx.fillStyle = color;
  drawRoundRect(ctx, x, y, width, height, radius);
  ctx.fill();
}

function strokeRoundRect(x, y, width, height, radius, color, lineWidth) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  drawRoundRect(ctx, x, y, width, height, radius);
  ctx.stroke();
}

function drawCoverImage(source, x, y, width, height) {
  const scale = Math.max(width / source.width, height / source.height);
  const drawWidth = source.width * scale;
  const drawHeight = source.height * scale;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;
  ctx.drawImage(source, drawX, drawY, drawWidth, drawHeight);
}

function fitText(text, maxWidth, startSize, minSize, weight = 900) {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px Arial, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

function drawBackground(frame) {
  if (stageImage.complete && stageImage.naturalWidth > 0) {
    drawCoverImage(stageImage, 0, 0, photoCanvas.width, photoCanvas.height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, photoCanvas.width, photoCanvas.height);
    gradient.addColorStop(0, "#09030b");
    gradient.addColorStop(0.5, "#2a0715");
    gradient.addColorStop(1, "#050308");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, photoCanvas.width, photoCanvas.height);
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.48)";
  ctx.fillRect(0, 0, photoCanvas.width, photoCanvas.height);

  ctx.save();
  ctx.shadowColor = frame.glow;
  ctx.shadowBlur = 54;
  strokeRoundRect(42, 42, 816, 1116, 44, frame.border, 10);
  ctx.restore();
}

function drawPortraitArea() {
  fillRoundRect(96, 118, 708, 742, 48, "rgba(3, 7, 18, 0.65)");
  strokeRoundRect(96, 118, 708, 742, 48, "rgba(255, 255, 255, 0.22)", 2);

  ctx.save();
  drawRoundRect(ctx, 116, 138, 668, 702, 38);
  ctx.clip();

  if (capturedImage) {
    ctx.filter = filters[selectedFilter];
    drawCoverImage(capturedImage, 116, 138, 668, 702);
    ctx.filter = "none";
  } else {
    const placeholder = ctx.createLinearGradient(116, 138, 784, 840);
    placeholder.addColorStop(0, "rgba(255, 224, 138, 0.15)");
    placeholder.addColorStop(0.55, "rgba(251, 143, 208, 0.12)");
    placeholder.addColorStop(1, "rgba(143, 231, 255, 0.17)");
    ctx.fillStyle = placeholder;
    ctx.fillRect(116, 138, 668, 702);
    ctx.fillStyle = "rgba(255, 247, 223, 0.9)";
    ctx.font = "900 34px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("사진을 찍으면 카드가 완성돼요", 450, 498);
  }

  ctx.restore();
}

function drawTrophy(frame) {
  ctx.save();
  ctx.translate(708, 988);
  ctx.fillStyle = frame.accent;
  ctx.strokeStyle = frame.accent;
  ctx.lineWidth = 13;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(-48, -72);
  ctx.quadraticCurveTo(0, -38, 48, -72);
  ctx.lineTo(37, 8);
  ctx.quadraticCurveTo(0, 43, -37, 8);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-54, -37, 31, Math.PI * 0.52, Math.PI * 1.48);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(54, -37, 31, Math.PI * 1.52, Math.PI * 0.48);
  ctx.stroke();

  ctx.fillRect(-8, 31, 16, 40);
  drawRoundRect(ctx, -45, 67, 90, 20, 8);
  ctx.fill();
  ctx.restore();
}

function renderCard() {
  const frame = frames[selectedFrame];
  const theme = themePresets[selectedTheme];
  const title = cardTitle.value.trim() || theme.cardTitle;
  const message = cardMessage.value.trim() || theme.cardMessage;

  ctx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
  drawBackground(frame);
  drawPortraitArea();

  fillRoundRect(86, 888, 728, 236, 34, frame.band);
  strokeRoundRect(86, 888, 728, 236, 34, "rgba(255, 255, 255, 0.2)", 2);

  ctx.textAlign = "left";
  ctx.fillStyle = frame.accent;
  ctx.font = "900 24px Arial, sans-serif";
  ctx.fillText(frame.label, 128, 938);

  ctx.fillStyle = "#fff7df";
  const titleSize = fitText(title, 470, 58, 36);
  ctx.font = `900 ${titleSize}px Arial, sans-serif`;
  ctx.fillText(title, 128, 1004);

  ctx.fillStyle = "rgba(255, 247, 223, 0.84)";
  const messageSize = fitText(message, 470, 30, 22, 700);
  ctx.font = `700 ${messageSize}px Arial, sans-serif`;
  ctx.fillText(message, 128, 1058);

  drawTrophy(frame);

  ctx.fillStyle = theme.accent;
  ctx.font = "900 22px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("AI PHOTO CARD LAB", 450, 82);
}

function selectOption(group, dataName, value) {
  group.querySelectorAll(".option").forEach((button) => {
    const selected = button.dataset[dataName] === value;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function applyTheme(themeName) {
  const theme = themePresets[themeName];
  if (!theme) return;

  selectedTheme = themeName;
  appTitle.textContent = theme.appTitle;
  appSubtitle.textContent = theme.appSubtitle;
  cardTitle.value = theme.cardTitle;
  cardMessage.value = theme.cardMessage;
  document.documentElement.style.setProperty("--accent", theme.accent);
  selectOption(themeOptions, "theme", selectedTheme);
  renderCard();
}

themeOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-theme]");
  if (button) applyTheme(button.dataset.theme);
});

filterOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  selectedFilter = button.dataset.filter;
  selectOption(filterOptions, "filter", selectedFilter);
  renderCard();
});

frameOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-frame]");
  if (!button) return;
  selectedFrame = button.dataset.frame;
  selectOption(frameOptions, "frame", selectedFrame);
  renderCard();
});

cardTitle.addEventListener("input", renderCard);
cardMessage.addEventListener("input", renderCard);
startCameraButton.addEventListener("click", startCamera);
takePhotoButton.addEventListener("click", takePhoto);

saveButton.addEventListener("click", () => {
  renderCard();
  const date = new Date().toISOString().slice(0, 10);
  const link = document.createElement("a");
  link.download = `ai-photo-card-${date}.png`;
  link.href = photoCanvas.toDataURL("image/png");
  link.click();
  setStatus("포토카드를 저장했습니다", true);
});

window.addEventListener("pagehide", stopCamera);

applyTheme(selectedTheme);
