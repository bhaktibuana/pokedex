export const parsePokeId = (value) => {
  if (typeof value !== "number") throw new Error("Input must be Number");
  const formattedId = String(value).padStart(4, "0");
  return `#${formattedId}`;
};
