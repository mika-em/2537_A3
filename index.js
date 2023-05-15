const setup = async () => {

    console.log("setup");
    const result = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810")
    console.log(result.data.results);

    // const pokemons = result.data.results;

    //slice me the first 3 pokemons
    const pokemons = result.data.results.slice(0, 10);

    for (let i = 0; i < pokemons.length; i++) {
        // pokemons.forEach(async (pokemon, index) => {
        pokemon = pokemons[i]
        index = i
        const pokemonResult = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        $("#main").append(`
        <div class="card shadow-lg p-3 mb-5" style="width: 18rem;">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png" class="card-img-top"
        alt="...">
        <div class="card-body">
        <h5 class="card-title">${pokemon.name}</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal${pokemon.name}">
            Launch demo modal
        </button>

        <!-- Modal -->
        <div class="modal fade" id="exampleModal${pokemon.name}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">${pokemon.name}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    ${pokemonResult.data.id}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>






        </div>
    </div>
    `)
    }
    
}


$(document).ready(setup);