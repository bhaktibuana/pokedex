import { parsePokeWeight } from "@/utils";

describe("parsePokeWeight", () => {
  it("input must be a number", () => {
    const input = "123";
    expect(() => parsePokeWeight(input)).toThrow("Input must be Number");
  });

  it("should produce string output", () => {
    const result = parsePokeWeight(10);
    expect(typeof result).toBe("string");
  });
});
