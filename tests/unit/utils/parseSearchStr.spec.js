import { parseSearchStr } from "@/utils";

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
