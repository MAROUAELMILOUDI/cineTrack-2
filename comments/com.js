const modalBody = document.getElementById("modal-body");
const wrapper = document.getElementById("modal-wrapper");
const panel = document.getElementById("com-panel");
const form = document.getElementById("com-form");
const list = document.getElementById("com-list");

modalBody.addEventListener("click", (e) => {
    if (e.target.closest("#com-btn")) {
        wrapper.classList.remove("justify-center");
        wrapper.classList.add("justify-start");
        panel.classList.remove("hidden");
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    addComment({
        name: document.getElementById("com-name").value,
        rating: Number(document.getElementById("com-rating").value),
        text: document.getElementById("com-text").value,
    });
    form.reset();
});

export function addComment({ name, rating, text }) {
    const item = document.createElement("div");
    item.className = "rounded-lg bg-gray-800 p-3";

    const top = document.createElement("div");
    top.className = "flex items-center justify-between";

    const nameEl = document.createElement("span");
    nameEl.className = "text-sm font-semibold";
    nameEl.textContent = name;

    const stars = document.createElement("span");
    stars.className = "text-xs text-yellow-400";
    stars.textContent = "★".repeat(rating);

    const textEl = document.createElement("p");
    textEl.className = "mt-1 text-sm text-gray-300";
    textEl.textContent = text;

    top.append(nameEl, stars);
    item.append(top, textEl);
    list.prepend(item);
}