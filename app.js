import { APP_CONFIG, FILTERS, FRAMES, THEME_PRESETS } from "./config.js";

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
let selectedTheme = APP_CONFIG.defaultTheme;
let selectedFilter = APP_CONFIG.defaultFilter;
let selectedFrame = APP_CONFIG.defaultFrame;

photoCanvas.width = APP_CONFIG.canvas.width;
photoCanvas.height = APP_CONFIG.canvas.height;

const stageImage = loadImage(APP_CONFIG.stageAsset);

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
    ctx.filter = FILTERS[selectedFilter];
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
  const frame = FRAMES[selectedFrame];
  const theme = THEME_PRESETS[selectedTheme];
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
  const theme = THEME_PRESETS[themeName];
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
  photoCanvas.toBlob((blob) => {
    if (!blob) {
      setStatus("이미지를 저장하지 못했습니다");
      return;
    }

    const date = new Date().toISOString().slice(0, 10);
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${APP_CONFIG.downloadPrefix}-${date}.png`;
    link.href = downloadUrl;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    setStatus("포토카드를 저장했습니다", true);
  }, "image/png");
});

window.addEventListener("pagehide", stopCamera);

applyTheme(selectedTheme);
