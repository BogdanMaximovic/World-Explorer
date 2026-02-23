const main = document.querySelector("main");
const filterSection = document.getElementById("filter");
const collapseBtn = document.getElementById("collapse-btn");
const collapseSlidePanel = document.getElementById("filter-collapse");

//////////////////////
// FILTER COLLAPSE //
////////////////////
let isFilterSectionCollapsed = false;
collapseBtn.onclick = () => {
  isFilterSectionCollapsed = !isFilterSectionCollapsed;

  collapseBtn.classList.toggle("collapse__btn", !isFilterSectionCollapsed);
  collapseBtn.classList.toggle("expand__btn", isFilterSectionCollapsed);

  if (isFilterSectionCollapsed) {
    filterSection.remove();
  } else {
    main.prepend(filterSection);
  }
};

window.addEventListener("scroll", () => {
  window.scrollY >= 300 ? collapseSlidePanel.classList.add("filter__collapse-by") : collapseSlidePanel.classList.remove("filter__collapse-by");
});
