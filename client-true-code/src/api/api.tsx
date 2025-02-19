import axios from "axios";
import { ApiResponseInterface } from "../components/Interface/interface";

const getData = async (): Promise<ApiResponseInterface> => {
  try {
    const response = await axios.get<ApiResponseInterface>(
      "http://localhost:3000/products/all"
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);

    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.status, error.message);

      if (error.response?.status === 404) {
        throw new Error("Products not found");
      }
      throw new Error(`Request failed with status ${error.response?.status}`);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export default getData;
