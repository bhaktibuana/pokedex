import axios from "axios";
import { config } from "@/configs";

export const axiosInstance = (queryParams) =>
  axios.create({
    baseURL: `${config.apiUrl}/api/v2`,
    headers: {
      "Content-Type": "application/json",
    },
    params: queryParams,
  });
