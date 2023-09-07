import React from 'react';
import jwt from 'jwt-decode'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));

    const { isLoading, data: validJWT = {} } = useQuery({
        queryKey: [children],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/checkJWT`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => res.data)
            .catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    userData && toast.error('Token Invalid! Login Again')
                    secureLocalStorage.removeItem("userData");
                    navigate('/login');
                }
            })
    })

    if (userData && validJWT?.message === "valid jwt") {
        const userTokenData = jwt(userData?.user_token)
        if (userTokenData?.id === validJWT?.id && userTokenData?.user_type === validJWT?.user_type) {
            return children;
        }
    }

    if (!userData?.customer_id && !userData?.user_type) {
        toast.error('You Are Not Logged In')
        return <Navigate to="/login" state={{ from: location }} replace></Navigate>
    }
};

export default PrivateRoute;