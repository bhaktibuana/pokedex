import { parsePokeId } from "@/utils";

describe("parsePokeId", () => {
  it("input must be a number", () => {
    const input = "123";
    expect(() => parsePokeId(input)).toThrow("Input must be Number");
  });

  it("should produce string output", () => {
    const result = parsePokeId(10);
    expect(typeof result).toBe("string");
  });
});
