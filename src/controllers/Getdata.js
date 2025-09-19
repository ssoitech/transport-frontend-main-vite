import axios from "axios";

/**
 * Fetch all vehicle passing weight data from API.
 * @returns {Promise<any>} Vehicle data or null if error
 */
export default async function getData() {
  try {
    const response = await axios.get(
      "http://ssoi.themdlabs.com:8080/api/v1/get/all-vehicle-passing-weight"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
