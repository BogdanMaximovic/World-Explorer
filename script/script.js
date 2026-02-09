const switchThemeBtn = document.getElementById("switch-theme");
const searchCountryBtn = document.getElementById("search__btn");
const searchCountryInput = document.getElementById("search__input");
const regionSelect = document.getElementById("region");
const sortBy = document.getElementById("sort");
const filterInfoResult = document.getElementById("filter-info__result");
const responseStatus = document.getElementById("filter-status");
const searchResults = document.getElementById("search-results");
const prevBtn = document.getElementById("prev-btn");
const paginationInfo = document.getElementById("pagination-info");
const nextBtn = document.getElementById("next-btn");
const pageSizeSelect = document.getElementById("page-size");

const onloadAPI = "https://restcountries.com/v3.1/all?fields=name,population,independent,flags,currencies,subregion,languages,borders,continents,capital";

let countriesFromAPI = [];
let countriesToSort = [];
let pageSize = JSON.parse(localStorage.getItem("pageSize")) || 12;
let pageCount = 1;
const saveFilter = JSON.parse(localStorage.getItem("filters"));
let darkMode = JSON.parse(localStorage.getItem("darkMode"));

//////////////////////
// DARK/LIGHT MODE //
////////////////////
applyTheme();
switchThemeBtn.onclick = switchTheme;
function switchTheme() {
  darkMode = !darkMode;
  localStorage.setItem("darkMode", JSON.stringify(darkMode));
  applyTheme();
}
function applyTheme() {
  document.body.classList.toggle("dark-mode", darkMode);
  switchThemeBtn.classList.toggle("light", darkMode);
  switchThemeBtn.classList.toggle("dark", !darkMode);
  searchCountryBtn.classList.toggle("light-search", darkMode);
  searchCountryBtn.classList.toggle("dark-search", !darkMode);
  prevBtn.classList.toggle("light-prev", darkMode);
  prevBtn.classList.toggle("dark-prev", !darkMode);
  nextBtn.classList.toggle("light-next", darkMode);
  nextBtn.classList.toggle("dark-next", !darkMode);
}

///////////////////
// GET API DATA //
/////////////////
responseStatus.textContent = " Loading...";
async function getAPIData() {
  try {
    const response = await fetch(onloadAPI);
    const data = await response.json();
    countriesFromAPI = data.filter((country) => country.independent);
    countriesToSort = [...countriesFromAPI];
    makeOptions(countriesFromAPI);

    responseStatus.textContent = " Loaded";
    responseStatus.className = "status-loaded";
    return countriesFromAPI;
  } catch (err) {
    responseStatus.textContent = " Error";
    responseStatus.className = "status-error";
    const toastMsg = makeEl("div", "toast-msg", `Unable to load countries. Please try again later.`);
    setTimeout(() => {
      toastMsg.classList.add("toast-msg-active");
    }, 500);
    setTimeout(() => {
      toastMsg.classList.remove("toast-msg-active");
    }, 5000);
    document.body.append(toastMsg);
  }
}

/////////////////////////////////////
// MAKE OPTIONS FOR SELECT REGION //
///////////////////////////////////
function makeOptions(data) {
  const optionAll = makeEl("option", undefined, "All");
  optionAll.value = "All";
  optionAll.selected = true;
  regionSelect.append(optionAll);

  const continents = [];
  data.forEach((country) => {
    if (!continents.includes(country.continents[0])) {
      continents.push(country.continents[0]);
    }
  });
  continents.sort();
  continents.forEach((continent) => {
    const selectContinent = makeEl("option", undefined, continent);
    selectContinent.value = continent;
    selectContinent.selected = true;
    regionSelect.append(selectContinent);
  });
}

///////////////////////
// RENDER COUNTRIES //
/////////////////////
function render() {
  const start = (pageCount - 1) * pageSize;
  const end = start + pageSize;
  makeCountry(countriesToSort.slice(start, end));
  getPaginationInfo();
}

/////////////////////////
// LOAD ALL COUNTRIES //
///////////////////////
async function loadAllCountries() {
  let independentCountries = await getAPIData();
  const regionOptions = [...regionSelect.options];

  // IF REGION SELECT HAD NO SELECTED OPTIONS
  if (!saveFilter) {
    searchResults.textContent = "";
    filterInfoResult.textContent = 0;
    countriesToSort = [];
    getPaginationInfo();
    [...pageSizeSelect].forEach((el) => {
      if (el.value == pageSize) {
        el.selected = false;
      }
    });
    regionOptions.forEach((el) => (el.selected = false));
    // IF ALL WAS SELECTED
  } else if (saveFilter.includes("All")) {
    render();
    // IF SOME WERE SELECTED
  } else {
    countriesToSort = independentCountries.filter((el) => saveFilter.includes(el.continents[0]));

    regionOptions.forEach((el) => {
      saveFilter.includes(el.value) ? (el.selected = true) : (el.selected = false);
    });

    render();
    prevBtn.disabled = true;
  }

  [...pageSizeSelect].forEach((el) => {
    if (el.value == pageSize) {
      el.selected = true;
    }
  });
  filterInfoResult.textContent = countriesToSort.length;
}
loadAllCountries();

///////////////////
// MAKE ELEMENT //
/////////////////
function makeEl(elTag, elClass, elText, elId) {
  const element = document.createElement(elTag);
  if (elClass) element.className = elClass;
  if (elText) element.textContent = elText;
  if (elId) element.id = elId;
  return element;
}

/////////////////////
// MAKE CARD INFO //
///////////////////
function makeInfoCard(text) {
  return makeEl("li", "card__info-data", text);
}

////////////////////
//  MAKE COUNTRY //
//////////////////
function makeCountry(data) {
  searchResults.textContent = "";
  data.forEach((country) => {
    const countryCard = makeEl("div", "search-results__card", undefined, "country-card");
    const countryFlag = makeEl("img", "card__flag");
    countryFlag.src = country.flags.png;
    countryFlag.alt = country.flags.alt;
    const cardInfo = makeEl("ul", "card__info");
    const countryName = makeEl("h2", "card__name", country.name.common);
    const countryContinent = makeInfoCard(`Region: ${country.continents.join(", ")}`);
    const countryCapital = makeInfoCard(`Capital: ${country.capital[0]}`);
    const formatPopulation = new Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(country.population);
    const countryPopulation = makeInfoCard(`Population: ${formatPopulation}`);
    //  START CALL MODAL
    const countryModalInfo = {
      countryCard,
      countryName,
      countryFlag,
      cardInfo,
      commonName: country.name.common,
      officialName: country.name.official,
      subregion: country.subregion,
      language: country.languages,
      currency: country.currencies,
      borders: country.borders,
    };
    countryCard.onclick = () => openModal(countryModalInfo);
    // END CALL MODAL
    cardInfo.append(countryName, countryContinent, countryCapital, countryPopulation);
    countryCard.append(countryFlag, cardInfo);
    searchResults.append(countryCard);
  });
}

// CHECK IF ALL CONTINENTS ARE SELECTED //
function checksAllContinent() {
  const options = [...regionSelect.options];
  const optionAll = options.find((option) => option.value === "All");
  const continentOptions = options.filter((option) => option.value !== "All");

  if (continentOptions.some((el) => !el.selected)) {
    optionAll.selected = false;
  } else {
    optionAll.selected = true;
  }
}

///////////////////////
// CLICK OPTION ALL //
/////////////////////
function clickOptionAll() {
  const options = [...regionSelect.options];
  const optionAll = options.find((option) => option.value === "All");
  const optionsContinents = [];

  countriesToSort = [];
  searchResults.textContent = "";

  if (optionAll.selected === true) {
    options.forEach((el) => {
      el.selected = false;
    });
    localStorage.removeItem("filters");
  } else if (optionAll.selected === false) {
    if (!searchCountryInput.value.length) {
      countriesToSort = [...countriesFromAPI];
    } else {
      countriesFromAPI.forEach((el) => {
        if (el.name.common.toLowerCase().includes(searchCountryInput.value.toLowerCase())) {
          countriesToSort.push(el);
        }
      });
    }
    options.forEach((el) => {
      el.selected = true;
      optionsContinents.push(el.value);
    });

    localStorage.setItem("filters", JSON.stringify(optionsContinents));
    sortBy.value === "" ? render() : sortCountries();
  }
  filterInfoResult.textContent = countriesToSort.length;
  getPaginationInfo();
}

//////////////////////////
// FILTER BY CONTINENT //
////////////////////////
regionSelect.onchange = filterByRegion;
function filterByRegion() {
  const optionAll = [...regionSelect.options].find((option) => option.value === "All");
  optionAll.onclick = clickOptionAll;

  checksAllContinent();

  // COUNTRY BY CONTINENT FILTER
  const selected = [...regionSelect.selectedOptions].map((opt) => opt.value);

  countriesToSort = countriesFromAPI.filter((country) => country.continents.some((continent) => selected.includes(continent)));

  localStorage.setItem("filters", JSON.stringify(selected));

  if (searchCountryInput.value) {
    countriesToSort = countriesFromAPI.filter((country) => country.name.common.toLowerCase().includes(searchCountryInput.value.toLowerCase()));
    countriesToSort = countriesToSort.filter((country) => country.continents.some((continent) => selected.includes(continent)));
  }

  filterInfoResult.textContent = countriesToSort.length;

  pageCount = 1;
  sortBy.value === "" ? render() : sortCountries();
}

//////////////////////////////
// SORT BY NAME/POPULATION //
////////////////////////////
sortBy.onchange = sortCountries;
function sortCountries() {
  pageCount = 1;
  prevBtn.disabled = true;
  switch (sortBy.value) {
    case "name-asc":
      countriesToSort.sort((a, b) => a.name.common.localeCompare(b.name.common));
      break;
    case "name-desc":
      countriesToSort.sort((a, b) => b.name.common.localeCompare(a.name.common));
      break;
    case "population-asc":
      countriesToSort.sort((a, b) => a.population - b.population);
      break;
    case "population-desc":
      countriesToSort.sort((a, b) => b.population - a.population);
      break;
  }
  render();
}

/////////////////
// PAGINATION //
///////////////
nextBtn.onclick = () => pagination("+");
prevBtn.onclick = () => pagination("-");
function pagination(type) {
  if (type === "+") {
    pageCount++;
    prevBtn.disabled = false;
  } else if (type === "-") {
    pageCount--;
  }

  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/////////////////////
// PAGINATION INFO//
///////////////////
function getPaginationInfo() {
  if (pageCount === 1) {
    prevBtn.disabled = true;
  }
  nextBtn.disabled = false;
  paginationInfo.textContent = "";
  let maxPageCount = Math.ceil(countriesToSort.length / pageSize);
  if (maxPageCount === 0) {
    maxPageCount = 1;
  }
  paginationInfo.textContent = `Page ${pageCount} of ${maxPageCount}`;
  if (pageCount === Math.ceil(countriesToSort.length / pageSize)) {
    nextBtn.disabled = true;
  }
}

///////////////////////
// PAGE SIZE SELECT //
/////////////////////
pageSizeSelect.onchange = setPageSize;
function setPageSize(e) {
  pageSize = Number(e.target.value);
  localStorage.setItem("pageSize", JSON.stringify(pageSize));
  pageCount = 1;
  searchResults.textContent = "";
  render();
}

////////////
// MODAL //
//////////
function openModal(countryModalInfo) {
  const modalOverlay = makeEl("div", "modal-overlay", undefined, "modal-overlay");
  const countryModal = countryModalInfo.countryCard.cloneNode(true);
  const countryBody = makeEl("div", "country-modal-body");
  const modalFlag = countryModal.querySelector("img.card__flag");
  const cardInfoList = countryModal.querySelector("ul.card__info");
  countryModal.className = "country-modal";
  // MODAL HEAD
  const modalHeader = makeEl("div", "close-modal");
  const modalHeaderTitle = makeEl("h2", "modal-title", countryModalInfo.countryName.textContent);
  const closeModalBtn = makeEl("button", "close-modal-btn");
  closeModalBtn.onclick = () => modalOverlay.remove();

  closeModalBtn.classList.toggle("close-modal-btn-light", darkMode);
  closeModalBtn.classList.toggle("lose-modal-btn-dark", !darkMode);

  modalHeader.append(modalHeaderTitle, closeModalBtn);
  countryModal.insertBefore(modalHeader, countryModal.firstChild);
  // END MODAL HEAD
  cardInfoList.firstElementChild.remove();

  const officialName = makeInfoCard(`Official name: ${countryModalInfo.officialName}`);
  cardInfoList.prepend(officialName);

  const countryModalSubregion = makeInfoCard(`Subregion: ${countryModalInfo.subregion}`);

  const countryModalLanguages = makeInfoCard(`Languages: ${Object.values(countryModalInfo.language).join(", ")}`);

  const countryModalCurrency = makeInfoCard(
    `Currency: ${Object.values(countryModalInfo.currency)
      .map((c) => c.name)
      .join(", ")}`,
  );

  const countryModalBorders = makeInfoCard(`Borders: ${countryModalInfo.borders.length ? countryModalInfo.borders.join(", ") : "None"}`);

  const cancelModalBtn = makeEl("button", "cancel-modal", "Cancel");
  cancelModalBtn.onclick = () => modalOverlay.remove();

  cardInfoList.append(countryModalSubregion, countryModalLanguages, countryModalCurrency, countryModalBorders, cancelModalBtn);

  document.body.classList.add("body-modal");

  countryBody.append(modalFlag, cardInfoList);
  countryModal.append(countryBody);
  modalOverlay.append(countryModal);
  document.body.append(modalOverlay);
}

/////////////////////
// SEARCH COUNTRY //
///////////////////
searchCountryInput.oninput = searchCountry;
searchCountryBtn.onclick = searchCountry;
async function searchCountry(e) {
  searchResults.textContent = "";
  const searchCountryName = searchCountryInput.value.trim().toLowerCase();
  let countriesToFilter = [...countriesFromAPI];
  const selectedContinents = [...regionSelect.selectedOptions].map((o) => o.value);
  if (!selectedContinents.includes("All")) {
    countriesToFilter = countriesToFilter.filter((c) => selectedContinents.includes(c.continents[0]));
  }

  countriesToSort = countriesToFilter.filter((country) => country.name.common.toLowerCase().includes(searchCountryName));

  if (!countriesToSort.length) searchResults.textContent = "";

  filterInfoResult.textContent = countriesToSort.length;
  sortBy.value === "" ? render() : sortCountries();

  checksAllContinent();
}

///////////////////////////
// SKELETON PLACEHOLDER //
/////////////////////////
function skeletonPlaceholder() {
  for (let i = 1; i < pageSize; i++) {
    const countryCard = makeEl("div", "search-results__card");
    const countryFlag = makeEl("img", "card__flag");
    countryFlag.classList.add("skeleton");
    const cardInfo = makeEl("ul", "card__info");
    const countryName = makeEl("h2", "card__name");
    const countryContinent = makeInfoCard();
    const countryCapital = makeInfoCard();
    const countryPopulation = makeInfoCard();
    [countryContinent, countryCapital, countryPopulation].forEach((el) => el.classList.add("skeleton-text"));
    countryName.classList.add("skeleton-heading");
    cardInfo.append(countryName, countryContinent, countryCapital, countryPopulation);
    countryCard.append(countryFlag, cardInfo);
    searchResults.append(countryCard);
  }
}
skeletonPlaceholder();

////////////////////
// SCROLL TO TOP //
//////////////////
const scrollToTopBTn = document.getElementById("scroll-to-top");
scrollToTopBTn.onclick = scrollToTop;
function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}
window.addEventListener("scroll", () => {
  window.scrollY > window.innerHeight / 3 ? scrollToTopBTn.classList.add("show") : scrollToTopBTn.classList.remove("show");
});
