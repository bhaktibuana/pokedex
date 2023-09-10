import { mount } from "@vue/test-utils";
import { PokeCard } from "@/components";
import { parsePokeName } from "@/utils";
import { typeColor } from "@/constants";

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

describe("PokeCard Component", () => {
  let wrapper;
  const testProps = {
    pokemonData: {
      id: 1,
      name: "awesome-pokemon",
      types: [
        {
          type: { name: "grass" },
        },
        {
          type: { name: "fire" },
        },
      ],
      sprites: {
        other: {
          "official-artwork": {
            front_default: "https://via.placeholder.com/150",
          },
        },
      },
    },
  };

  beforeAll(() => {
    wrapper = mount(PokeCard, {
      props: testProps,
    });
  });

  it("should render pokemon name passed via props", () => {
    const pokemonName = parsePokeName(testProps.pokemonData.name);
    expect(wrapper.text()).toContain(pokemonName);
  });

  it("should render color based on first type", () => {
    const expectColor = typeColor[testProps.pokemonData.types[0].type.name];
    const divStyle = wrapper.find(".poke-card-container").attributes("style");
    const bgColorMatch = /background-color: ([^;]+)/.exec(divStyle);

    expect(bgColorMatch[1]).toBe(hexToRgb(expectColor));
  });

  it("should render pokemon types", () => {
    const pokeTypes = testProps.pokemonData.types.map((item) =>
      parsePokeName(item.type.name)
    );
    pokeTypes.forEach((item) => {
      expect(wrapper.text()).toContain(item);
    });
  });
});
