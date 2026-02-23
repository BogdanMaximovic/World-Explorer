import { makeEl, makeInfoCard } from "./makeElement.js";
////////////
// MODAL //
//////////
export default function openModal(countryModalInfo) {
  const modalOverlay = makeEl("div", "modal-overlay", undefined, "modal-overlay");
  modalOverlay.onclick = () => modalOverlay.remove();
  const countryModal = countryModalInfo.countryCard.cloneNode(true);
  countryModal.onclick = (e) => {
    e.stopPropagation();
  };
  const countryBody = makeEl("div", "country-modal-body");
  const modalFlag = countryModal.querySelector("img.card__flag");
  const cardInfoList = countryModal.querySelector("ul.card__info");
  countryModal.className = "country-modal";
  // MODAL HEAD
  const modalHeader = makeEl("div", "close-modal");
  const modalHeaderTitle = makeEl("h2", "modal-title", countryModalInfo.countryName.textContent);

  const closeModalBtn = makeEl("button", "close-modal-btn");
  let darkModeModal = JSON.parse(localStorage.getItem("darkMode"));
  closeModalBtn.classList.toggle("close-modal-btn-light", darkModeModal);
  closeModalBtn.classList.toggle("lose-modal-btn-dark", !darkModeModal);
  closeModalBtn.onclick = () => modalOverlay.remove();

  modalHeader.append(modalHeaderTitle, closeModalBtn);
  countryModal.insertBefore(modalHeader, countryModal.firstChild);
  // END MODAL HEAD
  cardInfoList.firstElementChild.remove();

  const officialName = makeInfoCard(`Official name: ${countryModalInfo.officialName}`);
  cardInfoList.prepend(officialName);

  const countryModalLanguages = makeInfoCard(`Languages: ${Object.values(countryModalInfo.language).length ? Object.values(countryModalInfo.language).join(", ") : "None"}`);

  const countryModalCurrency = makeInfoCard(
    `Currency: ${Object.values(countryModalInfo.currency)
      .map((c) => c.name)
      .join(", ")}  (${Object.keys(countryModalInfo.currency).length ? Object.values(countryModalInfo.currency)[0].symbol : "None"})`,
  );

  const countryModalBorders = makeInfoCard(`Borders: ${countryModalInfo.borders.length ? countryModalInfo.borders.join(", ") : "None"}`);

  const modalCoatOfArmsBtn = makeEl("button", "modal-coat-of-arms-btn", "Show Coat of Arms");
  const cancelModalBtn = makeEl("button", "cancel-modal", "Close");
  cancelModalBtn.onclick = () => modalOverlay.remove();

  const modalFooter = makeEl("div", "modal-footer");

  modalFooter.append(modalCoatOfArmsBtn, cancelModalBtn);

  cardInfoList.append(countryModalLanguages, countryModalCurrency, countryModalBorders, modalFooter);

  const modalCoatOfArms = makeEl("img", "modal-coat-of-arms");

  modalCoatOfArms.src = countryModalInfo.coatOfArms.svg;
  modalCoatOfArms.alt = `The coat of arms of ${countryModalInfo.commonName}`;
  if (!countryModalInfo.coatOfArms.svg) modalCoatOfArmsBtn.disabled = true;

  let isCoatOfArmsActive = false;
  modalCoatOfArmsBtn.onclick = () => {
    if (!isCoatOfArmsActive) {
      modalCoatOfArmsBtn.textContent = "Hide Coat of Arms";
      modalFooter.before(modalCoatOfArms);
      isCoatOfArmsActive = true;
    } else if (isCoatOfArmsActive) {
      modalCoatOfArmsBtn.textContent = "Show Coat of Arms";
      modalCoatOfArms.remove();
      isCoatOfArmsActive = false;
    }
  };

  document.body.classList.add("body-modal");

  countryBody.append(modalFlag, cardInfoList);
  countryModal.append(countryBody);
  modalOverlay.append(countryModal);
  document.body.append(modalOverlay);
}
