export const calculatePokeGender = (value) => {
  if (typeof value !== "number") throw new Error("Input must be Number");
  if (value < 0) return { male: "0%", female: "0%" };
  const genderRate = value * 100;
  const femaleMaxRange = 8;
  const femaleChance = genderRate / femaleMaxRange;
  return {
    male: `${(100 - femaleChance).toFixed(1)}%`,
    female: `${femaleChance.toFixed(1)}%`,
  };
};
