const switchThemeBtn = document.getElementById("switch-theme");
const searchCountryBtn = document.getElementById("search__btn");
const searchCountryInput = document.getElementById("search__input");
const regionSelect = document.getElementById("region");
const sortBy = document.getElementById("sort");
const filterInfoResult = document.getElementById("filter-info__result");
const searchResults = document.getElementById("search-results");

// API URL
const onloadAPI = "https://restcountries.com/v3.1/all?fields=name,capital,population,independent,flags,continents";

let countriesFromAPI = [];

////////////////////////////
// GET API DATA FUNCTION //
//////////////////////////
async function getAPIData() {
  try {
    const response = await fetch(onloadAPI);
    const data = await response.json();
    const independentCountries = data.filter((country) => country.independent);
    countriesFromAPI = independentCountries;
    return independentCountries;
  } catch (err) {
    console.error(err);
  }
}

/////////////////////////
// LOAD ALL COUNTRIES //
///////////////////////
async function loadAllCountries() {
  const independentCountries = await getAPIData();
  makeCountry(independentCountries);

  // MAKE SELECT/OPTION
  const optionALl = makeEl("option", undefined, "All");
  optionALl.value = "All";
  optionALl.selected = true;
  regionSelect.append(optionALl);
  // CONTINENTS OPTIONS
  const continents = [];
  independentCountries.forEach((country) => {
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
loadAllCountries();

function makeEl(elTag, elClass, elText, elId) {
  const element = document.createElement(elTag);
  if (elClass) element.className = elClass;
  if (elText) element.textContent = elText;
  return element;
}

// FUNCTIONS MAKE COUNTRY
function makeCountry(data) {
  data.forEach((country) => {
    const countryCard = makeEl("div", "search-results__card");
    const countryFlag = makeEl("img", "card__flag");
    countryFlag.src = country.flags.png;
    const cardInfo = makeEl("div", "card__info");
    const countryName = makeEl("h2", "card__name", country.name.common);
    const countryContinent = makeEl("p", "card__region", `Region: ${country.continents}`);
    const countryCapital = makeEl("p", "card__capital", `Capital: ${country.capital[0]}`);
    const formatPopulation = new Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(country.population);
    const countryPopulation = makeEl("p", "card__population", `Population: ${formatPopulation}`);
    cardInfo.append(countryName, countryContinent, countryCapital, countryPopulation);
    countryCard.append(countryFlag, cardInfo);
    searchResults.append(countryCard);
  });
}

regionSelect.onchange = filterByRegion;
function filterByRegion(e) {
  const options = [...regionSelect.options];
  const optionAll = options.find((option) => option.value === "All");
  const continentOptions = options.filter((option) => option.value !== "All");

  optionAll.onclick = () => {
    if (optionAll.selected === true) {
      optionAll.selected = false;
      searchResults.textContent = "";
      continentOptions.forEach((el) => {
        el.selected = false;
      });
    } else if (optionAll.selected === false) {
      optionAll.selected = true;
      continentOptions.forEach((el) => {
        el.selected = true;
      });
      regionSelect.textContent = "";
      searchResults.textContent = "";
      loadAllCountries();
    }
  };

  if (continentOptions.some((el) => !el.selected)) {
    optionAll.selected = false;
  } else {
    optionAll.selected = true;
  }

  // COUNTRY BY CONTINENT FILTER
  const selected = [...regionSelect.selectedOptions].map((opt) => opt.value);
  searchResults.textContent = "";
  const filteredCountries = [];
  countriesFromAPI.forEach((country) => {
    if (selected.includes(country.continents[0])) {
      filteredCountries.push(country);
    }
  });
  makeCountry(filteredCountries);
}
