const switchThemeBtn = document.getElementById("switch-theme");
const searchCountryBtn = document.getElementById("search__btn");
const searchCountryInput = document.getElementById("search__input");
const regionSelect = document.getElementById("region");
const sortBy = document.getElementById("sort");
const filterInfoResult = document.getElementById("filter-info__result");
const searchResults = document.getElementById("search-results");

function makeEl(elTag, elClass, elText, elId) {
  const element = document.createElement(elTag);
  if (elClass) element.className = elClass;
  if (elText) element.textContent = elText;
  if (elId) element.id = elId;
  return element;
}

function makeCountry(data) {
  const selected = [...regionSelect.selectedOptions].map((opt) => opt.value);
  data.forEach((country) => {
    if (country.independent) {
      if (selected.includes(country.continents[0])) {
        continentCountries.push(country);
      }
    }
  });

  continentCountries.forEach((country) => {
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

let allCountries = [];
const continents = [];
const continentCountries = [];

async function getCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,capital,population,independent,flags,continents");
    const data = await response.json();
    allCountries = data;

    data.forEach((country) => {
      if (country.independent) {
        if (!continents.includes(country.continents[0])) {
          continents.push(country.continents[0]);
        }
      }
      continents.sort();
    });
    continents.forEach((region) => {
      const regionOption = makeEl("option", undefined, region, region.replaceAll(" ", "-").toLowerCase());
      regionOption.value = region;
      regionOption.selected = true;
      regionSelect.append(regionOption);
    });
    makeCountry(data);
  } catch (err) {
    console.error(err);
  }
}
getCountries();

regionSelect.onchange = selectedOptions;
function selectedOptions(e) {
  searchResults.textContent = "";
  continentCountries.length = 0;
  makeCountry(allCountries);
}
