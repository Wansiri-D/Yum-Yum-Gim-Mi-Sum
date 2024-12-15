const allSections = document.querySelectorAll("section");

export function hideAll() {
    allSections.forEach((section) => section.classList.add("hidden"));
}
