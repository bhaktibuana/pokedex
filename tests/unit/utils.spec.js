import {
  parsePokeName,
  parseSearchStr,
  parsePokeHeight,
  parsePokeId,
  parsePokeWeight,
  parsePokeEggGroups,
  calculatePokeGender,
} from "@/utils";

describe("parsePokeName", () => {
  it("input must be a string", () => {
    const input = 123;
    expect(() => parsePokeName(input)).toThrow("Input must be String");
  });

  it("should replace '-' become ' ' and capitalize the string", () => {
    const result = parsePokeName("my-pokemon");
    expect(result).toBe("My Pokemon");
  });
});

describe("parseSearchStr", () => {
  it("input must be a string", () => {
    const input = 123;
    expect(() => parseSearchStr(input)).toThrow("Input must be String");
  });

  it("should replace ' ' become '-' and change all chars to lower case", () => {
    const result = parseSearchStr("My Pokemon");
    expect(result).toBe("my-pokemon");
  });
});

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
