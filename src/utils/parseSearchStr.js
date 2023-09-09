export const parseSearchStr = (value) => {
  if (typeof value !== "string") throw new Error("Input must be String");
  const str = value.toLowerCase();
  const strArr = str.split(" ");
  return strArr.join("-");
};
