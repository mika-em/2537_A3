const setup = async () => {

    console.log("setup");
    const result = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810")
    console.log(result.data.results);

    const pokemons = result.data.results;

    pokemons.forEach((pokemon, index) => {
        $("#main").append(`
        <div class="card shadow-lg p-3 mb-5" style="width: 18rem;">
        <div class="card-body">
        <h5 class="card-title">${pokemon.name}</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
    </div>
    `)
    })
}


$(document).ready(setup);