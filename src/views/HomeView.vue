<template>
  <HomeBg>
    <div class="home-view">
      <div class="home-header" :style="headerStyle">
        <div class="logo-container">
          <img
            v-lazy="require('@/assets/images/pokemon-300.webp')"
            alt="appLogo"
            class="app-logo"
          />
        </div>

        <SearchBar
          @setShowDetail="handleShowDetail"
          @setSelectedDetail="handleSelectedDetail"
        />
      </div>

      <div class="home-body">
        <div class="pokemon-list">
          <PokeCard
            v-for="(item, index) in pokemonList"
            :key="index"
            :pokemonData="item"
            @setShowDetail="handleShowDetail"
            @setSelectedDetail="handleSelectedDetail"
          />
        </div>

        <div v-if="isListLoading" class="poke-spinner">
          <img
            v-lazy="require('@/assets/images/pokeball-50x50.webp')"
            alt="pokeball"
            className="pokeball"
          />
          <div className="pokebal-shadow"></div>
        </div>

        <div ref="scrollTrigger"></div>
      </div>

      <DetailModal
        :isOpen="showDetail"
        :pokeName="selectedDetail"
        @setIsOpen="handleShowDetail"
      />
    </div>
  </HomeBg>
</template>

<script>
import { onBeforeMount, onMounted, onUnmounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { PokeCard, SearchBar, DetailModal, HomeBg } from "@/components";
import { useAxios } from "@/composables";
import { pokemonService } from "@/services";

export default {
  name: "Home",
  components: {
    PokeCard,
    SearchBar,
    DetailModal,
    HomeBg,
  },
  setup() {
    const pokemonList = ref([]);
    const isListLoading = ref(false);
    const offsetState = ref(0);
    const limitState = ref(0);
    const scrollTrigger = ref(null);
    const scrollY = ref(window.scrollY);
    const showDetail = ref(false);
    const selectedDetail = ref("");
    const headerStyle = ref({});

    const store = useStore();
    let observer;

    const handleShowDetail = (value) => {
      showDetail.value = value;
    };

    const handleSelectedDetail = (value) => {
      selectedDetail.value = value;
    };

    const getPokemonData = async (offset, limit) => {
      isListLoading.value = true;

      const getPokemonList = useAxios();
      const getPokemonDetail = useAxios();
      const currentPokemonList = [];

      // get pokemon list
      await getPokemonList.axiosFetch(
        pokemonService.pokemonList({ offset, limit })
      );

      // get every detail of pokemons based on the list
      if (getPokemonList.response.value.results.length > 0) {
        for (let i = 0; i < getPokemonList.response.value.results.length; i++) {
          await getPokemonDetail.axiosFetch(
            pokemonService.pokemonDetail(
              getPokemonList.response.value.results[i].name
            )
          );

          if (getPokemonDetail.isError.value) continue;
          currentPokemonList.push({
            id: getPokemonDetail.response.value.id,
            name: getPokemonDetail.response.value.name,
            sprites: getPokemonDetail.response.value.sprites,
            types: getPokemonDetail.response.value.types,
          });
        }

        // update the offsate state for the next query
        offsetState.value = offsetState.value + limitState.value;
      }

      pokemonList.value = [...pokemonList.value, ...currentPokemonList];
      isListLoading.value = false;
    };

    const handleIntersection = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isListLoading.value) {
        getPokemonData(offsetState.value, limitState.value);
      }
    };

    const handleScroll = () => {
      scrollY.value = window.scrollY;
    };

    watch(scrollY, (val) => {
      if (val >= 130) {
        headerStyle.value = {
          top: "-130px",
          position: "fixed",
          background:
            "linear-gradient(112.83deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.8) 110.84%)",
          "backdrop-filter": "blur(21px)",
          "-webkit-backdrop-filter": "blur(21px)",
        };
      } else {
        headerStyle.value = {
          top: "0",
          position: "absolute",
        };
      }
    });

    onBeforeMount(() => {
      switch (true) {
        case window.screen.width <= 425:
          limitState.value = 10;
          break;
        case window.screen.width <= 1024:
          limitState.value = 20;
          break;
        case window.screen.width <= 1280:
          limitState.value = 30;
          break;
        default:
          limitState.value = 40;
          break;
      }
      store.commit("setAppTitle", "");
    });

    onMounted(() => {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      };

      // use IntersectionObserver of JavaScript API to observe every change on the doc viewport
      // this code is to create unlimitied scroll list
      observer = new IntersectionObserver(handleIntersection, options);
      observer.observe(scrollTrigger.value);

      window.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    });

    return {
      pokemonList,
      isListLoading,
      scrollTrigger,
      handleShowDetail,
      handleSelectedDetail,
      headerStyle,
      showDetail,
      selectedDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
.home-view {
  display: flex;
  width: 100%;
  height: auto;
  min-height: 100vh;
  /* flex-direction: column;
  align-items: center;
  justify-content: center; */
  position: relative;
}

.home-header {
  width: 100%;
  height: 200px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  z-index: 3;

  & > .logo-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;

    & > img.app-logo {
      height: 80px;
    }
  }
}

.home-body {
  width: 100%;
  height: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 200px 170px 0 170px;
  position: relative;

  & > .pokemon-list {
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin: 20px auto 50px auto;
  }

  @media screen and (max-width: 1280px) {
    margin: 200px 120px 0 120px;
    & > .pokemon-list {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media screen and (max-width: 1024px) {
    margin: 200px 120px 0 120px;
    & > .pokemon-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (max-width: 768px) {
    margin: 200px 70px 0 70px;
    & > .pokemon-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (max-width: 425px) {
    margin: 200px 20px 0 20px;
    & > .pokemon-list {
      grid-template-columns: repeat(1, 1fr);
    }
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
  margin-bottom: 50px;

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
}
</style>
