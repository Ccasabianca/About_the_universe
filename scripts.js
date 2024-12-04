async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

async function displayCounts() {
    const people = await fetchData('https://swapi.dev/api/people/');
    const planets = await fetchData('https://swapi.dev/api/planets/');
    const starships = await fetchData('https://swapi.dev/api/starships/');

    document.getElementById('people-count').textContent = people.count;
    document.getElementById('planets-count').textContent = planets.count;
    document.getElementById('starships-count').textContent = starships.count;
}

async function displayPlanets() {
    let url = 'https://swapi.dev/api/planets/';
    const tableBody = document.getElementById('planets');

    while (url) {
        const data = await fetchData(url);
        data.results.forEach(planet => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${planet.name}</td>
                <td>${planet.terrain}</td>
            `;
            row.addEventListener('click', () => displayPlanetDetails(planet));
            tableBody.appendChild(row);
        });
        url = data.next; // On passe à la page suivante
    }
}

function displayPlanetDetails(planet) {
    const cardPlanetes = document.getElementById('details-planetes');

    cardPlanetes.innerHTML = '<div>' +
        '<span class="planetes-card-title blue">' + planet.name + '</span><br>' +
        '<span class="blue italic">Population: ' + '<span class="white">' + planet.population +'</span>' + '</span><br>' +
        '</div>' +
        '<div class="planetes-card-container">' +
        '<div class="planetes-card">' + '<i class="fa-regular fa-circle fa-2xl blue"></i>' + '<div class="card-text">' + '<span class="blue">' + 'Diamètre' + '</span>' + planet.diameter + '</div>' + '</div>' +
        '<div class="planetes-card">' + '<i class="fa-solid fa-temperature-full fa-2xl blue"></i>' + '<div class="blue top">' + 'Climat' + '</div>' + planet.climate + '</div>' +
        '<div class="planetes-card">' + '<i class="fa-solid fa-magnet fa-2xl blue"></i>' + '<div class="blue top">' + 'Gravité' + '</div>' + '<span class="italic">' + planet.gravity +'</span>'+ '</div>' +
        '<div class="planetes-card">' + '<i class="fa-solid fa-tree fa-2xl blue"></i>' + '<div class="blue top">' + 'Terrain' + '</div>' + '<span class="italic">' + planet.terrain +'</span>'+ '</div>' +
        '<div class="btn-row">' + '<a href="#" class="btn">En savoir plus</a>' + '</div>' +
        '</div>';
}
document.addEventListener("DOMContentLoaded", () => {
    displayCounts();
    displayPlanets();
});
