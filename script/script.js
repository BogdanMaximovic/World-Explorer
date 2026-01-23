const switchThemeBtn = document.getElementById("switch-theme");
const searchCountryBtn = document.getElementById("search__btn");
const searchCountryInput = document.getElementById("search__input");
const region = document.getElementById("region");
const sortBy = document.getElementById("sort");
const filterInfoResult = document.getElementById("filter-info__result");
const searchResults = document.getElementById("search-results");

function makeEl(elTag, elClass, elText) {
  const element = document.createElement(elTag);
  if (elClass) element.className = elClass;
  if (elText) element.textContent = elText;
  return element;
}

async function getCountries() {
  const response = await fetch("https://restcountries.com/v3.1/all?fields=name,region,capital,population,independent,flags");
  const data = await response.json();
  // console.log(data);
  data.forEach((el) => {
    if (el.independent) {
      console.log(el);
      const countryCard = makeEl("div", "search-results__card");

      const countryFlag = makeEl("img", "card__flag");
      countryFlag.src = el.flags.png;
      const cardInfo = makeEl("div", "card__info");
      const countryName = makeEl("h2", "card__name", el.name.common);
      const countryRegion = makeEl("p", "card__region", el.region);
      const countryCapital = makeEl("p", "card__capital", el.capital[0]);
      // Need to change 1200000 to 1.2M
      const countryPopulation = makeEl("p", "card__population", el.population);
      cardInfo.append(countryName, countryRegion, countryCapital, countryPopulation);
      countryCard.append(countryFlag, cardInfo);
      searchResults.append(countryCard);
    }
  });
}
getCountries();
