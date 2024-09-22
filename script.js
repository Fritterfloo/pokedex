const pokemonGrid = document.getElementById('pokemonGrid');
const searchBar = document.getElementById('searchBar');
const filterType = document.getElementById('filterType');
const filterGeneration = document.getElementById('filterGeneration');
let pokemonList = [];

// Fetch Pokémon data
async function fetchPokemonData() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151'); // Adjust for more Pokémon
    const data = await response.json();
    return data.results;
}

// Create Pokémon card dynamically
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemonCard');
    
    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
    img.alt = pokemon.name;
    
    const name = document.createElement('h2');
    name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    
    const number = document.createElement('p');
    number.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
    
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(number);
    card.addEventListener('click', () => showPokemonDetails(pokemon.id)); // Show details on click
    
    pokemonGrid.appendChild(card);
}

// Fetch individual Pokémon data
async function fetchPokemonDetails(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return await response.json();
}

// Show Pokémon details in modal
async function showPokemonDetails(id) {
    const modal = document.getElementById('pokemonModal');
    const pokemonDetailsDiv = document.getElementById('pokemonDetails');
    
    const data = await fetchPokemonDetails(id);
    pokemonDetailsDiv.innerHTML = `
        <h2>${data.name.toUpperCase()}</h2>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png">
        <p><strong>Height:</strong> ${data.height}</p>
        <p><strong>Weight:</strong> ${data.weight}</p>
        <p><strong>Types:</strong> ${data.types.map(type => type.type.name).join(', ')}</p>
        <p><strong>Abilities:</strong> ${data.abilities.map(ability => ability.ability.name).join(', ')}</p>
    `;
    
    modal.style.display = 'block'; // Show the modal
}

// Close modal functionality
const modal = document.getElementById('pokemonModal');
const span = document.getElementsByClassName('close')[0];
span.onclick = () => {
    modal.style.display = 'none';
};

// Handle search and filtering
function handleSearch() {
    const query = searchBar.value.toLowerCase();
    const filteredPokemon = pokemonList.filter(p => p.name.includes(query));
    displayPokemon(filteredPokemon);
}

searchBar.addEventListener('input', handleSearch);

// Filter by type or generation
filterType.addEventListener('change', handleSearch);
filterGeneration.addEventListener('change', handleSearch);

// Display Pokémon cards on the page
async function displayPokemon(pokemonList) {
    pokemonGrid.innerHTML = ''; // Clear the grid
    for (const pokemon of pokemonList) {
        const data = await fetchPokemonDetails(pokemon.url);
        createPokemonCard({ id: data.id, name: pokemon.name });
    }
}

// Initialize with data
fetchPokemonData().then(data => {
    pokemonList = data;
    displayPokemon(pokemonList);
});

// Capture Pokémon image and identify
const captureButton = document.getElementById('captureButton');
const video = document.getElementById('cameraStream');
const canvas = document.getElementById('captureCanvas');

// Start the camera stream
function startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            });
    }
}

// Capture Pokémon image
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    const capturedImage = canvas.toDataURL('image/png');
    identifyPokemonFromImage(capturedImage); // Function to identify the Pokémon
});

// Simulated Pokémon identification from captured image
function identifyPokemonFromImage(imageData) {
    alert("Image captured! Recognizing Pokémon...");
    
    // Simulating the identification of Pikachu
    showPokemonDetails(25); // Pikachu's ID
}

// Start the camera stream on page load
startCamera();
