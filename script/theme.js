import { searchCountryBtn, prevBtn, nextBtn, firstPageBtn, lastPageBtn } from "./dom.js";
export const switchThemeBtn = document.getElementById("switch-theme");

let darkMode = JSON.parse(localStorage.getItem("darkMode"));

//////////////////////
// DARK/LIGHT MODE //
////////////////////
switchThemeBtn.onclick = switchTheme;
function switchTheme() {
  darkMode = !darkMode;
  localStorage.setItem("darkMode", JSON.stringify(darkMode));
  applyTheme();
}
export function applyTheme() {
  document.body.classList.toggle("dark-mode", darkMode);
  switchThemeBtn.classList.toggle("light", darkMode);
  switchThemeBtn.classList.toggle("dark", !darkMode);
  searchCountryBtn.classList.toggle("light-search", darkMode);
  searchCountryBtn.classList.toggle("dark-search", !darkMode);
  prevBtn.classList.toggle("light-prev", darkMode);
  prevBtn.classList.toggle("dark-prev", !darkMode);
  nextBtn.classList.toggle("light-next", darkMode);
  nextBtn.classList.toggle("dark-next", !darkMode);
  firstPageBtn.classList.toggle("light-first-page", darkMode);
  firstPageBtn.classList.toggle("dark-first-page", !darkMode);
  lastPageBtn.classList.toggle("light-last-page", darkMode);
  lastPageBtn.classList.toggle("dark-last-page", !darkMode);
}
