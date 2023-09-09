import { parsePokeName } from "@/utils";

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
