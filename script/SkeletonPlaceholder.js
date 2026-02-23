import { searchResults } from "./dom.js";
import { makeEl, makeInfoCard } from "./makeElement.js";

///////////////////////////
// SKELETON PLACEHOLDER //
/////////////////////////
export function skeletonPlaceholder() {
  for (let i = 1; i < 12; i++) {
    const countryCard = makeEl("div", "search-results__card");
    const countryFlag = makeEl("img", "card__flag");
    countryFlag.classList.add("skeleton");
    const cardInfo = makeEl("ul", "card__info");
    const countryName = makeEl("li", "card__name");
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
