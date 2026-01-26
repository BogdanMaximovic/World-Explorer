const switchThemeBtn = document.getElementById("switch-theme");
const searchCountryBtn = document.getElementById("search__btn");
const searchCountryInput = document.getElementById("search__input");
const regionSelect = document.getElementById("region");
const sortBy = document.getElementById("sort");
const filterInfoResult = document.getElementById("filter-info__result");
const searchResults = document.getElementById("search-results");

function makeEl(elTag, elClass, elText) {
  const element = document.createElement(elTag);
  if (elClass) element.className = elClass;
  if (elText) element.textContent = elText;
  return element;
}

const regions = [];
async function getCountries() {
  const response = await fetch("https://restcountries.com/v3.1/all?fields=name,region,capital,population,independent,flags");
  const data = await response.json();
  data.forEach((country) => {
    if (country.independent) {
      const countryCard = makeEl("div", "search-results__card");
      const countryFlag = makeEl("img", "card__flag");
      countryFlag.src = country.flags.png;
      const cardInfo = makeEl("div", "card__info");
      const countryName = makeEl("h2", "card__name", country.name.common);
      const countryRegion = makeEl("p", "card__region", `Region: ${country.region}`);
      const countryCapital = makeEl("p", "card__capital", `Capital: ${country.capital[0]}`);
      const formatPopulation = new Intl.NumberFormat("en-US", {
        notation: "compact",
      }).format(country.population);
      const countryPopulation = makeEl("p", "card__population", `Population: ${formatPopulation}`);
      cardInfo.append(countryName, countryRegion, countryCapital, countryPopulation);
      countryCard.append(countryFlag, cardInfo);
      searchResults.append(countryCard);
      if (regions.includes(country.region)) {
        return;
      } else {
        regions.push(country.region);
      }
      console.log(regions);
      regions.sort();
    }
  });
  regions.forEach((region) => {
    const regionOption = makeEl("option", undefined, region);
    regionOption.value = region;
    regionSelect.append(regionOption);
  });
}
getCountries();
