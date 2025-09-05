import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../Redux/authSlice";

const useRefreshToken = () => {
    const dispatch = useDispatch();

    const refresh = async () => {
        const response = await axios.get('/api/v1/refresh', { withCredentials: true });
        dispatch(setCredentials({accessToken: response.data.accessToken}));
        return response.data.accessToken;
    }

  return refresh;
}

export default useRefreshToken;