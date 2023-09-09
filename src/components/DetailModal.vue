<template>
  <div class="detail-modal">
    <div class="detail-modal-container" :class="{ active: isOpen }">
      <div class="card-container">
        <div
          class="card-header"
          :style="{
            backgroundColor: pokemonDetail
              ? typeColor[pokemonDetail.types[0].type.name]
              : 'var(--BG_COLOR_GREY)',
          }"
        >
          <div class="card-title">
            <p class="poke-name">
              {{ pokemonDetail ? parsePokeName(pokemonDetail.name) : "" }}
            </p>

            <button
              class="close-modal"
              :style="{
                backgroundColor: pokemonDetail
                  ? typeColor[pokemonDetail.types[0].type.name]
                  : 'grey',
              }"
              @click="handleCloseModal"
            >
              ×
            </button>
          </div>

          <div v-if="pokemonDetail" class="card-tags-container">
            <div
              v-for="(item, index) in pokemonDetail.types"
              :key="index"
              class="poke-type"
              :style="{
                backgroundColor: pokemonDetail
                  ? typeColor[item.type.name]
                  : 'grey',
              }"
            >
              {{ parsePokeName(item.type.name) }}
            </div>
          </div>

          <img
            v-lazy="require('@/assets/images/poke-vector.webp')"
            alt="pokeballBg"
            class="pokeball-bg"
          />
        </div>

        <div class="card-body">
          <div v-if="pokemonDetail" class="avatar-container">
            <img
              v-lazy="
                pokemonDetail.sprites.other['official-artwork']['front_default']
                  ? pokemonDetail.sprites.other['official-artwork'][
                      'front_default'
                    ]
                  : require('@/assets/images/pokeball-50x50.webp')
              "
              :alt="pokemonDetail.name"
              class="poke-avatar"
            />
          </div>

          <div class="detail-container">
            <div ref="tabs" class="tab-container">
              <button class="tab-button" @click="handleToggleTab">About</button>
              <button class="tab-button" @click="handleToggleTab">
                Base Stats
              </button>
              <button class="tab-button" @click="handleToggleTab">Moves</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="overlay"
      :class="{ active: isOpen }"
      @click="handleCloseModal"
    ></div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useAxios } from "@/composables";
import { pokemonService } from "@/services";
import { typeColor } from "@/constants";
import { parsePokeName } from "@/utils";

export default {
  name: "DetailModal",
  props: ["isOpen", "pokeName"],
  setup(props, { emit }) {
    const isOpen = computed(() => props.isOpen);
    const pokeName = computed(() => props.pokeName);
    const pokemonDetail = ref();
    const tabs = ref(null);

    const getPokeDetail = useAxios();

    const handleCloseModal = () => {
      emit("setIsOpen", false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    watch(pokeName, async (pokeNameVal) => {
      await getPokeDetail.axiosFetch(pokemonService.pokemonDetail(pokeNameVal));
      if (getPokeDetail.isSuccess) {
        pokemonDetail.value = getPokeDetail.response.value;
      }
    });

    onMounted(() => {
      window.addEventListener("keydown", handleKeyDown);
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });

    return {
      isOpen,
      handleCloseModal,
      pokemonDetail,
      typeColor,
      parsePokeName,
    };
  },
};
</script>

<style lang="scss" scoped>
.overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;

  &.active {
    display: block;
  }
}

.detail-modal-container {
  width: 95%;
  min-width: 320px;
  max-width: 425px;
  height: 768px;
  max-height: 95%;
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent;
  z-index: 101;
  border-radius: 8px;

  &.active {
    display: block;
  }
}

.card-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  border-radius: 8px;
}

.card-header {
  width: 100%;
  height: 50%;
  background-color: var(--BG_COLOR_GREY);
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: column;
  position: relative;

  & > .card-title {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > p.poke-name {
      font-size: 1.8rem;
      font-weight: bold;
      color: var(--TEXT_COLOR_2);
      margin-top: 15px;
      margin-left: 20px;
    }

    & > button.close-modal {
      height: 26px;
      width: 26px;
      margin-right: 15px;
      outline: none;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      background-color: transparent;
      filter: brightness(0.93);
      color: var(--BG_COLOR_1);
      font-size: 1.2rem;
      font-weight: bold;
      cursor: pointer;
    }
  }

  & > .card-tags-container {
    width: 100%;
    height: 30px;
    display: flex;
    padding: 0 20px;
    margin-top: 5px;
    gap: 8px;

    & > .poke-type {
      width: auto;
      min-width: 60px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px 10px;
      background-color: var(--BG_COLOR_GREY);
      filter: brightness(1.05);
      border-radius: 10px;
      font-size: 15px;
      color: var(--BG_COLOR_1);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }
  }

  & > img.pokeball-bg {
    height: 200px;
    position: absolute;
    right: 10px;
    bottom: 10px;
    filter: brightness(300%);
    opacity: 0.25;
    transform: rotate(-20deg);
  }
}

.card-body {
  width: 100%;
  height: 60%;
  border-radius: 35px 35px 8px 8px;
  background-color: var(--BG_COLOR_0);
  position: absolute;
  top: 40%;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  & > .avatar-container {
    width: 100%;
    height: 30px;
    background-color: transparent;
    display: flex;
    justify-content: center;
    position: relative;

    & > img.poke-avatar {
      position: absolute;
      width: 55%;
      top: -195px;
    }
  }
}

.detail-container {
  width: 100%;
  height: 100%;
  padding: 0 15px 0;
}

.tab-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1.5px solid rgba(229, 229, 229);

  & > button.tab-button {
    font-size: 16px;
    font-weight: 600;
    color: #919191;
    background: none;
    border: none;
    padding: 12px;
    cursor: pointer;
  }
}
</style>
