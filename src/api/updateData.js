import toast from "react-hot-toast";
import axios from "../utils/AxiosConfiq";

export const updateData = async (endpoint, fieldsToUpdate) => {
    try {

        const data = await axios.put(endpoint, { fieldsToUpdate })
        return data;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message)
    }
}