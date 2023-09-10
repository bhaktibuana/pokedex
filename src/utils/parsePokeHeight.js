export const parsePokeHeight = (value) => {
  if (typeof value !== "number") throw new Error("Input must be Number");
  const centimeters = value * 10;
  const feet = Math.floor(centimeters / 30.48);
  const inches = ((centimeters % 30.48) / 2.54).toFixed(1);
  const formattedFeet = feet > 0 ? `${feet}'` : "";
  const formattedInches = inches > 0 ? `${inches}"` : "";
  const formattedCentimeters = `${centimeters} cm`;
  const formattedResult = `${formattedFeet}${formattedInches} (${formattedCentimeters})`;
  return formattedResult;
};
