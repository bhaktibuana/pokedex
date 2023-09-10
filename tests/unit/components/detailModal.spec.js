import { mount } from "@vue/test-utils";
import { DetailModal } from "@/components";

describe("DetailModal Component", () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(DetailModal);
  });

  it("overlay display should be exist", () => {
    const overlay = wrapper.find(".overlay");
    expect(overlay.exists()).toBe(true);
  });

  it("detail modal container should be exist", () => {
    const element = wrapper.find(".detail-modal-container");
    expect(element.exists()).toBe(true);
  });
});
