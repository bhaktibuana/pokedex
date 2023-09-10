import { parsePokeHeight } from "@/utils";

describe("parsePokeHeight", () => {
  it("input must be a number", () => {
    const input = "123";
    expect(() => parsePokeHeight(input)).toThrow("Input must be Number");
  });

  it("should produce string output", () => {
    const result = parsePokeHeight(10);
    expect(typeof result).toBe("string");
  });

  it("should be (0 cm) if input is 0", () => {
    const result = parsePokeHeight(0);
    expect(result).toBe(" (0 cm)");
  });
});
