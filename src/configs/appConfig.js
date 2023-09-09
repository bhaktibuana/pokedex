const apiUrl = "https://pokeapi.co";

export const config =
  process.env.NODE_ENV === "development"
    ? {
        nodeEnv: "development",
        apiUrl,
      }
    : {
        nodeEnv: "production",
        apiUrl,
      };
