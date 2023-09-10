import { mount } from "@vue/test-utils";
import { SearchBar } from "@/components";

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
});
