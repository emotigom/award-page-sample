:root {
  --accent: #08756f;
  --bg: #f7efe3;
  --card: #fffdf8;
  --text: #1f2521;
  --radius: 8px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    linear-gradient(120deg, rgb(255 245 218 / 88%), rgb(235 247 239 / 90%)),
    var(--bg);
  color: var(--text);
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.page {
  width: min(1080px, 100%);
  margin: 0 auto;
  padding: 24px;
}

.hero,
.profile-card,
.info-card,
.highlight,
.message-box {
  border: 2px solid rgb(31 37 33 / 12%);
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: 0 16px 38px rgb(31 37 33 / 10%);
}

.hero {
  display: grid;
  gap: 18px;
  min-height: 360px;
  align-content: center;
  padding: clamp(28px, 6vw, 64px);
}

.badge {
  width: fit-content;
  margin: 0;
  border-radius: var(--radius);
  background: #e5f5ee;
  color: #064f4b;
  padding: 8px 12px;
  font-size: 15px;
  font-weight: 900;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  max-width: 840px;
  margin-bottom: 0;
  font-size: clamp(40px, 7vw, 72px);
  line-height: 1.06;
  letter-spacing: 0;
}

.lead {
  max-width: 760px;
  margin-bottom: 6px;
  color: #52615a;
  font-size: clamp(22px, 3vw, 31px);
  line-height: 1.45;
  font-weight: 750;
}

button {
  width: fit-content;
  min-height: 48px;
  border: 0;
  border-radius: var(--radius);
  padding: 12px 18px;
  background: var(--accent);
  color: #ffffff;
  font: inherit;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
}

.profile-card {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  margin-top: 18px;
  padding: 22px;
}

.avatar {
  display: grid;
  width: 96px;
  height: 96px;
  place-items: center;
  border-radius: var(--radius);
  background: #fff0bd;
  font-size: 48px;
}

.label {
  margin-bottom: 4px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.profile-card h2,
.highlight h2 {
  margin-bottom: 8px;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.16;
}

.profile-card p,
.info-card p,
.highlight p,
.message-box p,
footer {
  color: #4f5d56;
  font-size: 19px;
  line-height: 1.55;
  font-weight: 650;
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.info-card {
  min-height: 210px;
  padding: 20px;
}

.info-card h3 {
  margin-bottom: 10px;
  color: #064f4b;
  font-size: 24px;
}

.highlight {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  margin-top: 18px;
  padding: 22px;
}

.highlight-icon {
  display: grid;
  width: 88px;
  height: 88px;
  place-items: center;
  border-radius: var(--radius);
  background: #e7f2ff;
  font-size: 42px;
}

.message-box {
  margin-top: 18px;
  padding: 18px 20px;
}

.message-box p {
  margin-bottom: 0;
  color: #0f7a4f;
  font-weight: 900;
}

footer {
  padding: 20px 4px 0;
  text-align: center;
}

@media (max-width: 760px) {
  .page {
    padding: 16px;
  }

  .mission-grid,
  .profile-card,
  .highlight {
    grid-template-columns: 1fr;
  }

  .avatar,
  .highlight-icon {
    width: 76px;
    height: 76px;
  }
}
