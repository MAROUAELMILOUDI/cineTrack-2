export function handelFiltrer(movies, afficherCards) {
    const searchMovies = document.getElementById("movies");
    const statutSelector = document.getElementById("statut");
    const query = searchMovies.value.toLowerCase().trim();
    const statut = statutSelector.value;

    const filtreMovies = movies.filter((film) => {
        const matchMovies = (film.title || "").toLowerCase().includes(query);
        const filmType = (film.type || "").toLowerCase();

        let matchStatut = false;
        if (statut === "all") {
            matchStatut = true;
        }
        if (statut === "movies") {
            matchStatut = filmType === "movie" || filmType === "movies";
        }
        if (statut === "series") {
            matchStatut = filmType === "series" || filmType === "serie";
        }

        return matchStatut && matchMovies;
    });

    afficherCards(filtreMovies);
}