export const parsePokeWeight = (value) => {
  if (typeof value !== "number") throw new Error("Input must be Number");
  const kilograms = value / 10;
  const pounds = (kilograms * 2.20462).toFixed(1);
  const formattedPounds = `${pounds} lbs`;
  const formattedKilograms = `${kilograms.toFixed(1)} kg`;
  const formattedResult = `${formattedPounds} (${formattedKilograms})`;
  return formattedResult;
};
