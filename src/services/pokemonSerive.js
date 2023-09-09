const pokemonList = (queryParams) => ({
  method: "GET",
  url: "/pokemon",
  queryParams,
});

const pokemonDetail = (param) => ({
  method: "GET",
  url: `/pokemon/${param}`,
});

export const pokemonService = {
  pokemonList,
  pokemonDetail,
};
