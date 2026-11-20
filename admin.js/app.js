const API_URL = 'https://6afca705892984c4494bd59c.mockapi.io/api/v1/contents';

const tbody = document.querySelector('#moviesTable tbody');
const table = document.querySelector('#table');
const form = document.querySelector('#movieForm');
const titleInput = document.querySelector('#title');
const typeInput = document.querySelector('#type');
const yearInput = document.querySelector('#year');
const durationInput = document.querySelector('#duration');
const seasonsInput = document.querySelector('#seasons');
const posterInput = document.querySelector('#poster');
const descriptionInput = document.querySelector('#description');
const durationWrapper = document.querySelector('#durationWrapper');
const seasonsWrapper = document.querySelector('#seasonsWrapper');
const submitBtn = document.querySelector('#submitBtn');
const message = document.querySelector('#message');
const genresInput = document.querySelector('#genres');
const directorsInput = document.querySelector('#directors');
const countriesInput = document.querySelector('#countries');


let editId = null;

// movie = duration, series = seasons
function showFields() {
  if (typeInput.value === 'Series') {
    durationWrapper.classList.add('hidden');
    seasonsWrapper.classList.remove('hidden');
    durationInput.required = false;
    seasonsInput.required = true;
  } else {
    seasonsWrapper.classList.add('hidden');
    durationWrapper.classList.remove('hidden');
    seasonsInput.required = false;
    durationInput.required = true;
  }
}
typeInput.addEventListener('change', showFields);

// GET: fetch dyal data
async function loadMovies() {
  message.textContent = 'loading...';
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const movies = await res.json();
    tbody.innerHTML = '';
    for (const movie of movies) {
      const tr = document.createElement('tr');
      tr.dataset.id = movie.id;
      for (const value of [movie.title, movie.type]) {
        const td = document.createElement('td');
        td.className = 'px-4 py-3';
        td.textContent = value;
        tr.appendChild(td);
      }
      const actions = document.createElement('td');
      actions.className = 'px-4 py-3 text-right';
      actions.innerHTML = `
        <button class="edit bg-slate-600 px-3 py-1 rounded text-xs">Edit</button>
        <button class="delete bg-red-600 px-3 py-1 rounded text-xs">Delete</button>
      `;
      tr.appendChild(actions);
      tbody.appendChild(tr);
    }
    if (movies.length > 0) {
      table.classList.remove('hidden');
    }
    message.textContent = '';
  } catch (err) {
    message.textContent = 'Cannot load movies: ' + err.message;
  }
}
loadMovies();

// POST / PUT: modification o suppression dyal chi movie/serie
async function saveMovie(e) {
  e.preventDefault();
  const movie = {
    title: titleInput.value.trim(),
    type: typeInput.value,
    releaseYear: Number(yearInput.value),
    duration: Number(durationInput.value),
    seasons: [seasonsInput.value],
    image: posterInput.value,
    description: descriptionInput.value,
    genres: [genresInput.value],
    directors: [directorsInput.value],
    productionCountries: [countriesInput.value]
  };
  const url = editId ? `${API_URL}/${editId}` : API_URL;
  const method = editId ? 'PUT' : 'POST';
  const successText = editId ? 'movie updated' : 'movie added';

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie)
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    form.reset();
    showFields();
    editId = null;
    submitBtn.textContent = 'Add title';
    await loadMovies();
    message.textContent = successText;
  } catch (err) {
    message.textContent = 'Failed to save: ' + err.message;
  }
}
form.addEventListener('submit', saveMovie);

// Edit / Delete: delegation
tbody.addEventListener('click', async (e) => {
  const tr = e.target.closest('tr');
  if (!tr) return;
  const id = tr.dataset.id;

  if (e.target.classList.contains('edit')) {
    const res = await fetch(`${API_URL}/${id}`);
    const movie = await res.json();
    titleInput.value = movie.title;
    typeInput.value = movie.type;
    yearInput.value = movie.releaseYear;
    durationInput.value = movie.duration;
    seasonsInput.value = movie.seasons;
    posterInput.value = movie.image;
    descriptionInput.value = movie.description;
    genresInput.value = movie.genres;
    directorsInput.value = movie.directors;
    countriesInput.value = movie.productionCountries;
    showFields();
    editId = id;
    submitBtn.textContent = 'Save';
    titleInput.focus();
  }

  if (e.target.classList.contains('delete')) {
    if (!confirm('Delete this movie?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      if (id === editId) {
        editId = null;
        form.reset();
        showFields();
        submitBtn.textContent = 'Add title';
      }
      await loadMovies();
      message.textContent = 'movie deleted';
    } catch (err) {
      message.textContent = 'Failed to delete: ' + err.message;
    }
  }
});