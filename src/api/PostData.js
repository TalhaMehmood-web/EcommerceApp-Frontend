import toast from "react-hot-toast";
import axios from "../utils/AxiosConfiq";

export const postData = async (endpoint, dataToPost) => {
    try {
        // console.log(dataToPost);
        const data = await axios.post(endpoint, dataToPost)
        return data;
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(error?.response?.data?.message)
            return;
        }
        else {
            toast.error(" Network Error")
        }
    }
}