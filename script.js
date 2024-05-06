const URL = 'https://pokeapi.co/api/v2/pokemon/';
const searchInput = document.getElementById('search');
const pokedexContainer = document.getElementById('pokecontainer');
const pokeTeams = document.getElementById('poketeams');
let pokemonArray = [];
const pokemonTeams = [];

function showError(message) {
    pokedexContainer.innerHTML = `<p class="error">${message}</p>`;
}

async function obtenerPokemon(pokemonName){
    try{
        const response = await fetch(URL + pokemonName.toLowerCase());
        if(!response.ok){
            showError(`No se encontró ningún Pokémon llamado "${pokemonName}"`);
            return;
        }
        return response.json();

    } catch(error){
        showError('Ha ocurrido un error al buscar el Pokémon');
        console.error(error);
    }
}

async function showPokemonFromArray() {
    try {
        pokedexContainer.innerHTML = '';

        const equipoOrdenado = orderTeamByExperience(pokemonArray);

        for (const pokemon of equipoOrdenado) {
            const types = pokemon.types.map(type => type.type.name).join(', ');
            const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', ');

            const pokemonDiv = document.createElement('div');
            pokemonDiv.classList.add('col');
            pokemonDiv.innerHTML = 
            `
                <div>
                    <h5>${pokemon.name.toUpperCase()}</h5>
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                    <h5>Número: ${pokemon.id}</h5>
                    <h5>Tipo: ${types}</h5>
                    <h5>Habilidades: ${abilities}</h5>
                    <h5>Experiencia Base: ${pokemon.base_experience}</h5>
                </div>
            `;

            pokedexContainer.appendChild(pokemonDiv);
        }
    } catch (error) {
        showError('Ha ocurrido un error al buscar los Pokémon');
        console.error(error);
    }
}

function displayTeams(){
    pokeTeams.innerHTML = '';
    pokemonTeams.map((pokemonArray) => {
        pokemonArray.map((pokemon) => {
            const pokemonDiv = document.createElement('div');
            pokemonDiv.classList.add('col');
            pokemonDiv.innerHTML = 
            `
                <div>
                    <h5>${pokemon.name.toUpperCase()}</h5>
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                    <h5>Número: ${pokemon.id}</h5>
                    <h5>Tipo: ${pokemon.types[0].type.name}</h5>
                    <h5>Habilidades: ${pokemon.abilities[0].ability.name}</h5>
                    <h5>Experiencia Base: ${pokemon.base_experience}</h5>
                </div>
            `;

            pokeTeams.appendChild(pokemonDiv);
        });
    });
}

function addPokemonToArray(pokemonName) {
    pokemonArray.push(pokemonName);
}

function orderTeamByExperience(team) {
    return team.sort((a, b) => a.base_experience - b.base_experience);
}

document.getElementById('addBtn').addEventListener('click', async function() {
    const searchedPokemon = searchInput.value.trim();
    if (searchedPokemon === '') {
        showError('Por favor, ingresa un nombre de Pokémon.');
        return;
    }
    const pokemon = await obtenerPokemon(searchedPokemon);

    if(pokemon){
        addPokemonToArray(pokemon);
        showError(`Se ha añadido a ${searchedPokemon} a tu equipo`);
        console.log(pokemon);
    }

    if (pokemonArray.length >= 3) {
        document.getElementById("addBtn").disabled = true;
        searchInput.disabled = true;
      }

});

document.getElementById('showBtn').addEventListener('click', function() {
    if (pokemonArray.length === 0) {
        showError('Por favor, ingresa al menos un Pokémon.');
        return;
    }
    showPokemonFromArray();
    pokemonTeams.push(pokemonArray);
    document.getElementById("showBtn").disabled = true;
});

document.getElementById('resetBtn').addEventListener('click',function(){
    if(pokemonArray.length === 0){
        showError("No hay ningun pokemon en tu equipo")
        return;
    } else {
        pokemonArray = [];
        showError("Se ha limpiado tu equipo")
        searchInput.value = '';
    }
    document.getElementById("showBtn").disabled = false;
    document.getElementById("addBtn").disabled = false;
    searchInput.disabled = false;
});

document.getElementById('showTeamsBtn').addEventListener('click',function(){
    displayTeams();
});
