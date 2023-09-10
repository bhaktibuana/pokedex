<template>
  <div
    class="poke-card-container"
    :style="{ backgroundColor: typeColor[types[0].type.name] }"
    @click="handleClickCard(name)"
  >
    <div class="card-detail-container">
      <div class="poke-name-container">
        <p class="poke-name">{{ parsePokeName(name) }}</p>
        <p class="poke-id">{{ parsePokeId(id) }}</p>
      </div>

      <div class="type-container">
        <div
          v-for="(item, index) in types"
          :key="index"
          class="type-tag"
          :style="{ backgroundColor: typeColor[item.type.name] }"
        >
          <p>{{ parsePokeName(item.type.name) }}</p>
        </div>
      </div>
    </div>

    <div class="card-image-container">
      <img
        v-lazy="require('@/assets/images/poke-vector.webp')"
        alt="pokeballBg"
        class="pokeball-bg"
      />

      <img
        v-lazy="image ? image : require('@/assets/images/pokeball-50x50.webp')"
        :alt="name"
        class="poke-avatar"
      />
    </div>
  </div>
</template>

<script>
import { parsePokeName, parsePokeId } from "@/utils";
import { typeColor } from "@/constants";

export default {
  name: "PokeCard",
  props: ["pokemonData"],
  setup({ pokemonData }, { emit }) {
    const id = pokemonData.id;
    const name = pokemonData.name;
    const types = pokemonData.types;
    const image =
      pokemonData.sprites.other["official-artwork"]["front_default"];

    const handleClickCard = (pokemonName) => {
      emit("setShowDetail", true);
      emit("setSelectedDetail", pokemonName);
    };

    return {
      id,
      name,
      types,
      image,
      parsePokeId,
      parsePokeName,
      typeColor,
      handleClickCard,
    };
  },
};
</script>

<style lang="scss" scoped>
.poke-card-container {
  width: 100%;
  height: 130px;
  display: flex;
  justify-content: space-between;
  background-color: var(--BG_COLOR_GREY);
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s all ease;

  & > .card-detail-container {
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & > .poke-name-container {
      display: flex;
      margin: 15px 0 0 15px;
      flex-direction: column;
      gap: 3px;

      & > p.poke-name {
        font-family: "VT323", monospace;
        font-size: 1.6rem;
        color: var(--TEXT_COLOR_2);
        transition: 0.2s all ease;
      }

      & > p.poke-id {
        font-size: 15px;
        font-weight: 600;
        color: var(--TEXT_COLOR_2);
        transition: 0.2s all ease;
      }
    }

    & > .type-container {
      width: 100%;
      height: 25px;
      display: flex;
      margin: 0 0 15px 15px;
      gap: 5px;

      & > .type-tag {
        width: auto;
        min-width: 50px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px;
        background-color: var(--BG_COLOR_GREY);
        filter: brightness(1.1);
        border-radius: 4px;
        font-size: 12px;
        transition: 0.2s all ease;
      }
    }
  }

  & > .card-image-container {
    width: 40%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    & > img.pokeball-bg {
      height: 80%;
      filter: opacity(15%);
      position: absolute;
    }

    & > img.poke-avatar {
      height: 90%;
      filter: grayscale(40%);
      transition: 0.2s all ease;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
  }

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:hover > .card-detail-container > .poke-name-container > p.poke-name,
  &:hover > .card-detail-container > .poke-name-container > p.poke-id {
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
    transform: scale(1.01);
  }

  &:hover > .card-detail-container > .type-container > .type-tag {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    transform: scale(1.01);
  }

  &:hover > .card-image-container > img.poke-avatar {
    transform: scale(1.4);
    filter: grayscale(0%);
  }
}
</style>
