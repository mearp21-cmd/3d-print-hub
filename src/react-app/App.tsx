@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap");

:root {
  font-family: "DM Sans", sans-serif;
  color: #ffffff;
  background: #070b10;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  background:
    radial-gradient(
      circle at 80% 10%,
      rgba(0, 229, 255, 0.08),
      transparent 30%
    ),
    #070b10;
  color: #ffffff;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
}

.site {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    linear-gradient(
      180deg,
      rgba(7, 11, 16, 0.98),
      rgba(7, 11, 16, 1)
    );
}

/* ========================================= */
/* NAVIGATION */
/* ========================================= */

.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;

  width: 100%;
  min-height: 76px;

  padding: 14px 5vw;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;

  background: rgba(7, 11, 16, 0.88);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);

  backdrop-filter: blur(18px);
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding: 0;

  border: 0;
  background: transparent;

  color: white;

  font-family: "Space Grotesk", sans-serif;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.logo b {
  color: #00e5ff;
}

.logoBox {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background:
    linear-gradient(
      135deg,
      #00e5ff,
      #007bff
    );

  color: #061017;

  font-weight: 900;
  letter-spacing: -0.05em;

  box-shadow:
    0 0 25px rgba(0, 229, 255, 0.25);
}

.navbar nav {
  display: flex;
  align-items: center;
  gap: 25px;
}

.navbar nav > button:not(.primaryButton),
.navbar nav > a {
  border: 0;
  background: transparent;

  color: rgba(255, 255, 255, 0.68);

  font-size: 14px;
  font-weight: 600;

  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.navbar nav > button:not(.primaryButton):hover,
.navbar nav > a:hover {
  color: #ffffff;
  transform: translateY(-1px);
}

.loginButton {
  padding: 8px 0;
}

.primaryButton,
.secondaryButton {
  border-radius: 10px;

  padding: 12px 18px;

  font-weight: 800;
  font-size: 14px;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.primaryButton {
  border: 1px solid rgba(0, 229, 255, 0.35);

  background:
    linear-gradient(
      135deg,
      #00e5ff,
      #008cff
    );

  color: #041017;

  box-shadow:
    0 8px 30px rgba(0, 229, 255, 0.12);
}

.primaryButton:hover {
  transform: translateY(-2px);

  box-shadow:
    0 12px 35px rgba(0, 229, 255, 0.25);
}

.secondaryButton {
  border: 1px solid rgba(255, 255, 255, 0.14);

  background: rgba(255, 255, 255, 0.04);

  color: #ffffff;
}

.secondaryButton:hover {
  transform: translateY(-2px);

  background: rgba(255, 255, 255, 0.08);
}

.large {
  padding: 15px 22px;
  font-size: 15px;
}

/* ========================================= */
/* HERO */
/* ========================================= */

.hero {
  position: relative;

  min-height: 680px;

  padding:
    100px
    7vw
    90px;

  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 50px;

  overflow: hidden;
}

.heroGlow {
  position: absolute;

  width: 650px;
  height: 650px;

  right: -180px;
  top: -120px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(0, 229, 255, 0.13),
      transparent 68%
    );

  pointer-events: none;
}

.heroText {
  position: relative;
  z-index: 2;
  max-width: 700px;
}

.eyebrow {
  margin-bottom: 14px;

  color: #62edff;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 0.16em;
}

.hero h1 {
  margin: 0;

  font-family: "Space Grotesk", sans-serif;

  font-size: clamp(
    60px,
    8vw,
    105px
  );

  line-height: 0.9;
  letter-spacing: -0.07em;
}

.hero h1 span,
.creatorSection h2 span,
.membership h2 span {
  color: #00e5ff;
}

.heroText > p {
  max-width: 590px;

  margin: 30px 0;

  color: rgba(255, 255, 255, 0.64);

  font-size: 18px;
  line-height: 1.7;
}

.searchBox {
  max-width: 620px;

  display: flex;
  align-items: center;

  padding: 6px;

  border: 1px solid rgba(255, 255, 255, 0.11);

  border-radius: 13px;

  background: rgba(255, 255, 255, 0.045);

  box-shadow:
    0 20px 70px rgba(0, 0, 0, 0.25);
}

.searchIcon {
  padding: 0 12px;

  color: rgba(255, 255, 255, 0.45);

  font-size: 25px;
}

.searchBox input {
  min-width: 0;
  flex: 1;

  padding: 13px 5px;

  border: 0;
  outline: 0;

  background: transparent;

  color: #ffffff;
}

.searchBox input::placeholder {
  color: rgba(255, 255, 255, 0.38);
}

.searchBox button {
  padding: 12px 20px;

  border: 0;
  border-radius: 9px;

  background: #ffffff;

  color: #071016;

  font-weight: 800;
}

.heroButtons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  margin-top: 22px;
}

.stats {
  display: flex;
  gap: 40px;

  margin-top: 48px;
}

.stats div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stats strong {
  font-family: "Space Grotesk", sans-serif;
  font-size: 25px;
}

.stats span {
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
}

.heroVisual {
  position: relative;

  min-height: 500px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit {
  position: absolute;

  border: 1px solid rgba(0, 229, 255, 0.13);

  border-radius: 50%;

  transform: rotate(-20deg);
}

.orbitOne {
  width: 390px;
  height: 220px;
}

.orbitTwo {
  width: 470px;
  height: 290px;

  transform: rotate(30deg);
}

.mainObject {
  position: relative;
  z-index: 2;

  width: 220px;
  height: 220px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(0, 229, 255, 0.35);

  border-radius: 45px;

  background:
    radial-gradient(
      circle at 35% 25%,
      rgba(0, 229, 255, 0.35),
      rgba(0, 100, 150, 0.08) 45%,
      rgba(255, 255, 255, 0.02)
    );

  color: #00e5ff;

  font-size: 110px;

  box-shadow:
    0 0 100px rgba(0, 229, 255, 0.13);

  transform: rotate(30deg);

  animation:
    heroFloat 5s ease-in-out infinite;
}

.floatingObject {
  position: absolute;
  z-index: 4;

  width: 65px;
  height: 65px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.1);

  border-radius: 18px;

  background: rgba(14, 24, 32, 0.88);

  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.35);

  font-size: 29px;
}

.objectOne {
  top: 75px;
  right: 80px;
}

.objectTwo {
  bottom: 85px;
  left: 40px;
}

.objectThree {
  top: 210px;
  right: 20px;
}

.floatingLabel {
  position: absolute;

  padding: 8px 11px;

  border: 1px solid rgba(0, 229, 255, 0.18);

  border-radius: 999px;

  background: rgba(0, 229, 255, 0.07);

  color: #72edff;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.1em;
}

.labelOne {
  left: 20px;
  top: 115px;
}

.labelTwo {
  right: 70px;
  bottom: 90px;
}

@keyframes heroFloat {
  0%,
  100% {
    transform:
      rotate(30deg)
      translateY(0);
  }

  50% {
    transform:
      rotate(30deg)
      translateY(-15px);
  }
}

/* ========================================= */
/* FEATURE STRIP */
/* ========================================= */

.featureStrip {
  min-height: 62px;

  padding: 18px 7vw;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;

  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  background: rgba(255, 255, 255, 0.018);

  color: rgba(255, 255, 255, 0.55);

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.12em;
}

/* ========================================= */
/* SECTIONS */
/* ========================================= */

.section {
  padding:
    100px
    7vw;
}

.sectionHeading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;

  margin-bottom: 40px;
}

.sectionHeading h2,
.membership h2 {
  margin: 0;

  font-family: "Space Grotesk", sans-serif;

  font-size: clamp(
    35px,
    5vw,
    62px
  );

  line-height: 1;

  letter-spacing: -0.05em;
}

.sectionHeading p {
  max-width: 600px;

  margin: 20px auto 0;

  color: rgba(255, 255, 255, 0.55);

  line-height: 1.7;
}

.textButton {
  border: 0;
  background: transparent;

  color: #00e5ff;

  font-weight: 800;
}

.textButton:hover {
  text-decoration: underline;
}

/* ========================================= */
/* CATEGORIES */
/* ========================================= */

.categoryGrid {
  display: grid;

  grid-template-columns:
    repeat(6, minmax(0, 1fr));

  gap: 12px;
}

.categoryCard {
  position: relative;

  min-height: 190px;

  padding: 24px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;

  border: 1px solid rgba(255, 255, 255, 0.08);

  border-radius: 18px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.055),
      rgba(255, 255, 255, 0.018)
    );

  color: #ffffff;

  text-align: left;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;
}

.categoryCard:hover {
  transform: translateY(-5px);

  border-color:
    rgba(0, 229, 255, 0.3);

  background:
    linear-gradient(
      145deg,
      rgba(0, 229, 255, 0.08),
      rgba(255, 255, 255, 0.025)
    );
}

.categoryIcon {
  position: absolute;

  top: 22px;
  left: 22px;

  font-size: 34px;
}

.categoryCard strong {
  font-size: 16px;
}

.categoryCard small {
  margin-top: 6px;

  color: rgba(255, 255, 255, 0.42);

  font-size: 11px;
}

.cardArrow {
  position: absolute;

  right: 20px;
  top: 20px;

  color: rgba(255, 255, 255, 0.3);
}

/* ========================================= */
/* EXPLORE */
/* ========================================= */

.exploreSection {
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.012),
      rgba(0, 229, 255, 0.015)
    );
}

.exploreControls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.exploreControls select {
  min-width: 150px;
}

select,
.formGroup input,
.formGroup textarea {
  outline: none;
}

.exploreControls select,
.formGroup select {
  border: 1px solid rgba(255, 255, 255, 0.11);

  border-radius: 9px;

  background: #111820;

  color: #ffffff;

  padding: 11px 13px;
}

.designGrid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 18px;
}

.designCard {
  overflow: hidden;

  border: 1px solid rgba(255, 255, 255, 0.08);

  border-radius: 18px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.018)
    );

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  cursor: pointer;
}

.designCard:hover {
  transform: translateY(-6px);

  border-color:
    rgba(0, 229, 255, 0.25);

  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.28);
}

.designImage {
  position: relative;

  min-height: 245px;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      circle at center,
      rgba(0, 229, 255, 0.12),
      transparent 58%
    ),
    #0c131a;

  border-bottom: 1px solid
    rgba(255, 255, 255, 0.06);
}

.designTag {
  position: absolute;

  top: 14px;
  left: 14px;

  padding: 7px 10px;

  border: 1px solid rgba(255, 255, 255, 0.09);

  border-radius: 999px;

  background: rgba(0, 0, 0, 0.35);

  color: #9af4ff;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.08em;

  z-index: 2;
}

.heart {
  position: absolute;

  top: 12px;
  right: 12px;

  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.09);

  border-radius: 50%;

  background: rgba(0, 0, 0, 0.35);

  color: #ffffff;

  font-size: 20px;

  transition:
    transform 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.heart:hover {
  transform: scale(1.12);

  background:
    rgba(0, 229, 255, 0.12);

  color: #00e5ff;
}

.heart:active {
  transform: scale(0.94);
}

.designEmoji {
  font-size: 90px;

  filter:
    drop-shadow(
      0 18px 25px rgba(0, 0, 0, 0.5)
    );

  transition:
    transform 0.3s ease;
}

.designCard:hover .designEmoji {
  transform: scale(1.08) translateY(-5px);
}

.designDetails {
  padding: 22px;
}

.rating {
  color: #74efff;

  font-size: 12px;
  font-weight: 800;
}

.rating span {
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
}

.designDetails h3 {
  margin: 9px 0 5px;

  font-family: "Space Grotesk", sans-serif;

  font-size: 21px;

  line-height: 1.2;
}

.designDetails p {
  margin: 0;

  color: rgba(255, 255, 255, 0.45);

  font-size: 13px;
}

.viewButton {
  margin-top: 18px;

  padding: 0;

  border: 0;
  background: transparent;

  color: #00e5ff;

  font-size: 13px;
  font-weight: 800;
}

.viewButton:hover {
  text-decoration: underline;
}

.empty {
  padding: 50px 20px;

  text-align: center;

  color: rgba(255, 255, 255, 0.55);

  font-size: 18px;
}

/* ========================================= */
/* BLUEPRINT DETAIL MODAL */
/* ========================================= */

.modalOverlay {
  position: fixed;
  inset: 0;

  z-index: 9999;

  padding: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    rgba(0, 0, 0, 0.82);

  backdrop-filter: blur(14px);

  animation:
    modalFade 0.2s ease;
}

@keyframes modalFade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.blueprintModal {
  position: relative;

  width: min(980px, 100%);

  max-height: 90vh;

  display: grid;

  grid-template-columns:
    0.9fr 1.1fr;

  overflow: hidden;

  border: 1px solid
    rgba(0, 229, 255, 0.2);

  border-radius: 25px;

  background:
    linear-gradient(
      145deg,
      #111b24,
      #0b1117
    );

  box-shadow:
    0 35px 120px
      rgba(0, 0, 0, 0.7);

  animation:
    modalOpen 0.25s ease;
}

@keyframes modalOpen {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(12px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modalClose {
  position: absolute;

  right: 18px;
  top: 18px;

  z-index: 10;

  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid
    rgba(255, 255, 255, 0.12);

  border-radius: 50%;

  background:
    rgba(0, 0, 0, 0.45);

  color: white;

  font-size: 28px;
  line-height: 1;

  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.modalClose:hover {
  transform: rotate(90deg);

  background:
    rgba(0, 229, 255, 0.15);
}

.modalVisual {
  position: relative;

  min-height: 520px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  background:
    radial-gradient(
      circle at center,
      rgba(0, 229, 255, 0.18),
      transparent 52%
    ),
    radial-gradient(
      circle at 70% 20%,
      rgba(0, 140, 255, 0.1),
      transparent 35%
    ),
    #080f15;
}

.modalVisual::before,
.modalVisual::after {
  content: "";

  position: absolute;

  border: 1px solid
    rgba(0, 229, 255, 0.1);

  border-radius: 50%;
}

.modalVisual::before {
  width: 390px;
  height: 390px;
}

.modalVisual::after {
  width: 270px;
  height: 270px;
}

.modalTag {
  position: absolute;

  top: 25px;
  left: 25px;

  padding: 8px 12px;

  border: 1px solid
    rgba(0, 229, 255, 0.2);

  border-radius: 999px;

  background:
    rgba(0, 229, 255, 0.08);

  color: #82efff;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 0.09em;

  z-index: 3;
}

.modalEmoji {
  position: relative;
  z-index: 2;

  font-size: 160px;

  filter:
    drop-shadow(
      0 30px 35px rgba(0, 0, 0, 0.55)
    );

  animation:
    modalFloat 4s ease-in-out infinite;
}

.modalVisualText {
  position: absolute;

  bottom: 27px;

  color: rgba(255, 255, 255, 0.3);

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.18em;
}

@keyframes modalFloat {
  0%,
  100% {
    transform:
      translateY(0)
      rotate(-3deg);
  }

  50% {
    transform:
      translateY(-12px)
      rotate(3deg);
  }
}

.modalContent {
  padding: 55px 42px 40px;

  overflow-y: auto;
}

.modalContent h2 {
  margin: 7px 0 8px;

  font-family: "Space Grotesk", sans-serif;

  font-size: clamp(
    30px,
    4vw,
    48px
  );

  line-height: 1.05;

  letter-spacing: -0.05em;
}

.modalCreator {
  margin: 0;

  color: rgba(255, 255, 255, 0.5);

  font-size: 14px;
}

.modalCreator b {
  color: #ffffff;
}

.modalStats {
  display: flex;

  gap: 10px;

  flex-wrap: wrap;

  margin: 25px 0;
}

.modalStats span {
  padding: 8px 11px;

  border: 1px solid
    rgba(255, 255, 255, 0.09);

  border-radius: 8px;

  background:
    rgba(255, 255, 255, 0.035);

  color: #7eeeff;

  font-size: 12px;
  font-weight: 800;
}

.modalInfoGrid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 9px;

  margin: 25px 0;
}

.modalInfoGrid > div {
  padding: 13px;

  display: flex;
  flex-direction: column;
  gap: 5px;

  border: 1px solid
    rgba(255, 255, 255, 0.07);

  border-radius: 10px;

  background:
    rgba(255, 255, 255, 0.025);
}

.modalInfoGrid small {
  color: rgba(255, 255, 255, 0.32);

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 0.1em;
}

.modalInfoGrid strong {
  color: #ffffff;

  font-size: 12px;
}

.modalSectionTitle {
  margin: 26px 0 9px;

  font-size: 15px;
}

.modalDescription {
  margin: 0;

  color: rgba(255, 255, 255, 0.62);

  line-height: 1.7;

  font-size: 14px;
}

.fileTypes {
  display: flex;

  gap: 7px;

  flex-wrap: wrap;

  margin: 24px 0;
}

.fileTypes span {
  padding: 7px 10px;

  border: 1px solid
    rgba(255, 255, 255, 0.1);

  border-radius: 7px;

  background:
    rgba(255, 255, 255, 0.04);

  color: rgba(255, 255, 255, 0.65);

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 0.09em;
}

.full {
  width: 100%;
}

.modalFavouriteButton {
  width: 100%;

  margin-top: 10px;

  padding: 13px;

  border: 1px solid
    rgba(255, 255, 255, 0.09);

  border-radius: 10px;

  background:
    rgba(255, 255, 255, 0.035);

  color: rgba(255, 255, 255, 0.7);

  font-size: 13px;
  font-weight: 700;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.modalFavouriteButton:hover {
  background:
    rgba(0, 229, 255, 0.08);

  color: #ffffff;
}

/* ========================================= */
/* CREATOR */
/* ========================================= */

.creatorSection {
  min-height: 550px;

  padding:
    100px
    7vw;

  display: grid;

  grid-template-columns:
    1fr 1fr;

  align-items: center;

  gap: 60px;

  background:
    radial-gradient(
      circle at 80% 50%,
      rgba(0, 229, 255, 0.08),
      transparent 35%
    );
}

.creatorSection h2 {
  margin: 0;

  font-family: "Space Grotesk", sans-serif;

  font-size: clamp(
    42px,
    6vw,
    75px
  );

  line-height: 0.95;

  letter-spacing: -0.06em;
}

.creatorSection p {
  max-width: 550px;

  margin: 28px 0;

  color: rgba(255, 255, 255, 0.58);

  line-height: 1.7;
}

.creatorGraphic {
  position: relative;

  min-height: 350px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.creatorCircle {
  width: 230px;
  height: 230px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid
    rgba(0, 229, 255, 0.25);

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(0, 229, 255, 0.12),
      transparent 65%
    );

  color: #00e5ff;

  font-size: 100px;

  box-shadow:
    0 0 100px
      rgba(0, 229, 255, 0.08);
}

.creatorGraphic > span {
  position: absolute;

  padding: 8px 12px;

  border: 1px solid
    rgba(255, 255, 255, 0.08);

  border-radius: 999px;

  background: #101820;

  color: rgba(255, 255, 255, 0.55);

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 0.12em;
}

.creatorGraphic > span:nth-of-type(1) {
  top: 50px;
  right: 80px;
}

.creatorGraphic > span:nth-of-type(2) {
  bottom: 55px;
  left: 55px;
}

.creatorGraphic > span:nth-of-type(3) {
  top: 170px;
  right: 15px;
}

/* ========================================= */
/* MEMBERSHIP */
/* ========================================= */

.membership {
  text-align: center;
}

.sectionHeading.centered {
  display: block;

  max-width: 800px;

  margin:
    0
    auto
    55px;
}

.plans {
  max-width: 900px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 18px;

  text-align: left;
}

.plan {
  padding: 34px;

  border: 1px solid
    rgba(255, 255, 255, 0.09);

  border-radius: 20px;

  background:
    rgba(255, 255, 255, 0.025);
}

.featuredPlan {
  border-color:
    rgba(0, 229, 255, 0.25);

  background:
    linear-gradient(
      145deg,
      rgba(0, 229, 255, 0.08),
      rgba(255, 255, 255, 0.025)
    );
}

.planLabel {
  color: #00e5ff;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.13em;
}

.plan h3 {
  margin: 12px 0;

  font-family: "Space Grotesk", sans-serif;

  font-size: 28px;
}

.price {
  margin-bottom: 25px;

  font-family: "Space Grotesk", sans-serif;

  font-size: 45px;
  font-weight: 700;
}

.price small {
  color: rgba(255, 255, 255, 0.4);

  font-family: "DM Sans", sans-serif;

  font-size: 13px;
  font-weight: 500;
}

.plan ul {
  margin: 0 0 30px;
  padding: 0;

  list-style: none;
}

.plan li {
  margin: 12px 0;

  color: rgba(255, 255, 255, 0.62);

  font-size: 14px;
}

.plan li::before {
  content: "✓";

  margin-right: 9px;

  color: #00e5ff;

  font-weight: 900;
}

/* ========================================= */
/* ADVERTISING */
/* ========================================= */

.advertising {
  min-height: 180px;

  padding: 50px 7vw;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  border-top: 1px solid
    rgba(255, 255, 255, 0.06);

  border-bottom: 1px solid
    rgba(255, 255, 255, 0.06);

  background:
    rgba(255, 255, 255, 0.015);
}

.advertising span {
  margin-bottom: 10px;

  color: rgba(255, 255, 255, 0.25);

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 0.15em;
}

.advertising strong {
  font-family: "Space Grotesk", sans-serif;

  font-size: 25px;
}

.advertising small {
  margin-top: 7px;

  color: rgba(255, 255, 255, 0.38);
}

/* ========================================= */
/* UPLOAD PAGE */
/* ========================================= */

.uploadPage {
  min-height: 100vh;

  padding:
    70px
    7vw
    100px;

  background:
    radial-gradient(
      circle at 80% 5%,
      rgba(0, 229, 255, 0.07),
      transparent 30%
    );
}

.uploadHeader {
  max-width: 850px;

  margin-bottom: 45px;
}

.uploadHeader h1 {
  margin: 0;

  font-family: "Space Grotesk", sans-serif;

  font-size: clamp(
    45px,
    6vw,
    75px
  );

  line-height: 0.95;

  letter-spacing: -0.06em;
}

.uploadHeader h1 span {
  color: #00e5ff;
}

.uploadHeader p {
  max-width: 680px;

  margin: 25px 0 0;

  color: rgba(255, 255, 255, 0.58);

  line-height: 1.7;
}

.backButton {
  margin-bottom: 40px;

  padding: 0;

  border: 0;
  background: transparent;

  color: #00e5ff;

  font-size: 13px;
  font-weight: 800;
}

.uploadLayout {
  display: grid;

  grid-template-columns:
    minmax(0, 1.5fr)
    minmax(280px, 0.65fr);

  gap: 25px;

  align-items: start;
}

.uploadMain {
  display: flex;
  flex-direction: column;

  gap: 18px;
}

.uploadCard {
  padding: 30px;

  border: 1px solid
    rgba(255, 255, 255, 0.08);

  border-radius: 18px;

  background:
    rgba(255, 255, 255, 0.025);
}

.uploadCardTitle {
  display: flex;

  gap: 15px;

  margin-bottom: 24px;
}

.uploadCardTitle > span {
  color: #00e5ff;

  font-family: "Space Grotesk", sans-serif;

  font-size: 13px;
  font-weight: 800;
}

.uploadCardTitle h2 {
  margin: 0 0 5px;

  font-family: "Space Grotesk", sans-serif;

  font-size: 22px;
}

.uploadCardTitle p {
  margin: 0;

  color: rgba(255, 255, 255, 0.4);

  font-size: 12px;
}

.fileDrop {
  min-height: 180px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 30px;

  border: 1px dashed
    rgba(0, 229, 255, 0.25);

  border-radius: 14px;

  background:
    rgba(0, 229, 255, 0.025);

  text-align: center;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.fileDrop:hover {
  background:
    rgba(0, 229, 255, 0.06);

  border-color:
    rgba(0, 229, 255, 0.5);
}

.fileDrop input {
  display: none;
}

.uploadIcon {
  margin-bottom: 12px;

  font-size: 40px;
}

.fileDrop strong {
  font-size: 14px;
}

.fileDrop small {
  margin-top: 6px;

  color: rgba(255, 255, 255, 0.38);

  font-size: 11px;
}

.formGroup {
  margin-top: 20px;
}

.formGroup label,
.priceBox label {
  display: block;

  margin-bottom: 8px;

  color: rgba(255, 255, 255, 0.72);

  font-size: 12px;
  font-weight: 700;
}

.formGroup input,
.formGroup textarea {
  width: 100%;

  padding: 13px 14px;

  border: 1px solid
    rgba(255, 255, 255, 0.09);

  border-radius: 10px;

  background:
    rgba(255, 255, 255, 0.035);

  color: #ffffff;
}

.formGroup textarea {
  resize: vertical;
}

.formGroup input:focus,
.formGroup textarea:focus,
.formGroup select:focus {
  border-color:
    rgba(0, 229, 255, 0.45);
}

.accessOptions {
  display: grid;

  gap: 10px;
}

.accessOption {
  display: flex;

  align-items: center;

  gap: 13px;

  padding: 15px;

  border: 1px solid
    rgba(255, 255, 255, 0.08);

  border-radius: 12px;

  background:
    rgba(255, 255, 255, 0.02);

  cursor: pointer;
}

.accessOption.selected {
  border-color:
    rgba(0, 229, 255, 0.3);

  background:
    rgba(0, 229, 255, 0.06);
}

.accessOption input {
  accent-color: #00e5ff;
}

.accessIcon {
  font-size: 23px;
}

.accessOption strong {
  display: block;

  font-size: 13px;
}

.accessOption small {
  display: block;

  margin-top: 3px;

  color: rgba(255, 255, 255, 0.4);

  font-size: 11px;
}

.priceBox {
  margin-top: 18px;

  padding: 18px;

  border: 1px solid
    rgba(255, 255, 255, 0.08);

  border-radius: 12px;

  background:
    rgba(255, 255, 255, 0.02);
}

.priceInput {
  display: flex;
  align-items: center;

  border: 1px solid
    rgba(255, 255, 255, 0.09);

  border-radius: 10px;

  background:
    rgba(255, 255, 255, 0.035);

  overflow: hidden;
}

.priceInput span {
  padding-left: 13px;

  color: rgba(255, 255, 255, 0.5);
}

.priceInput input {
  width: 100%;

  padding: 13px;

  border: 0;
  outline: 0;

  background: transparent;

  color: white;
}

.priceBox > small {
  display: block;

  margin-top: 8px;

  color: rgba(255, 255, 255, 0.35);

  font-size: 10px;
}

.uploadSidebar {
  position: sticky;
  top: 100px;

  display: flex;
  flex-direction: column;

  gap: 15px;
}

.publishCard,
.creatorTips {
  padding: 28px;

  border: 1px solid
    rgba(255, 255, 255, 0.08);

  border-radius: 18px;

  background:
    rgba(255, 255, 255, 0.025);
}

.publishCard {
  text-align: center;
}

.publishIcon {
  font-size: 42px;
}

.publishCard h2 {
  margin: 12px 0 8px;

  font-family: "Space Grotesk", sans-serif;
}

.publishCard p {
  margin: 0 0 22px;

  color: rgba(255, 255, 255, 0.42);

  font-size: 12px;
  line-height: 1.6;
}

.creatorTips h3 {
  margin-top: 0;

  color: #00e5ff;

  font-size: 14px;
}

.creatorTips ul {
  margin: 0;
  padding-left: 18px;
}

.creatorTips li {
  margin: 10px 0;

  color: rgba(255, 255, 255, 0.48);

  font-size: 12px;
  line-height: 1.5;
}

/* ========================================= */
/* NOTICE */
/* ========================================= */

.notice {
  position: fixed;

  top: 90px;
  left: 50%;

  z-index: 11000;

  transform: translateX(-50%);

  max-width: calc(100% - 30px);

  padding: 13px 18px;

  border: 1px solid
    rgba(0, 229, 255, 0.25);

  border-radius: 10px;

  background:
    rgba(12, 24, 32, 0.95);

  color: #ffffff;

  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.4);

  font-size: 13px;
  font-weight: 700;

  backdrop-filter: blur(15px);
}

/* ========================================= */
/* FOOTER */
/* ========================================= */

footer {
  padding:
    60px
    7vw
    25px;

  border-top: 1px solid
    rgba(255, 255, 255, 0.07);

  background: #05090d;
}

.footerTop {
  display: flex;

  justify-content: space-between;

  gap: 30px;

  padding-bottom: 45px;
}

.footerTop p {
  margin-top: 12px;

  color: rgba(255, 255, 255, 0.35);

  font-size: 12px;
}

.footerLinks {
  display: flex;

  align-items: center;

  gap: 20px;
}

.footerLinks button,
.footerLinks a {
  padding: 0;

  border: 0;
  background: transparent;

  color: rgba(255, 255, 255, 0.42);

  font-size: 12px;
}

.footerLinks button:hover,
.footerLinks a:hover {
  color: #00e5ff;
}

.footerBottom {
  padding-top: 20px;

  display: flex;

  justify-content: space-between;

  gap: 20px;

  border-top: 1px solid
    rgba(255, 255, 255, 0.06);

  color: rgba(255, 255, 255, 0.28);

  font-size: 10px;
}

/* ========================================= */
/* TABLET */
/* ========================================= */

@media (max-width: 1100px) {
  .navbar {
    padding-left: 4vw;
    padding-right: 4vw;
  }

  .navbar nav {
    gap: 14px;
  }

  .hero {
    padding-left: 5vw;
    padding-right: 5vw;
  }

  .categoryGrid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

  .designGrid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .section,
  .creatorSection,
  .uploadPage {
    padding-left: 5vw;
    padding-right: 5vw;
  }
}

/* ========================================= */
/* MOBILE */
/* ========================================= */

@media (max-width: 720px) {
  .navbar {
    position: relative;

    align-items: flex-start;

    padding: 15px 5vw;
  }

  .navbar nav {
    display: none;
  }

  .hero {
    min-height: auto;

    padding:
      70px
      5vw
      70px;

    grid-template-columns: 1fr;
  }

  .hero h1 {
    font-size: clamp(
      55px,
      17vw,
      85px
    );
  }

  .heroText > p {
    font-size: 15px;
  }

  .heroVisual {
    min-height: 350px;
  }

  .mainObject {
    width: 160px;
    height: 160px;

    font-size: 80px;
  }

  .orbitOne {
    width: 290px;
    height: 170px;
  }

  .orbitTwo {
    width: 340px;
    height: 210px;
  }

  .objectOne {
    top: 30px;
    right: 25px;
  }

  .objectTwo {
    bottom: 40px;
    left: 15px;
  }

  .objectThree {
    top: 140px;
    right: 0;
  }

  .labelOne {
    left: 0;
    top: 75px;
  }

  .labelTwo {
    right: 15px;
    bottom: 45px;
  }

  .featureStrip {
    justify-content: center;

    padding-left: 5vw;
    padding-right: 5vw;
  }

  .section {
    padding:
      70px
      5vw;
  }

  .sectionHeading {
    display: block;
  }

  .sectionHeading h2 {
    margin-bottom: 25px;
  }

  .exploreControls {
    width: 100%;

    justify-content: stretch;
  }

  .exploreControls select {
    flex: 1;

    min-width: 0;
  }

  .categoryGrid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .designGrid {
    grid-template-columns: 1fr;
  }

  .creatorSection {
    padding:
      70px
      5vw;

    grid-template-columns: 1fr;
  }

  .creatorGraphic {
    min-height: 280px;
  }

  .plans {
    grid-template-columns: 1fr;
  }

  .uploadPage {
    padding:
      45px
      5vw
      70px;
  }

  .uploadLayout {
    grid-template-columns: 1fr;
  }

  .uploadSidebar {
    position: static;
  }

  .blueprintModal {
    grid-template-columns: 1fr;

    max-height: 92vh;

    overflow-y: auto;
  }

  .modalVisual {
    min-height: 280px;
  }

  .modalEmoji {
    font-size: 100px;
  }

  .modalContent {
    padding:
      32px
      24px
      30px;
  }

  .modalInfoGrid {
    grid-template-columns: 1fr 1fr;
  }

  .modalClose {
    right: 12px;
    top: 12px;
  }

  .footerTop {
    flex-direction: column;
  }

  .footerLinks {
    flex-wrap: wrap;
  }

  .footerBottom {
    flex-direction: column;
  }
}

/* ========================================= */
/* SMALL PHONES */
/* ========================================= */

@media (max-width: 480px) {
  .heroButtons {
    flex-direction: column;
  }

  .heroButtons button {
    width: 100%;
  }

  .stats {
    gap: 22px;
  }

  .stats strong {
    font-size: 21px;
  }

  .categoryGrid {
    grid-template-columns: 1fr;
  }

  .categoryCard {
    min-height: 150px;
  }

  .exploreControls {
    flex-direction: column;
  }

  .exploreControls select {
    width: 100%;
  }

  .searchBox button {
    padding-left: 14px;
    padding-right: 14px;
  }

  .uploadCard {
    padding: 22px;
  }

  .modalOverlay {
    padding: 10px;
  }

  .modalVisual {
    min-height: 230px;
  }

  .modalEmoji {
    font-size: 80px;
  }

  .modalInfoGrid {
    grid-template-columns: 1fr;
  }

  .modalContent {
    padding:
      30px
      20px
      24px;
  }

  .modalStats {
    gap: 6px;
  }

  .fileTypes {
    gap: 5px;
  }
}
