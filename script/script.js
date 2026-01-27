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

const continents = [];
async function getCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,capital,population,independent,flags,continents");
    const data = await response.json();
    console.log(data.splice(0, 10));
    data.forEach((country) => {
      if (country.independent) {
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
        if (!continents.includes(country.continents[0])) {
          continents.push(country.continents[0]);
        }
        continents.sort();
      }
    });
    const allOption = makeEl("option", undefined, "All");
    allOption.value = "All";
    regionSelect.append(allOption);
    continents.forEach((region) => {
      const regionOption = makeEl("option", undefined, region);
      regionOption.value = region;
      regionSelect.append(regionOption);
    });
  } catch (err) {
    console.error(err);
  }
}
getCountries();

// fetch("https://restcountries.com/v3.1/name/deutschland")
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error("Error:", error));
