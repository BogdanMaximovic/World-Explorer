const switchThemeBtn = document.getElementById("switch-theme");
const searchCountryBtn = document.getElementById("search__btn");
const searchCountryInput = document.getElementById("search__input");
const regionSelect = document.getElementById("region");
const sortBy = document.getElementById("sort");
const filterInfoResult = document.getElementById("filter-info__result");
const searchResults = document.getElementById("search-results");
const prevBtn = document.getElementById("prev-btn");
const paginationInfo = document.getElementById("pagination-info");
const nextBtn = document.getElementById("next-btn");
const pageSizeSelect = document.getElementById("page-size");

// API URL
const onloadAPI = "https://restcountries.com/v3.1/all?fields=name,population,independent,flags,currencies,subregion,languages,borders,continents,capital";

let countriesFromAPI = [];
let countriesToSort = [];
let pageSize = 12;
let pageCount = 1;

////////////////////////////
// GET API DATA FUNCTION //
//////////////////////////
async function getAPIData() {
  try {
    const response = await fetch(onloadAPI);
    const data = await response.json();
    countriesFromAPI = data.filter((country) => country.independent);
    countriesToSort = countriesFromAPI;
    console.log(countriesFromAPI[70]);
    makeOptions(countriesFromAPI);

    return countriesFromAPI;
  } catch (err) {
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

// MAKE OPTIONS FOR SELECT REGION //
function makeOptions(data) {
  const optionAll = makeEl("option", undefined, "All");
  optionAll.value = "All";
  optionAll.selected = true;
  regionSelect.append(optionAll);

  // CONTINENTS OPTIONS
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

/////////////////////////
// LOAD ALL COUNTRIES //
///////////////////////
async function loadAllCountries() {
  const independentCountries = await getAPIData();
  prevBtn.disabled = true;
  makeCountry(independentCountries.slice(0, pageSize));
  getPaginationInfo();
  filterInfoResult.textContent = independentCountries.length;
}
loadAllCountries();

////////////////////////////
// MAKE ELEMENT FUNCTION //
//////////////////////////
function makeEl(elTag, elClass, elText, elId) {
  const element = document.createElement(elTag);
  if (elClass) element.className = elClass;
  if (elText) element.textContent = elText;
  if (elId) element.id = elId;
  return element;
}

/////////////////////////////
// FUNCTIONS MAKE COUNTRY //
///////////////////////////
function makeCountry(data) {
  searchResults.textContent = "";
  data.forEach((country) => {
    const countryCard = makeEl("div", "search-results__card", undefined, "country-card");
    const countryFlag = makeEl("img", "card__flag");
    countryFlag.src = country.flags.png;
    countryFlag.alt = country.flags.alt;
    const cardInfo = makeEl("ul", "card__info");
    const countryName = makeEl("h2", "card__name", country.name.common);
    const countryContinent = makeEl("li", "card__info-data", `Region: ${country.continents}`);
    const countryCapital = makeEl("li", "card__info-data", `Capital: ${country.capital[0]}`);
    const formatPopulation = new Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(country.population);
    const countryPopulation = makeEl("li", "card__info-data", `Population: ${formatPopulation}`);
    // CALL MODAL FUNCTION
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
    // CALL MODAL FUNCTION
    cardInfo.append(countryName, countryContinent, countryCapital, countryPopulation);
    countryCard.append(countryFlag, cardInfo);
    searchResults.append(countryCard);
  });
}

//////////////////////////
// FILTER BY CONTINENT //
////////////////////////
regionSelect.onchange = filterByRegion;
function filterByRegion() {
  const options = [...regionSelect.options];
  const optionAll = options.find((option) => option.value === "All");
  const continentOptions = options.filter((option) => option.value !== "All");

  // ONCLICK OPTION ALL /////
  optionAll.onclick = () => {
    countriesToSort = [];
    searchResults.textContent = "";
    if (optionAll.selected === true) {
      filterInfoResult.textContent = 0;
      optionAll.selected = false;
      continentOptions.forEach((el) => {
        el.selected = false;
      });
    } else if (optionAll.selected === false) {
      optionAll.selected = true;
      countriesToSort = countriesFromAPI;
      continentOptions.forEach((el) => {
        el.selected = true;
      });
      if (!sortBy.value) {
        regionSelect.textContent = "";
        loadAllCountries();
      } else {
        sortCountries();
      }
    }
  };

  if (continentOptions.some((el) => !el.selected)) {
    optionAll.selected = false;
  } else {
    optionAll.selected = true;
  }

  // COUNTRY BY CONTINENT FILTER
  const selected = [...regionSelect.selectedOptions].map((opt) => opt.value);
  const filteredCountries = [];
  countriesFromAPI.forEach((country) => {
    if (selected.includes(country.continents[0])) {
      filteredCountries.push(country);
    }
  });
  countriesToSort = filteredCountries;

  filterInfoResult.textContent = filteredCountries.length;

  sortBy.value === "" ? makeCountry(filteredCountries.slice(0, pageSize)) : sortCountries();
  pageCount = 1;
  getPaginationInfo();
}

//////////////////////////////
// SORT BY NAME/POPULATION //
////////////////////////////
sortBy.onchange = sortCountries;
function sortCountries() {
  pageCount = 1;
  getPaginationInfo();
  prevBtn.disabled = true;
  let arrToSort = [];
  if (sortBy.value === "name-asc") {
    arrToSort = countriesToSort.sort((a, b) => a.name.common.localeCompare(b.name.common));
  } else if (sortBy.value === "name-desc") {
    arrToSort = countriesToSort.sort((a, b) => b.name.common.localeCompare(a.name.common));
  } else if (sortBy.value === "population-asc") {
    arrToSort = countriesToSort.sort((a, b) => a.population - b.population);
  } else if (sortBy.value === "population-desc") {
    arrToSort = countriesToSort.sort((a, b) => b.population - a.population);
  }
  makeCountry(arrToSort.slice(0, pageSize));
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
  const start = (pageCount - 1) * pageSize;
  makeCountry(countriesToSort.slice(start, start + pageSize));
  getPaginationInfo();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

///////////////////////////////
// PAGINATION INFO FUNCTION //
/////////////////////////////
function getPaginationInfo() {
  if (pageCount === 1) {
    prevBtn.disabled = true;
  }
  nextBtn.disabled = false;
  paginationInfo.textContent = "";
  paginationInfo.textContent = `Page ${pageCount} of ${Math.ceil(countriesToSort.length / pageSize)}`;
  if (pageCount === Math.ceil(countriesToSort.length / pageSize)) {
    nextBtn.disabled = true;
  }
}

////////////////////////////////
// PAGE SIZE SELECT FUNCTION //
//////////////////////////////
pageSizeSelect.onchange = setPageSize;
function setPageSize(e) {
  pageSize = Number(e.target.value);
  pageCount = 1;
  searchResults.textContent = "";
  makeCountry(countriesToSort.slice(0, pageSize));
  getPaginationInfo();
}

//////////////////////
// MODAL FUNCTIONS //
////////////////////

function openModal(countryModalInfo) {
  const modalOverlay = makeEl("div", "modal-overlay", undefined, "modal-overlay");
  const countryModal = countryModalInfo.countryCard.cloneNode(true);
  countryModal.className = "country-modal";
  // MODAL HEAD
  const modalHeader = makeEl("div", "close-modal");
  const modalHeaderTitle = makeEl("h2", "modal-title", countryModalInfo.countryName.textContent);
  const closeModalBtn = makeEl("button", "close-modal-btn");
  closeModalBtn.onclick = closeModalOverlay;
  modalHeader.append(modalHeaderTitle, closeModalBtn);
  countryModal.insertBefore(modalHeader, countryModal.firstChild);
  // MODAL HEAD
  countryModal.querySelector("ul.card__info").firstElementChild.remove();
  // SHORT MAKE LI FUNCTION
  const makeCardInfo = (text) => makeEl("li", "card__info-data", text);
  // SHORT MAKE LI FUNCTION
  const officialName = makeCardInfo(`Official name: ${countryModalInfo.officialName}`);
  countryModal.lastElementChild.insertBefore(officialName, countryModal.lastElementChild.firstChild);

  const countryModalSubregion = makeCardInfo(`Subregion: ${countryModalInfo.subregion}`);

  const countryModalLanguages = makeCardInfo(`Languages: ${Object.values(countryModalInfo.language)}`);

  const countryModalCurrency = makeCardInfo(
    `Currency: ${Object.values(countryModalInfo.currency)
      .map((c) => c.name)
      .join(", ")}`,
  );
  const countryModalBorders = makeCardInfo(`Borders: ${CheckIfBordersExist(countryModalInfo.borders.map((el) => " " + el))}`);

  const cancelModalBtn = makeEl("button", "cancel-modal", "Cancel");
  cancelModalBtn.onclick = closeModalOverlay;

  countryModal.querySelector("ul.card__info").append(countryModalSubregion, countryModalLanguages, countryModalCurrency, countryModalBorders, cancelModalBtn);

  document.body.classList.add("body-modal");

  const countryBody = makeEl("div", "country-modal-body");
  const modalFlag = countryModal.querySelector("img.card__flag");
  const modalList = countryModal.querySelector("ul.card__info");

  countryBody.append(modalFlag, modalList);
  countryModal.append(countryBody);
  modalOverlay.append(countryModal);
  document.body.append(modalOverlay);
}

///////////////////////////
// CLOSE MODAL FUNCTION //
/////////////////////////
function closeModalOverlay() {
  const modal = document.getElementById("modal-overlay");
  modal.remove();
}

function CheckIfBordersExist(borders) {
  if (!borders.length) {
    return "None";
  } else {
    return borders;
  }
}
