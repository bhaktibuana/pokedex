import { parsePokeName } from "./parsePokeName";

export const parsePokeEggGroups = (value) => {
  if (!Array.isArray(value)) throw new Error("Input must be Array of String");
  if (value.length > 0 && value.every((element) => typeof element !== "string"))
    throw new Error("Input must be Array of String");
  if (value.length === 0) return "";

  const array = value.map((item) => parsePokeName(item));
  return array.join(", ");
};
