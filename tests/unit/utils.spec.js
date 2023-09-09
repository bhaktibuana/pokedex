import { parsePokeName, parseSearchStr } from "@/utils";

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
