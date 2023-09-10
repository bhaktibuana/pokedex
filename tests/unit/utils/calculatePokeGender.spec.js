import { calculatePokeGender } from "@/utils";

describe("calculatePokeGender", () => {
  it("input must be a number", () => {
    const input = "123";
    expect(() => calculatePokeGender(input)).toThrow("Input must be Number");
  });

  it("should produce 0% both chance if input < 0", () => {
    const result = calculatePokeGender(-1);
    expect(result).toEqual({ male: "0%", female: "0%" });
  });

  it("should produce chance percentage of both gender", () => {
    const result = calculatePokeGender(5);
    const resultKey = Object.keys(result);
    expect(resultKey).toEqual(["male", "female"]);
  });
});
