const setup = async () => {
    const result = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810");

    const pokemons = result.data.results;
    const page_size = 10;
    const buttons = Math.ceil(pokemons.length / page_size);

    let currentPage = 1;

    const updatePaginationButtons = () => {
        $("#paginationControls").empty();

        const startIndex = Math.max(currentPage - 1, 1);
        const endIndex = Math.min(startIndex + 4, buttons);

        for (let i = startIndex; i <= endIndex; i++) {
            const buttonClass = i === currentPage ? "btn-primary active" : "btn-primary";
            $("#paginationControls").append(
                `<button type="button" class="btn ${buttonClass}">${i}</button>`
            );
        }
    };


    const updateDisplayedPokemons = async () => {
        $("#main").empty();

        const startingIndex = (currentPage - 1) * page_size;
        const endIndex = startingIndex + page_size;
        const sliced_pokemons = pokemons.slice(startingIndex, endIndex);

        for (let i = 0; i < sliced_pokemons.length; i++) {
            const pokemon = sliced_pokemons[i];
            const index = startingIndex + i;
            const pokemonResult = await axios.get(
                `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
            );
            $("#main").append(`
                <div class="card shadow-lg p-3 mb-5" style="width: 18rem;">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png" class="card-img-top" alt="...">
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
            `);
            $("#displayedPokemons").text(`${startingIndex + i + 1}`);
        }
    };

    const updatePokemonCounts = () => {
        $("#totalPokemons").text(`${pokemons.length}`);
    };

    const toggleNextPreviousButtons = () => {
        const previousButton = $("#previousButton");
        const nextButton = $("#nextButton");

        if (currentPage === 1) {
            previousButton.hide();
        } else {
            previousButton.show();
        }

        if (currentPage === buttons) {
            nextButton.hide();
        } else {
            nextButton.show();
        }
    };


    const goToNextPage = () => {
        if (currentPage < buttons) {
            currentPage++;
            updatePaginationButtons();
            updateDisplayedPokemons();
        }
        toggleNextPreviousButtons();
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            currentPage--;
            updatePaginationButtons();
            updateDisplayedPokemons();
        }
        toggleNextPreviousButtons();
    };

    $("#paginationControls").on("click", "button", function () {
        currentPage = parseInt($(this).text());
        updatePaginationButtons();
        updateDisplayedPokemons();
        toggleNextPreviousButtons();
    });

    $("#nextButton").on("click", goToNextPage);
    $("#previousButton").on("click", goToPreviousPage);

    updatePaginationButtons();
    updateDisplayedPokemons();
    toggleNextPreviousButtons();
    updatePokemonCounts();
};

$(document).ready(setup);