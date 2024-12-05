async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

// Affiche la quantité des 3 trucs demandés sur la page d'accueil
async function displayCounts() {
    const people = await fetchData('https://swapi.dev/api/people/');
    const planets = await fetchData('https://swapi.dev/api/planets/');
    const starships = await fetchData('https://swapi.dev/api/starships/');

    document.getElementById('people-count').textContent = people.count;
    document.getElementById('planets-count').textContent = planets.count;
    document.getElementById('starships-count').textContent = starships.count;
}
displayCounts();

// Fetch les infos des planètes
async function getPlanets() {
    let url = 'https://swapi.dev/api/planets/';
    const allPlanets = [];

    while (url) {
        const data = await fetchData(url);
        allPlanets.push(...data.results);
        url = data.next; // On passe à la page suivante
    }

    // Affiche les planètes et configure le filtre + la barre de recherche
    renderPlanets(allPlanets);
    setupFilters(allPlanets);
    setupSearch(allPlanets);
}
getPlanets();

// Filtre select
function setupFilters(allPlanets) {
    document.getElementById('population-filter').addEventListener('change', (event) => {
        const selectedFilter = event.target.value;

        let filteredPlanets = allPlanets;

        if (selectedFilter === '0-100') {
            filteredPlanets = allPlanets.filter(planet => {
                const population = parseInt(planet.population, 10);
                return !isNaN(population) && population >= 0 && population <= 100000;
            });
        } else if (selectedFilter === '100-100M') {
            filteredPlanets = allPlanets.filter(planet => {
                const population = parseInt(planet.population, 10);
                return !isNaN(population) && population > 100000 && population <= 100000000;
            });
        } else if (selectedFilter === '100M+') {
            filteredPlanets = allPlanets.filter(planet => {
                const population = parseInt(planet.population, 10);
                return !isNaN(population) && population > 100000000;
            });
        } 
        // Ajouté l'option des planètes avec "unknown" comme population en bonus
        else if(selectedFilter === 'unknown') {
            filteredPlanets = allPlanets.filter(planet => {
                const population = planet.population;
                return (population) && population === "unknown";
            });
        }
            else {
            filteredPlanets = allPlanets;
        }

        // Met à jour le compteur de planètes sous le tableau
        updatePlanetCount(filteredPlanets.length);

        // Change les planètes affichées en fonction du filtre
        renderPlanets(filteredPlanets);
    });
}

// Barre de recherche
function setupSearch(allPlanets) {
    const searchBar = document.getElementById('search-bar-planetes');

    searchBar.addEventListener('input', (event) => {
        const searchText = event.target.value.toLowerCase();

        const filteredPlanets = allPlanets.filter(planet => 
            planet.name.toLowerCase().includes(searchText)
        );

        // Change les planètes affichées en fonction de la barre de recherche
        renderPlanets(filteredPlanets);
        updatePlanetCount(filteredPlanets.length);
    });
}

// Compteur de planètes sous le tableau
function updatePlanetCount(count) {
    const countElement = document.getElementById('after-filter-count');
    countElement.textContent = count + " résultat(s)";
}

// Affiche les planètes dans le tableau et affiche le compteur de planètes par défaut
function renderPlanets(planets) {
    const tableBody = document.getElementById('planets');
    tableBody.innerHTML = '';

    planets.forEach(planet => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${planet.name}</td>
            <td>${planet.terrain}</td>
        `;
        row.addEventListener('click', () => displayPlanetDetails(planet));
        tableBody.appendChild(row);
    });
    updatePlanetCount(planets.length);
}

// Affiche les infos de la planète selectionnée dans la section de droite
function displayPlanetDetails(planet) {
    const cardPlanetes = document.getElementById('details-planetes');

    cardPlanetes.innerHTML = '<div>' +
        '<span class="planetes-card-title blue">' + planet.name + '</span><br>' +
        '<span class="blue italic">Population: ' + '<span class="white">' + planet.population + '</span>' + '</span><br>' +
        '</div>' +
        '<div class="planetes-card-container">' +
        '<div class="planetes-card">' + '<i class="fa-regular fa-circle fa-2xl blue"></i>' + '<div class="card-text">' + '<span class="blue">' + 'Diamètre' + '</span>' + planet.diameter + '</div>' + '</div>' +
        '<div class="planetes-card">' + '<i class="fa-solid fa-temperature-full fa-2xl blue"></i>' + '<div class="blue top">' + 'Climat' + '</div>' + planet.climate + '</div>' +
        '<div class="planetes-card">' + '<i class="fa-solid fa-magnet fa-2xl blue"></i>' + '<div class="blue top">' + 'Gravité' + '</div>' + '<span class="italic">' + planet.gravity + '</span>' + '</div>' +
        '<div class="planetes-card">' + '<i class="fa-solid fa-tree fa-2xl blue"></i>' + '<div class="blue top">' + 'Terrain' + '</div>' + '<span class="italic">' + planet.terrain + '</span>' + '</div>' +
        '<div class="btn-row">' + '<a href="#" class="btn">En savoir plus</a>' + '</div>' +
        '</div>';
}