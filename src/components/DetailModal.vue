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

            <p class="poke-id">{{ parsePokeId(pokemonDetail.id) }}</p>
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
            <div class="tab-container">
              <button
                class="tab-button"
                :class="{ active: activeTab === 'About' }"
              >
                About
              </button>
              <button
                class="tab-button"
                :class="{ active: activeTab === 'Base Stats' }"
              >
                Base Stats
              </button>
              <button
                class="tab-button"
                :class="{ active: activeTab === 'Abilities' }"
              >
                Abilities
              </button>
              <div class="tab-line" :style="tabLineStyle"></div>
            </div>

            <div
              class="detail-content"
              :class="{ active: activeTab === 'About' }"
            >
              <div class="about-detail">
                <div class="about-item">
                  <p class="about-item-prop">Species</p>
                  <p v-if="!isAboutDataLoading" class="about-item-value">
                    {{
                      aboutData?.species ? parsePokeName(aboutData.species) : ""
                    }}
                  </p>
                  <div v-else class="about-item-value-skeleton"></div>
                </div>

                <div class="about-item">
                  <p class="about-item-prop">Height</p>
                  <p v-if="!isAboutDataLoading" class="about-item-value">
                    {{
                      aboutData?.height ? parsePokeHeight(aboutData.height) : ""
                    }}
                  </p>
                  <div v-else class="about-item-value-skeleton"></div>
                </div>

                <div class="about-item">
                  <p class="about-item-prop">Weight</p>
                  <p v-if="!isAboutDataLoading" class="about-item-value">
                    {{
                      aboutData?.weight ? parsePokeWeight(aboutData.weight) : ""
                    }}
                  </p>
                  <div v-else class="about-item-value-skeleton"></div>
                </div>

                <div class="about-item">
                  <p class="about-item-prop">Base Exp</p>
                  <p v-if="!isAboutDataLoading" class="about-item-value">
                    {{
                      aboutData?.baseExperience ? aboutData.baseExperience : ""
                    }}
                  </p>
                  <div v-else class="about-item-value-skeleton"></div>
                </div>

                <p class="about-subtitle">Breeding</p>

                <div class="about-item">
                  <p class="about-item-prop">Gender</p>
                  <p v-if="!isAboutDataLoading" class="about-item-value">
                    <span class="male-icon">
                      <font-awesome-icon icon="fa-solid fa-mars" size="1x" />
                    </span>
                    {{ aboutData?.genders ? `${aboutData.genders.male}` : "" }}
                    <span class="gender-space"></span>
                    <span class="female-icon">
                      <font-awesome-icon icon="fa-solid fa-venus" size="1x" />
                    </span>
                    {{ aboutData?.genders ? aboutData.genders.female : "" }}
                  </p>
                  <div v-else class="about-item-value-skeleton"></div>
                </div>

                <div class="about-item">
                  <p class="about-item-prop">Egg Groups</p>
                  <p v-if="!isAboutDataLoading" class="about-item-value">
                    {{
                      aboutData?.eggGroups
                        ? parsePokeEggGroups(aboutData.eggGroups)
                        : ""
                    }}
                  </p>
                  <div v-else class="about-item-value-skeleton"></div>
                </div>
              </div>
            </div>

            <div
              class="detail-content"
              :class="{ active: activeTab === 'Base Stats' }"
            >
              <div class="stats-detail">
                <div class="stats-item">
                  <p class="stats-item-prop">HP</p>
                  <p class="stats-item-value">
                    {{ baseStatsData?.hp ? baseStatsData.hp.base : "" }}
                  </p>
                  <div id="stat-hp" class="stats-item-bar"></div>
                </div>

                <div class="stats-item">
                  <p class="stats-item-prop">Attack</p>
                  <p class="stats-item-value">
                    {{ baseStatsData?.attack ? baseStatsData.attack.base : "" }}
                  </p>
                  <div id="stat-attack" class="stats-item-bar"></div>
                </div>

                <div class="stats-item">
                  <p class="stats-item-prop">Defense</p>
                  <p class="stats-item-value">
                    {{
                      baseStatsData?.defense ? baseStatsData.defense.base : ""
                    }}
                  </p>
                  <div id="stat-defense" class="stats-item-bar"></div>
                </div>

                <div class="stats-item">
                  <p class="stats-item-prop">Sp. Atk</p>
                  <p class="stats-item-value">
                    {{
                      baseStatsData?.specialAttack
                        ? baseStatsData.specialAttack.base
                        : ""
                    }}
                  </p>
                  <div id="stat-specialAttack" class="stats-item-bar"></div>
                </div>

                <div class="stats-item">
                  <p class="stats-item-prop">Sp. Def</p>
                  <p class="stats-item-value">
                    {{
                      baseStatsData?.specialDefense
                        ? baseStatsData.specialDefense.base
                        : ""
                    }}
                  </p>
                  <div id="stat-specialDefense" class="stats-item-bar"></div>
                </div>

                <div class="stats-item">
                  <p class="stats-item-prop">Speed</p>
                  <p class="stats-item-value">
                    {{ baseStatsData?.speed ? baseStatsData.speed.base : "" }}
                  </p>
                  <div id="stat-speed" class="stats-item-bar"></div>
                </div>
              </div>
            </div>

            <div
              class="detail-content"
              :class="{ active: activeTab === 'Abilities' }"
            >
              <div v-if="!isAbilitiesLoading" class="abilities-detail">
                <div
                  v-for="(item, index) in abilitiesData"
                  :key="index"
                  class="abilities-item"
                >
                  <p class="ability-name">{{ item.name }}</p>
                  <p class="ability-effect">{{ item.effect }}</p>
                </div>
              </div>

              <div v-else class="abilities-detail">
                <div
                  v-for="(item, index) in Array.from({ length: 2 })"
                  :key="index"
                  class="abilities-item"
                >
                  <div class="ability-name-skeleton"></div>
                  <div class="ability-effect-skeleton-conteiner">
                    <div class="ability-effect-skeleton"></div>
                    <div class="ability-effect-skeleton"></div>
                  </div>
                </div>
              </div>
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
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useAxios } from "@/composables";
import { pokemonService } from "@/services";
import { typeColor } from "@/constants";
import {
  parsePokeName,
  parsePokeId,
  parsePokeHeight,
  parsePokeWeight,
  parsePokeEggGroups,
  calculatePokeGender,
} from "@/utils";

export default {
  name: "DetailModal",
  props: ["isOpen", "pokeName"],
  setup(props, { emit }) {
    const isOpen = computed(() => props.isOpen);
    const pokeName = computed(() => props.pokeName);
    const pokemonDetail = ref();
    const activeTab = ref("About");
    const tabButtons = ref(null);
    const tabLineStyle = ref({});
    const aboutData = ref();
    const isAboutDataLoading = ref(false);
    const baseStatsData = ref();
    const abilitiesData = ref();
    const isAbilitiesLoading = ref(false);

    const getPokeDetail = useAxios();

    const handleCloseModal = () => {
      emit("setIsOpen", false);
      pokemonDetail.value = undefined;
      aboutData.value = undefined;
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    const handleToggleTab = (tabName) => {
      activeTab.value = tabName;
    };

    const getAboutData = async (pokemonDetailData) => {
      isAboutDataLoading.value = true;
      aboutData.value = {};
      const getSpecies = useAxios();
      const pokeSpeciesId = pokemonDetailData.species.url.split("/").at(-2);

      aboutData.value = {
        ...aboutData.value,
        height: pokemonDetailData.height,
        weight: pokemonDetailData.weight,
        baseExperience: pokemonDetailData.base_experience,
      };

      await getSpecies.axiosFetch(
        pokemonService.pokemonSpecies(pokeSpeciesId.toString())
      );

      if (getSpecies.isSuccess.value) {
        aboutData.value = {
          ...aboutData.value,
          species: getSpecies.response.value.genera.filter(
            (item) => item.language.name === "en"
          )[0].genus,
          genders: {
            male: calculatePokeGender(getSpecies.response.value.gender_rate)
              .male,
            female: calculatePokeGender(getSpecies.response.value.gender_rate)
              .female,
          },
          eggGroups:
            getSpecies.response.value.egg_groups.length > 0
              ? getSpecies.response.value.egg_groups.map((item) => item.name)
              : [],
        };
      }

      isAboutDataLoading.value = false;
    };

    const getBaseStatsData = (pokemonDetailData) => {
      baseStatsData.value = {
        hp: {
          base: pokemonDetailData.stats.filter(
            (item) => item.stat.name === "hp"
          )[0].base_stat,
          effort: pokemonDetailData.stats.filter(
            (item) => item.stat.name === "hp"
          )[0].effort,
        },
        attack: {
          base: pokemonDetailData.stats.filter(
            (item) => item.stat.name === "attack"
          )[0].base_stat,
          effort: pokemonDetailData.stats.filter(
            (item) => item.stat.name === "attack"
          )[0].effort,
        },
        defense: {
          base: pokemonDetailData.stats.filter(
            (item) => item.stat.name === "defense"
          )[0].base_stat,
          effort: pokemonDetailData.stats.filter(
            (item) => item.stat.name === "defense"
          )[0].effort,
        },
        specialAttack: {
          base: pokemonDetailData.stats.filter(
            (item) => item.stat.name === "special-attack"
          )[0].base_stat,
          effort: pokemonDetailData.stats.filter(
            (item) => item.stat.name === "special-attack"
          )[0].effort,
        },
        specialDefense: {
          base: pokemonDetailData.stats.filter(
            (item) => item.stat.name === "special-defense"
          )[0].base_stat,
          effort: pokemonDetailData.stats.filter(
            (item) => item.stat.name === "special-defense"
          )[0].effort,
        },
        speed: {
          base: pokemonDetailData.stats.filter(
            (item) => item.stat.name === "speed"
          )[0].base_stat,
          effort: pokemonDetailData.stats.filter(
            (item) => item.stat.name === "speed"
          )[0].effort,
        },
      };
    };

    const getAbilitiesData = async (pokemonDetailData) => {
      isAbilitiesLoading.value = true;
      abilitiesData.value = [];
      const getAbilities = useAxios();
      const pokeAbilitiesId = pokemonDetailData.abilities.map((item) =>
        item.ability.url.split("/").at(-2)
      );

      for (let i = 0; i < pokeAbilitiesId.length; i++) {
        await getAbilities.axiosFetch(
          pokemonService.pokemonAbilities(pokeAbilitiesId[i].toString())
        );

        if (getAbilities.isSuccess.value) {
          abilitiesData.value = [
            ...abilitiesData.value,
            {
              name: parsePokeName(getAbilities.response.value.name),
              effect:
                getAbilities.response.value.effect_entries.length > 0
                  ? getAbilities.response.value.effect_entries.filter(
                      (item) => item.language.name === "en"
                    )[0].short_effect
                  : "",
            },
          ];
        }
      }

      isAbilitiesLoading.value = false;
    };

    watch([pokeName, isOpen], async ([pokeNameVal, isOpenVal]) => {
      if (isOpenVal) {
        await getPokeDetail.axiosFetch(
          pokemonService.pokemonDetail(pokeNameVal)
        );
        if (getPokeDetail.isSuccess) {
          pokemonDetail.value = getPokeDetail.response.value;
        }

        nextTick(() => {
          const tabName = tabButtons.value[0].textContent.trim();
          handleToggleTab(tabName);
          tabLineStyle.value = {
            width: `${tabButtons.value[0].offsetWidth}px`,
            left: `${tabButtons.value[0].offsetLeft}px`,
          };
        });
      }
    });

    watch(baseStatsData, (baseStatsDataVal) => {
      if (baseStatsDataVal === undefined) return;
      if (Object.keys(baseStatsDataVal).length === 0) return;

      const statBars = document.querySelectorAll(".stats-item-bar");
      Object.keys(baseStatsDataVal).forEach((item) => {
        const widthPercent = (baseStatsDataVal[item].base / 252) * 100;
        const bgColor =
          widthPercent <= 33
            ? "#f7786b"
            : widthPercent > 66
            ? "#48d0b0"
            : "#ffce4b";
        let selectedStatBar;

        statBars.forEach((statBar) => {
          if (statBar.id === `stat-${item}`) selectedStatBar = statBar;
        });

        selectedStatBar.style.setProperty(
          "--stat-bar-width",
          `${widthPercent}%`
        );
        selectedStatBar.style.setProperty("--stat-bar-bg", bgColor);
      });
    });

    watch(
      [isOpen, activeTab, pokemonDetail],
      ([isOpenVal, activeTabVal, pokemonDetailVal]) => {
        if (isOpenVal) {
          if (pokemonDetailVal === undefined) return;

          if (activeTabVal === "About") {
            getAboutData(pokemonDetailVal);
          } else if (activeTabVal === "Base Stats") {
            getBaseStatsData(pokemonDetailVal);
          } else if (activeTabVal === "Abilities") {
            getAbilitiesData(pokemonDetailVal);
          }
        }
      }
    );

    onMounted(() => {
      window.addEventListener("keydown", handleKeyDown);

      tabButtons.value = document.querySelectorAll(".tab-button");
      tabButtons.value.forEach((tabButton) => {
        tabButton.addEventListener("click", (event) => {
          const tabName = event.target.textContent.trim();
          handleToggleTab(tabName);
          tabLineStyle.value = {
            width: `${event.target.offsetWidth}px`,
            left: `${event.target.offsetLeft}px`,
          };
        });
      });
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
      parsePokeId,
      activeTab,
      tabLineStyle,
      aboutData,
      isAboutDataLoading,
      parsePokeHeight,
      parsePokeWeight,
      parsePokeEggGroups,
      baseStatsData,
      abilitiesData,
      isAbilitiesLoading,
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
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
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

    & > p.poke-id {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--TEXT_COLOR_2);
      margin-left: auto;
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  border-bottom: 1.5px solid var(--BG_COLOR_1);

  & > button.tab-button {
    font-size: 16px;
    font-weight: 600;
    color: var(--TEXT_COLOR_1);
    background: none;
    border: none;
    padding: 12px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: 0.2s all ease-in-out;

    &.active {
      color: var(--PRIMARY_COLOR);
    }
  }

  & > .tab-line {
    position: absolute;
    top: 44px;
    left: 0px;
    width: 70px;
    height: 4px;
    border-radius: 10px;
    background-color: var(--PRIMARY_COLOR);
    transition: 0.2s all ease-in-out;
  }
}

.detail-content {
  display: none;
  margin-top: 30px;
  width: 100%;
  height: 100%;
  margin-bottom: 15px;
  padding: 0 20px;
  flex-direction: column;

  &.active {
    display: flex;
    overflow: auto;
  }
}

.about-detail {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;

  & > p.about-subtitle {
    margin-top: 15px;
    font-weight: 800;
    color: var(--TEXT_COLOR_1);
    font-size: 1.2rem;
  }
}

.about-item {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  gap: 30px;
  font-weight: 600;

  & > p.about-item-prop {
    color: var(--TEXT_COLOR_3);
    width: 150px;
  }

  & > p.about-item-value {
    color: var(--TEXT_COLOR_0);
    width: 100%;
  }

  & > .about-item-value-skeleton {
    width: 100%;
    height: 1rem;
    background: linear-gradient(90deg, #e6e6e6 25%, #d6d6d6 50%, #e6e6e6 75%);
    background-size: 200% 100%;
    border-radius: 5px;
    animation: aboutItemLoading 1.5s infinite;

    @keyframes aboutItemLoading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  }
}

.gender-space {
  margin: 0 8px;
}

.male-icon {
  color: #58abf6;
}

.female-icon {
  color: #ff75ac;
}

.stats-detail {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.stats-item {
  width: 100%;
  height: auto;
  align-items: center;
  display: flex;
  gap: 15px;
  font-weight: 600;

  & > p.stats-item-prop {
    color: var(--TEXT_COLOR_3);
    width: 120px;
  }

  & > p.stats-item-value {
    color: var(--TEXT_COLOR_0);
    width: 15%;
    text-align: center;
  }

  & > .stats-item-bar {
    width: 100%;
    height: 0.6rem;
    background-color: var(--BG_COLOR_2);
    border-radius: 4px;
    position: relative;

    &::before {
      content: "";
      width: var(--stat-bar-width);
      height: 0.6rem;
      position: absolute;
      background-color: var(--stat-bar-bg);
      transition: width 0.3s ease-in-out;
      border-radius: 4px;
      top: 0;
      left: 0;
    }
  }
}

.abilities-detail {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.abilities-item {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  font-weight: 600;
  gap: 5px;

  & > p.ability-name {
    width: 100%;
    font-weight: 800;
    color: var(--TEXT_COLOR_1);
    font-size: 1.2rem;
  }

  & > p.ability-effect {
    color: var(--TEXT_COLOR_0);
    width: 100%;
  }

  & > .ability-name-skeleton {
    width: 100px;
    height: 1.2rem;
    background: linear-gradient(90deg, #e6e6e6 25%, #d6d6d6 50%, #e6e6e6 75%);
    background-size: 200% 100%;
    border-radius: 5px;
    animation: abilityNameLoading 1.5s infinite;

    @keyframes abilityNameLoading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  }

  & > .ability-effect-skeleton-conteiner {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 3px;

    & > .ability-effect-skeleton {
      width: 100%;
      height: 1rem;
      background: linear-gradient(90deg, #e6e6e6 25%, #d6d6d6 50%, #e6e6e6 75%);
      background-size: 200% 100%;
      border-radius: 5px;
      animation: abilityEffectLoading 1.5s infinite;

      @keyframes abilityEffectLoading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    }
  }
}
</style>
