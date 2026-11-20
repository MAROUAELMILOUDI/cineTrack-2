const API_URL = "https://6afca705892984c4494bd59c.mockapi.io/api/v1/contents";
async function chargeData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Link introuvable!");
        }
        const movies = await response.json();
        localStorage.setItem("movies", JSON.stringify(movies));
        return movies;
    } catch (error) {
        console.error(error.message);
        return [];
    }
}

async function initialiser() {
    const data = await chargeData();
    if (data.length > 0) {
        return data;
    }
    const donnees = localStorage.getItem("movies");
    if (donnees) {
        try {
            return JSON.parse(donnees);
        } catch (error) {
            console.error("Corrupt local storage data");
        }
    }
    return [];
}
export { initialiser }