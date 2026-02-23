import {
  searchCountryBtn,
  searchCountryInput,
  regionSelect,
  sortBySelect,
  filterInfoResult,
  responseStatus,
  searchResults,
  prevBtn,
  paginationInfo,
  nextBtn,
  pageSizeSelect,
  firstPageBtn,
  lastPageBtn,
  searchBySelect,
  notIndependentTab,
  independentTab,
} from "./dom.js";

const onloadAPI = "https://restcountries.com/v3.1/all?fields=name,population,independent,flags,currencies,languages,borders,continents,capital,coatOfArms";

const countriesFromAPI = [];
let notIndependentCountries = [];
let countriesToSort = [];
let pageSize = JSON.parse(localStorage.getItem("pageSize")) || 12;
let pageCount = 1;
const saveFilter = JSON.parse(localStorage.getItem("filters")) || [];
let isIndependentActive = true;

import { skeletonPlaceholder } from "./SkeletonPlaceholder.js";
skeletonPlaceholder();

import { makeEl, makeInfoCard, makeOptions } from "./makeElement.js";
import openModal from "./modal.js";
import { applyTheme } from "./theme.js";

applyTheme();

///////////////////
// GET API DATA //
/////////////////
responseStatus.textContent = " Loading...";
async function getAPIData() {
  try {
    const response = await fetch(onloadAPI);
    const data = await response.json();
    countriesFromAPI.push(...data.filter((country) => country.independent));
    countriesToSort = [...countriesFromAPI];
    notIndependentCountries = data.filter((countries) => !countries.independent);

    makeOptions(countriesFromAPI);

    responseStatus.textContent = " Loaded";
    responseStatus.className = "status-loaded";
    return countriesFromAPI;
  } catch (err) {
    responseStatus.textContent = " Error";
    responseStatus.className = "status-error";
    const toastMsg = makeEl("div", "toast-msg", `Unable to load countries. Please try again later. ${err}`);
    setTimeout(() => {
      toastMsg.classList.add("toast-msg-active");
    }, 500);
    setTimeout(() => {
      toastMsg.classList.remove("toast-msg-active");
    }, 5000);
    document.body.append(toastMsg);
    console.log(err);
  }
}

/////////////////////////
// LOAD ALL COUNTRIES //
///////////////////////
let independentCountries = await getAPIData();
const regionOptions = [...regionSelect.options];

if (saveFilter.includes("All")) {
  sortCountries();
  // IF SOME WERE SELECTED
} else {
  countriesToSort = independentCountries.filter((el) => saveFilter.includes(el.continents[0]));
  regionOptions.forEach((el) => {
    el.selected = saveFilter.includes(el.value);
  });

  sortCountries();
  prevBtn.disabled = true;
  firstPageBtn.disabled = true;
  if (!saveFilter.length) {
    const optionEurope = regionOptions.find((option) => option.value === "Europe");
    optionEurope.selected = true;
    localStorage.setItem("filters", JSON.stringify([optionEurope.value]));
    countriesToSort = independentCountries.filter((el) => el.continents[0] === optionEurope.value);
    sortCountries();
  }
}
[...pageSizeSelect].forEach((el) => {
  if (el.value === pageSize) {
    el.selected = true;
  }
});

filterInfoResult.textContent = countriesToSort.length;
independentTab.classList.add("active-tab");
//////////////////////////////////////////////

////////////////////
//  MAKE COUNTRY //
//////////////////
function makeCountry(data) {
  searchResults.textContent = "";
  if (countriesToSort.length === 0) searchResults.textContent = "Please select region to se countries";
  data.forEach((country) => {
    const countryCard = makeEl("div", "search-results__card", undefined, "country-card");
    const countryFlag = makeEl("img", "card__flag");
    countryFlag.src = country.flags.svg;
    countryFlag.alt = country.flags.alt;
    const cardInfo = makeEl("ul", "card__info");
    const countryName = makeEl("li", "card__name", country.name.common);
    const countryContinent = makeInfoCard(`Region: ${country.continents.join(", ")}`);
    const countryCapital = makeInfoCard(`Capital: ${country.capital.length ? country.capital[0] : "None"}`);
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
      coatOfArms: country.coatOfArms,
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
    if (isIndependentActive === false) countriesToSort = [...notIndependentCountries];
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
    localStorage.setItem("filters", JSON.stringify(optionsContinents));
    nextBtn.disabled = true;
    lastPageBtn.disabled = true;
  } else {
    if (searchCountryInput.value.length === 0) {
      countriesToSort = isIndependentActive ? [...countriesFromAPI] : [...notIndependentCountries];
    } else {
      countriesToSort = countriesFromAPI.filter((country) => country.name.common.toLowerCase().includes(searchValue));
    }
    options.forEach((el) => {
      el.selected = true;
      optionsContinents.push(el.value);
    });

    localStorage.setItem("filters", JSON.stringify(optionsContinents));
  }
  filterInfoResult.textContent = countriesToSort.length;
  sortCountries();
}

//////////////////////////
// FILTER BY CONTINENT //
////////////////////////
regionSelect.onchange = filterByRegion;
function filterByRegion() {
  searchCountryInput.value = "";
  const optionAll = [...regionSelect.options].find((option) => option.value === "All");
  optionAll.onclick = clickOptionAll;

  checksAllContinent();
  // COUNTRY BY CONTINENT FILTER
  const selected = [...regionSelect.selectedOptions].map((opt) => opt.value);

  if (selected.length === 0) {
    searchCountryInput.disabled = true;
  } else {
    searchCountryInput.disabled = false;
  }

  if (isIndependentActive) {
    countriesToSort = countriesFromAPI.filter((country) => country.continents.some((continent) => selected.includes(continent)));
  } else {
    countriesToSort = notIndependentCountries.filter((country) => country.continents.some((continent) => selected.includes(continent)));
  }

  localStorage.setItem("filters", JSON.stringify(selected));

  if (searchCountryInput.value) {
    countriesToSort = countriesFromAPI.filter((country) => country.name.common.toLowerCase().includes(searchCountryInput.value.toLowerCase()));
    countriesToSort = countriesToSort.filter((country) => country.continents.some((continent) => selected.includes(continent)));
  }

  filterInfoResult.textContent = countriesToSort.length;

  pageCount = 1;
  sortCountries();
  getPaginationInfo();
}

//////////////////////////////
// SORT BY NAME/POPULATION //
////////////////////////////
sortBySelect.onchange = sortCountries;
function sortCountries() {
  pageCount = 1;
  prevBtn.disabled = true;
  firstPageBtn.disabled = true;
  switch (sortBySelect.value) {
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
    firstPageBtn.disabled = false;
  } else if (type === "-") {
    pageCount--;
  }

  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

////////////////////////
// FIRST / LAST PAGE //
//////////////////////
firstPageBtn.onclick = () => firstLastPage("first");
lastPageBtn.onclick = () => firstLastPage("last");
function firstLastPage(to) {
  if (to === "first") {
    pageCount = 1;
  } else if (to === "last") {
    pageCount = Math.ceil(countriesToSort.length / pageSize);
    nextBtn.disabled = true;
    lastPageBtn.disabled = true;
    prevBtn.disabled = false;
    firstPageBtn.disabled = false;
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
    firstPageBtn.disabled = true;
  }
  nextBtn.disabled = false;
  lastPageBtn.disabled = false;
  paginationInfo.textContent = "";
  let maxPageCount = Math.ceil(countriesToSort.length / pageSize);
  if (maxPageCount === 0) {
    maxPageCount = 1;
  }
  paginationInfo.textContent = `Page ${pageCount} of ${maxPageCount}`;
  if (pageCount === maxPageCount) {
    nextBtn.disabled = true;
    lastPageBtn.disabled = true;
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

/////////////////////
// SEARCH COUNTRY //
///////////////////
searchCountryInput.oninput = searchCountry;
searchCountryBtn.onclick = searchCountry;
async function searchCountry(e) {
  searchResults.textContent = "";
  const searchCountryName = searchCountryInput.value.trim().toLowerCase();
  let countriesToFilter;
  if (isIndependentActive) {
    countriesToFilter = [...countriesFromAPI];
  } else {
    countriesToFilter = [...notIndependentCountries];
  }

  const selectedContinents = new Set([...regionSelect.selectedOptions].map((o) => o.value));
  if (!selectedContinents.has("All")) {
    countriesToFilter = countriesToFilter.filter((c) => selectedContinents.has(c.continents[0]));
  }

  switch (searchBySelect.value) {
    case "contains":
      countriesToSort = countriesToFilter.filter((country) => country.name.common.toLowerCase().includes(searchCountryName));
      break;
    case "starts-with":
      countriesToSort = countriesToFilter.filter((country) => country.name.common.toLowerCase().startsWith(searchCountryName));
      break;
    case "ends-with":
      countriesToSort = countriesToFilter.filter((country) => country.name.common.toLowerCase().endsWith(searchCountryName));
      break;
    case "capital":
      countriesToSort = countriesToFilter.filter((country) => (country.capital[0] ? country.capital[0].toLowerCase().includes(searchCountryName) : ""));
      break;

    default:
      countriesToSort = countriesToFilter;
  }

  if (!countriesToSort.length) searchResults.textContent = "";

  filterInfoResult.textContent = countriesToSort.length;
  sortCountries();
  checksAllContinent();
}

////////////////
// SEARCH BY //
//////////////
searchBySelect.onchange = () => {
  searchCountryInput.value = "";
  filterByRegion();
};

///////////////////////
// RENDER COUNTRIES //
/////////////////////
function render() {
  const start = (pageCount - 1) * pageSize;
  const end = start + pageSize;
  makeCountry(countriesToSort.slice(start, end));

  const selected = [...regionSelect.selectedOptions].map((opt) => opt.value);
  if (selected.length === 0) {
    searchCountryInput.disabled = true;
    sortBySelect.disabled = true;
    nextBtn.disabled = true;
    lastPageBtn.disabled = true;
  } else {
    searchCountryInput.disabled = false;
    sortBySelect.disabled = false;
    nextBtn.disabled = false;
    lastPageBtn.disabled = false;
  }
  getPaginationInfo();
}

///////////////////
// TABS SECTION //
/////////////////
notIndependentTab.onclick = () => showTabContent(false);
independentTab.onclick = () => showTabContent(true);
function showTabContent(independent) {
  const regionOptions = [...regionSelect.options];

  if (independent) {
    if (!isIndependentActive) {
      const optionAntarctica = regionOptions.find((el) => el.value === "Antarctica");
      optionAntarctica.selected = false;
      optionAntarctica.remove();
    }
    independentTab.classList.add("active-tab");
    notIndependentTab.classList.remove("active-tab");
    countriesToSort = [...countriesFromAPI];

    isIndependentActive = true;
  } else {
    const optionAntarctica = makeEl("option", undefined, "Antarctica");
    regionSelect.append(optionAntarctica);
    if (regionOptions[0].selected) optionAntarctica.selected = true;

    notIndependentTab.classList.add("active-tab");
    independentTab.classList.remove("active-tab");
    isIndependentActive = false;
  }
  filterByRegion();
  getPaginationInfo();
}
