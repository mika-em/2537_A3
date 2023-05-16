const fetchPokemonTypes = async () => {
    try {
        const response = await axios.get("https://pokeapi.co/api/v2/type/");
        return response.data.results;
    } catch (error) {
        console.error("Error fetching Pokémon types:", error);
        return [];
    }
};

const setup = async () => {
    const pokemonTypes = await fetchPokemonTypes();

    // Generate checkbox group for types
    const typeCheckboxes = pokemonTypes.map((type) => {
        return `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="${type.name}" id="${type.name}">
          <label class="form-check-label" for="${type.name}">
            ${type.name}
          </label>
        </div>
      `;
    });

    // Append the checkbox group to a container element
    $("#typeContainer").html(typeCheckboxes.join(""));

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
        // Get the selected Pokémon types
        const selectedTypes = [];
        $("input[type='checkbox']:checked").each(function () {
            selectedTypes.push($(this).val());
        });

        // Filter Pokémon based on selected types
        const filteredPokemons = await Promise.all(
            pokemons.map(async (pokemon) => {
                const pokemonResult = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
                const pokemonTypes = pokemonResult.data.types.map((type) => type.type.name);
                return {
                    ...pokemon,
                    types: pokemonTypes
                };
            })
            );
            
            const filteredAndSelectedPokemons = filteredPokemons.filter((pokemon) =>
            selectedTypes.every((type) => pokemon.types.includes(type))
            );
            
            // Update the displayed count
            const startingIndex = (currentPage - 1) * page_size;
            const endIndex = startingIndex + page_size;
            const displayedPokemons = filteredAndSelectedPokemons.slice(startingIndex, endIndex);

        $("#displayedPokemons").text(displayedPokemons.length);
        $("#totalPokemons").text(filteredAndSelectedPokemons.length);

        $("#main").empty();
        for (let i = 0; i < displayedPokemons.length; i++) {
            const pokemon = displayedPokemons[i];
            console.log(displayedPokemons[i])
            const index = startingIndex + i;
            $("#main").append(`
  <div class="card shadow-lg p-3 mb-5" style="width: 18rem;">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${pokemon.name}</h5>
      <p class="card-text"></p>
      <!-- Button trigger modal -->
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal${pokemon.name}">
        See Details
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
              <p>ID= ${index + 1}</p>
              <p>NAME = ${pokemon.name}</p>
              <p>HEIGHT = ${pokemon.height}</p>
              <p>WEIGHT = ${pokemon.weight}</p>
              <p>TYPE = ${pokemon.types.join(", ")}</p>
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

        }
    };
    const updatePokemonCounts = () => {
        $("#totalPokemons").text($ `{
                    pokemons.length
                }`);
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

    // Function to handle filter changes
    const handleFilterChange = () => {
        currentPage = 1; // Reset to the first page
        updatePaginationButtons();
        updateDisplayedPokemons();
        toggleNextPreviousButtons();
    };

    // Attach event listener to filter checkboxes
    $("input[type='checkbox']").on("change", handleFilterChange);

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