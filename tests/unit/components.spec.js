import { mount } from "@vue/test-utils";
import { PokeCard, SearchBar } from "@/components";
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

describe("SearchBar Component", () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(SearchBar);
  });

  it("should updates input value and searchStr ref when input changes", async () => {
    const inputElement = wrapper.find("input.search-input");
    await inputElement.setValue("bulbasaur");
    expect(inputElement.element.value).toBe("bulbasaur");
    expect(wrapper.vm.searchStr).toBe("bulbasaur");
  });

  it("should show search info when input value length > 0", async () => {
    const inputElement = wrapper.find("input.search-input");
    const searchInfoElement = wrapper.find(".search-info");
    await inputElement.trigger("focus");
    await inputElement.setValue("test");
    expect(searchInfoElement.classes()).toContain("active");
    await inputElement.setValue("");
    expect(searchInfoElement.classes()).not.toContain("active");
  });

  it("should reset the input value and searchStr ref when input on blur", async () => {
    const inputElement = wrapper.find("input.search-input");
    await inputElement.trigger("focus");
    await inputElement.setValue("bulbasaur");
    expect(inputElement.element.value).toBe("bulbasaur");
    expect(wrapper.vm.searchStr).toBe("bulbasaur");
    await inputElement.trigger("blur");
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(inputElement.element.value).toBe("");
    expect(wrapper.vm.searchStr).toBe("");
  });
});
