import axiosPrivate from "@/api/axiosPrivate";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useSelector } from "react-redux";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const token = useSelector((state: any) => state.auth.token);

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${token}`
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async(error) => {
                const prevReq = error?.config;
                if(error?.response?.status == 403 && !prevReq?.sent) {
                    prevReq.sent = true;
                    const newAccessToken = await refresh();
                    prevReq.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevReq);
                }
                return Promise.reject(error);
            }
        )

        return () => {
            axiosPrivate.interceptors.response.eject(responseIntercept);
            axiosPrivate.interceptors.request.eject(requestIntercept);
        }
    }, [refresh, token])

    return axiosPrivate;
}

export const getAxiosPrivateInstance = () => {
    return axiosPrivate;
}

export default useAxiosPrivate;