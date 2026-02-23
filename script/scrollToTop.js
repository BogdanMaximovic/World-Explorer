////////////////////
// SCROLL TO TOP //
//////////////////
const scrollToTopBTn = document.getElementById("scroll-to-top");
scrollToTopBTn.onclick = scrollToTop;
function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}
window.addEventListener("scroll", () => {
  window.scrollY > window.innerHeight / 3 ? scrollToTopBTn.classList.add("show") : scrollToTopBTn.classList.remove("show");
});
