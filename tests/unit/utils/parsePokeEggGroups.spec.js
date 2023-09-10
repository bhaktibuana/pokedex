import { parsePokeEggGroups } from "@/utils";

describe("parsePokeEggGroups", () => {
  it("input must be an array", () => {
    const input = "123";
    expect(() => parsePokeEggGroups(input)).toThrow(
      "Input must be Array of String"
    );
  });

  it("input must be an array of string", () => {
    const input = [0, 1, 2];
    expect(() => parsePokeEggGroups(input)).toThrow(
      "Input must be Array of String"
    );
  });

  it("should return emty string if input is emtpy array", () => {
    const result = parsePokeEggGroups([]);
    expect(result).toBe("");
  });

  it("should convert array to string sprated with comma and capitalized", () => {
    const result = parsePokeEggGroups(["buba", "huhu-hu"]);
    expect(result).toBe("Buba, Huhu Hu");
  });
});
