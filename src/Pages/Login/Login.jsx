import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import secureLocalStorage from "react-secure-storage";
import { Helmet } from 'react-helmet-async';

const Login = () => {
    console.log("now");
    const [seePassword, setSeePassword] = useState(false);
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false)

    useEffect(() => {
        const userData = JSON.parse(secureLocalStorage.getItem("userData"));
        if (userData?.customer_id && userData?.user_type) {
            navigate('/dashboard');
            toast.warning("You Are Already Logged In");
        }
    }, []);

    const handelLogin = event => {
        console.log("clicked");
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        const loginData = {
            "email": email,
            "password": password
        }

        axios.post(`${import.meta.env.VITE_API_URL}/login`, loginData)
            .then(response => {
                if (response.data.status === "success" && response.data.user_type === "admin") {
                    secureLocalStorage.setItem("userData", JSON.stringify(response.data));
                    toast.success("Successfully Logged In");
                    navigate('/dashboard');

                }
                if (response.data.status === "success" && response.data.user_type != "admin") {
                    toast.error("You Are Not Admin User");
                }
                if (response.data.status === "failed") {
                    toast.error(response.data.message);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    const handleSeePassword = () => {
        setSeePassword((current) => !current);
    }

    const handleButton = () => {
        setIsChecked(!isChecked)
    }

    // console.log(isChecked)


    return (
        <div className="bg-login">
            <Helmet>
                <title>Login - Ekka Dashboard</title>
            </Helmet>
            <div className="wrapper">
                <div className="section-authentication-signin d-flex align-items-center justify-content-center my-5 my-lg-0">
                    <div className="container-fluid">
                        <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
                            <div className="col mx-auto">
                                <div className="mb-4 text-center">
                                    <img src="assets/images/logo2.png" width="150" alt="" />
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="border p-4 rounded">
                                            <div className="text-center">
                                                <h3 className="">Sign in</h3>
                                                <p>Login Into Ekka Dashboard</p>
                                            </div>
                                            <div className="d-grid">
                                                   <a className="btn my-4 shadow-sm btn-white" href="javascript:;"> <span className="d-flex justify-content-center align-items-center">
                                                       <img className="me-2" src="assets/images/icons/search.svg" width="16" alt="Image Description"/>
                                                           <span>Sign in with Google</span>
                                                   </span>
                                                   </a> <a href="javascript:;" className="btn btn-facebook"><i className="bx bxl-facebook"></i>Sign in with Facebook</a>
                                               </div>
                                               <div className="login-separater text-center mb-4"> <span>OR SIGN IN WITH EMAIL</span>
                                                   <hr />
                                               </div>
                                            <div className="form-body">
                                                <form onSubmit={handelLogin} className="row g-3">
                                                    <div className="col-12">
                                                        <label htmlFor="inputEmailAddress" className="form-label">Email Address</label>
                                                        <input type="email" className="form-control" id="email" name='email' placeholder="Email Address" />
                                                    </div>
                                                    <div className="col-12">
                                                        <label htmlFor="inputChoosePassword" className="form-label">Enter Password</label>
                                                        <div className="input-group" id="show_hide_password">
                                                            <input type={seePassword ? "text" : "password"} className="form-control border-end-0" id="password" name='password' placeholder="Enter Password" /> <a onClick={handleSeePassword} className="input-group-text bg-transparent cursor-pointer"><i className={seePassword ? "bx bx-show" : "bx bx-hide"}></i></a>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-check form-switch">
                                                            <input checked={isChecked} className="form-check-input cursor-pointer" onChange={handleButton} type="checkbox" id="flexSwitchCheckChecked" />
                                                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Remember Me</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 text-end">	<a href="authentication-forgot-password.html">Forgot Password ?</a>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="d-grid">
                                                            <button type="submit" className="btn btn-primary"><i className="bx bxs-lock-open"></i>Sign in</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;