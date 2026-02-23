import { regionSelect } from "./dom.js";

///////////////////
// MAKE ELEMENT //
/////////////////
export function makeEl(elTag, elClass, elText, elId) {
  const element = document.createElement(elTag);
  if (elClass) element.className = elClass;
  if (elText) element.textContent = elText;
  if (elId) element.id = elId;
  return element;
}

/////////////////////
// MAKE CARD INFO //
///////////////////
export function makeInfoCard(text) {
  return makeEl("li", "card__info-data", text);
}

/////////////////////////////////////
// MAKE OPTIONS FOR SELECT REGION //
///////////////////////////////////
export function makeOptions(data) {
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
  continents.sort((a, b) => a.localeCompare(b));
  continents.forEach((continent) => {
    const selectContinent = makeEl("option", undefined, continent);
    selectContinent.value = continent;
    selectContinent.selected = true;
    regionSelect.append(selectContinent);
  });
}
