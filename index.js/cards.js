import { initialiser } from "./api.js";
import { handelFiltrer } from "./recherche-filtrer.js";
import { handelFvv, isFav, updateHeart } from "./favoris.js";
import { renderPage } from "./pagination.js";
import "../comments/com.js";

const container = document.getElementById("cards-container");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.querySelector(".close-btn");
let movies = [];
let currentContentId = null;

export async function afficherCards(data, page = 1, perPage = 8) {
    const pagination = document.getElementById("pagination");
    container.innerHTML = "";
    if (!data || data.length === 0) {
        container.innerHTML = `
            <p class="text-red-500 text-center col-span-full">No movies found!</p>
        `;
        pagination.innerHTML = "";
        return;
    }

    const start = (page - 1) * perPage;
    const pageData = data.slice(start, start + perPage);

    pageData.forEach((movie) => {
        const card = document.createElement("div");
        card.className = "relative bg-gray-900 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition duration-300 shadow-lg hover:shadow-red-700";
        card.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}" class="w-full h-64 object-cover">
            <button class="favoris absolute right-2 top-2 rounded-full bg-black/30 p-2 text-white hover:text-red-600" data-id="${movie.id}">
                <i class="fa-regular fa-heart"></i>
            </button>
            <div class="p-3">
                <h3 class="font-bold text-sm">${movie.title}</h3>
                <p class="text-gray-400 text-xs mt-2">
                    ${movie.releaseYear} · ${movie.type}
                </p>
            </div>
        `;
        const fvvBtn = card.querySelector(".favoris");
        updateHeart(fvvBtn.querySelector("i"), isFav(movie));
        fvvBtn.addEventListener("click", (e) => handelFvv(e, movie));
        card.addEventListener("click", () => afficherModal(movie));
        container.appendChild(card);
    });

    renderPage(data, page, perPage);
}

function afficherModal(movie) {
    modal.dataset.contentId = movie.id;
    const genresText = Array.isArray(movie.genres) ? movie.genres.join(", ") : movie.genres || "";
    const directorsText = Array.isArray(movie.directors) ? movie.directors.join(", ") : movie.directors || "";
    const countriesText = Array.isArray(movie.productionCountries)
        ? movie.productionCountries.join(", ")
        : movie.productionCountries || "";

    const isMovie = (movie.type || "").toLowerCase() === "movie" || Boolean(movie.duration);
    const seasonsValue = Array.isArray(movie.seasons) ? movie.seasons.length : movie.seasons;
    const lengthLabel = isMovie ? "Duration :" : "Seasons :";
    const lengthValue = isMovie ? `${movie.duration || 0} minutes` : seasonsValue;

    modalBody.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}" class="w-full h-64 object-cover rounded-lg mb-4">
        <h2 class="text-2xl font-bold mb-2">${movie.title}</h2>
        <p class="text-gray-400 mb-3">${movie.releaseYear} · ${movie.type}</p>
        <p class="mb-3">${movie.description}</p>
        <p class="mb-2"><b>Genres :</b> ${genresText}</p>
        <p class="mb-2"><b>Directors :</b> ${directorsText}</p>
        <p class="mb-2"><b>Countries :</b> ${countriesText}</p>
        <p class="mb-4"><b>${lengthLabel}</b> ${lengthValue}</p>
        <button id="com-btn" class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700">Share your review</button>
    `;
    document.getElementById("com-list").innerHTML = "";
    document.getElementById("modal-wrapper").classList.remove("justify-start");
    document.getElementById("modal-wrapper").classList.add("justify-center");
    document.getElementById("com-panel").classList.add("hidden");
    modal.classList.remove("hidden");
}

closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

async function demarrer() {
    movies = await initialiser();
    afficherCards(movies, 1, 8);
    const movieInput = document.getElementById("movies");
    const statutSelect = document.getElementById("statut");
    if (movieInput) {
        movieInput.addEventListener("input", () => handelFiltrer(movies, afficherCards));
    }
    if (statutSelect) {
        statutSelect.addEventListener("change", () => handelFiltrer(movies, afficherCards));
    }
}
demarrer();