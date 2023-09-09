<template>
  <div class="search-bar">
    <div class="search-container" :class="{ active: isFocus }">
      <div class="search-icon">
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" size="1x" />
      </div>

      <input
        class="search-input"
        type="text"
        placeholder="Search Pokémon"
        @focus="isFocus = true"
        @blur="handleSearchBlur"
        v-model="searchStr"
        @input="handleInputChange"
      />
    </div>

    <div
      class="search-info"
      :class="{ active: showInfo }"
      @click="clearBlurTimeout"
    >
      <div v-if="isSearchLoading" class="poke-spinner">
        <img
          v-lazy="require('@/assets/images/pokeball-50x50.webp')"
          alt="pokeball"
          className="pokeball"
        />
        <div className="pokebal-shadow"></div>
        <p>Searching pokemon...</p>
      </div>

      <div v-else class="search-card-container">
        <span v-if="searchData.length === 0" class="search-info-text">
          Pokemon not found
        </span>

        <div
          v-else
          v-for="(item, index) in searchData"
          :key="index"
          class="search-card"
          @click="handleClickItem(item.name)"
        >
          <div
            class="image-container"
            :style="{ backgroundColor: typeColor[item.types[0].type.name] }"
          >
            <img
              v-lazy="require('@/assets/images/poke-vector.webp')"
              alt="pokeballBg"
              class="pokeball-bg"
            />

            <img
              v-lazy="
                item.sprites.other['official-artwork']['front_default']
                  ? item.sprites.other['official-artwork']['front_default']
                  : require('@/assets/images/pokeball-50x50.webp')
              "
              :alt="item.name"
              class="pokemon-avatar"
            />
          </div>

          <div class="pokemon-name-container">
            <p class="pokemon-name">{{ parsePokeName(item.name) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useAxios } from "@/composables";
import { pokemonService } from "@/services";
import { parseSearchStr, parsePokeName } from "@/utils";
import { typeColor } from "@/constants";

export default {
  name: "SearchBar",
  setup(props, { emit }) {
    const isFocus = ref(false);
    const showInfo = ref(false);
    const searchStr = ref("");
    const searchStrLength = computed(() => searchStr.value.length);
    const isSearchLoading = ref(false);
    const searchData = ref([]);
    let blurTimeout;
    let typingDelay;

    const handleClickItem = (pokemonName) => {
      emit("setShowDetail", true);
      emit("setSelectedDetail", pokemonName);
    };

    const handleInputChange = (event) => {
      searchStr.value = event.target.value;
    };

    const handleSearchBlur = () => {
      blurTimeout = setTimeout(() => {
        isFocus.value = false;
        searchStr.value = "";
      }, 200);
    };

    const clearBlurTimeout = () => {
      clearTimeout(blurTimeout);
    };

    const getPokemonData = async (searchName) => {
      isSearchLoading.value = true;

      const countPokemon = useAxios();
      const getAllPokemon = useAxios();
      const getPokemonDetail = useAxios();
      let tempPokemonList = [];
      const pokemonList = [];

      // count total pokemons
      await countPokemon.axiosFetch(
        pokemonService.pokemonList({ offset: 0, limit: 1 })
      );

      // if counting data success, get all data
      if (countPokemon.isSuccess) {
        await getAllPokemon.axiosFetch(
          pokemonService.pokemonList({
            offset: 0,
            limit: countPokemon.response.value.count,
          })
        );
      }

      // if get all data success, filter the data with seach parameter
      if (getAllPokemon.isSuccess) {
        tempPokemonList = getAllPokemon.response.value.results.filter((item) =>
          item.name.includes(parseSearchStr(searchName))
        );
      }

      if (
        tempPokemonList.length > 0 &&
        parseSearchStr(searchName).length >= 3
      ) {
        for (let i = 0; i < tempPokemonList.length; i++) {
          await getPokemonDetail.axiosFetch(
            pokemonService.pokemonDetail(tempPokemonList[i].name)
          );

          if (getPokemonDetail.isError.value) continue;
          pokemonList.push({
            name: getPokemonDetail.response.value.name,
            sprites: getPokemonDetail.response.value.sprites,
            types: getPokemonDetail.response.value.types,
          });
        }
      }

      searchData.value = pokemonList;
      isSearchLoading.value = false;
    };

    watch([isFocus, searchStrLength], ([isFocusVal, searchStrLengthVal]) => {
      if (isFocusVal && searchStrLengthVal > 0) {
        showInfo.value = true;
      } else if (!isFocusVal) {
        showInfo.value = false;
      } else {
        showInfo.value = false;
      }
    });

    watch(searchStr, (searchStrVal) => {
      isSearchLoading.value = true;
      if (searchStrVal.length === 0) {
        isSearchLoading.value = false;
        return;
      }
      if (typingDelay) {
        clearTimeout(typingDelay);
      }
      typingDelay = setTimeout(() => {
        getPokemonData(searchStrVal);
      }, 500);
    });

    return {
      isFocus,
      showInfo,
      searchStr,
      handleInputChange,
      isSearchLoading,
      searchData,
      handleSearchBlur,
      clearBlurTimeout,
      parsePokeName,
      typeColor,
      handleClickItem,
    };
  },
};
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  width: calc(100% - 340px);
  height: 44px;
  border-radius: 10px;
  margin: 0 0 12px 0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: transparent;
  z-index: 1;

  @media screen and (max-width: 1280px) {
    width: calc(100% - 240px);
  }

  @media screen and (max-width: 1024px) {
    width: calc(100% - 240px);
  }

  @media screen and (max-width: 768px) {
    width: calc(100% - 140px);
  }

  @media screen and (max-width: 425px) {
    width: calc(100% - 40px);
  }
}

.search-container {
  display: flex;
  width: 100%;
  height: 44px;
  border-radius: 10px;
  border: 1px solid var(--BG_COLOR_2);
  background: linear-gradient(
    112.83deg,
    rgba(247, 249, 249, 0.82),
    rgba(247, 249, 249, 0.8) 110.84%
  );
  backdrop-filter: blur(21px);
  -webkit-backdrop-filter: blur(21px);
  transition: all 0.2s ease-in-out;

  & > .search-icon {
    display: flex;
    width: 42px;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    padding-left: 12px;
    border-radius: 2rem 0 0 2rem;
    color: var(--TEXT_COLOR_1);
    transition: all 0.2s ease-in-out;
  }

  & > input.search-input {
    width: calc(100% - 42px);
    height: 100%;
    border: none;
    outline: none;
    padding: 12px;
    border-radius: 0 2rem 2rem 0;
    background: transparent;
    color: var(--TEXT_COLOR_0);
    font-size: 1.1rem;

    &::placeholder {
      color: var(--TEXT_COLOR_1);
    }
  }

  &.active {
    border: 1.5px solid var(--PRIMARY_COLOR);
    background: var(--BG_COLOR_0);

    & > .search-icon {
      color: var(--PRIMARY_COLOR);
    }
  }
}

.search-info {
  display: none;
  position: absolute;
  width: calc(100% - 340px);
  height: auto;
  flex-direction: column;
  background: var(--BG_COLOR_0);
  top: 200px;
  border-radius: 8px;
  box-shadow: rgb(101 119 134 / 20%) 0px 0px 15px,
    rgb(101 119 134 / 15%) 0px 0px 3px 1px;

  &.active {
    display: flex;
  }

  @media screen and (max-width: 1280px) {
    width: calc(100% - 240px);
  }

  @media screen and (max-width: 1024px) {
    width: calc(100% - 240px);
  }

  @media screen and (max-width: 768px) {
    width: calc(100% - 140px);
  }

  @media screen and (max-width: 425px) {
    width: calc(100% - 40px);
  }
}

.poke-spinner {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

  & > img.pokeball {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    animation-name: pokeball-bounce;
    animation-duration: 0.7s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    @keyframes pokeball-bounce {
      0% {
        transform: translateY(0px);
      }

      50% {
        transform: translateY(-10px);
      }

      100% {
        transform: translateY(0px);
      }
    }
  }

  & > .pokebal-shadow {
    width: 50px;
    height: 5px;
    border-radius: 50%;
    margin-top: 10px;
    background-color: var(--BG_COLOR_GREY);
    opacity: 0.5;
    animation-name: pokeball-shadow;
    animation-duration: 0.7s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-fill-mode: both;

    @keyframes pokeball-shadow {
      0% {
        transform: scaleX(1);
      }

      50% {
        transform: scaleX(0.5);
      }

      100% {
        transform: scaleX(1);
      }
    }
  }

  & > p {
    font-size: 1rem;
    margin-top: 15px;
    color: var(--TEXT_COLOR_1);
  }
}

.search-card-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  padding: 8px;
  gap: 5px;
  max-height: 50vh;
  overflow: auto;
}

span.search-info-text {
  display: flex;
  width: 100%;
  height: 52px;
  justify-content: center;
  align-items: center;
  padding: 12px;
  color: var(--TEXT_COLOR_1);
}

.search-card {
  display: flex;
  width: 100%;
  height: 50px;
  border-radius: 8px;
  gap: 15px;
  cursor: pointer;

  & > .image-container {
    width: 80px;
    height: 50px;
    background-color: var(--BG_COLOR_GREY);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: all ease 0.15s;

    & > img.pokeball-bg {
      height: 40px;
      filter: opacity(15%);
      position: absolute;
    }

    & > img.pokemon-avatar {
      height: 40px;
      filter: grayscale(50%);
      transition: all ease 0.15s;
    }
  }

  & > .pokemon-name-container {
    width: auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    & > p.pokemon-name {
      font-size: 1rem;
      font-weight: normal;
      transition: all ease 0.15s;
    }
  }

  &:hover > .image-container {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:hover > .image-container > img.pokemon-avatar {
    filter: grayscale(0%);
    transform: scale(1.4);
  }

  &:hover > .pokemon-name-container > p.pokemon-name {
    font-weight: bold;
  }
}
</style>
