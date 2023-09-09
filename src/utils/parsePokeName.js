export const parsePokeName = (value) => {
  if (typeof value !== "string") throw new Error("Input must be String");
  return value
    .split("-")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};
