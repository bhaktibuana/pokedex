const pokemonList = (queryParams) => ({
  method: "GET",
  url: "/pokemon",
  queryParams,
});

const pokemonDetail = (param) => ({
  method: "GET",
  url: `/pokemon/${param}`,
});

const pokemonSpecies = (param) => ({
  method: "GET",
  url: `/pokemon-species/${param}`,
});

const pokemonAbilities = (param) => ({
  method: "GET",
  url: `/ability/${param}`,
});

export const pokemonService = {
  pokemonList,
  pokemonDetail,
  pokemonSpecies,
  pokemonAbilities,
};
