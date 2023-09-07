import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';

const UsersSetting = () => {

    const UsersID = useParams();
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();

    const { isLoading, data: user = [], refetch } = useQuery({
        queryKey: [UsersID?.id],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/user/user-detail-by-id/${UsersID?.id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => res.data)
            .catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    secureLocalStorage.removeItem("userData");
                    navigate('/login');
                    toast.error('Token Invalid! Login Again')
                }
            })
    })

    const handleDelete = () => {
        axios.delete(`${import.meta.env.VITE_API_URL}/user/delete-user/${user?._id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.statusText === "OK") {
                    toast.success("User Deleted Successfully");
                    document.getElementById('deleteModalClose').click()
                    navigate('/dashboard/users', { replace: true })
                    refetch();
                }
                else {
                    toast.error("Delete Operation Failed");
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong");
            });
    }

    const handleNameUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;

        const userUpdatedData = {
            "user_id": user?._id,
            "name": name
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/user/update-user/${user?._id}`, userUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                console.log(response);
                if (response.statusText === "OK") {
                    toast.success("User Name Updated");
                    document.getElementById('userNameModalClose').click()
                    refetch();
                    form.reset();
                }
                else {
                    toast.error(response.statusText);
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong");
            });
    }

    const handleContactUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const contact = form.contact.value;

        const userUpdatedData = {
            "user_id": user?._id,
            "contact_no": contact
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/user/update-user/${user?._id}`, userUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {

                if (response.statusText === "OK") {
                    toast.success("Customer Contact No. Updated");
                    document.getElementById('userContactModalClose').click()
                    refetch();
                    form.reset();
                }
                else {
                    toast.error(response.data.message);
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong");
            });
    }

    const handleEmailUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;

        const userUpdatedData = {
            "user_id": user?._id,
            "email": email.toLowerCase()
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/user/update-user/${user?._id}`, userUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.statusText === "OK") {
                    toast.success("Customer Email Updated");
                    document.getElementById('userEmailModalClose').click()
                    refetch();
                    form.reset();
                }
                else {
                    toast.error(response.data.message);
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong");
            });
    }

    const handleUserTypeUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const userType = form.userType.value;

        const userUpdatedData = {
            "user_id": user?._id,
            "user_type": userType
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/user/update-user/${user?._id}`, userUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.statusText === "OK") {
                    toast.success("Customer Address Updated");
                    document.getElementById('userTypeModalClose').click()
                    refetch();
                    form.reset();
                }
                else {
                    toast.error(response.data.message);
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong");
            });
    }

    return (
        <div>
            <Helmet>
                <title>User Setting - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">User Setting</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard/users">User</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">User Setting</li>
                        </ol>
                    </nav>
                </div>

                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#deleteConfermationModal" type="button" className="btn btn-danger rounded"><i className="bx bx-message-square-x"></i>Delete User</button>
                        <div className="modal fade" tabIndex="-1" id="deleteConfermationModal" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Delete Confermation</h5>
                                        <button id='deleteModalClose' type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Are you sure you want to delete?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                        <button onClick={handleDelete} type="button" className="btn btn-danger">Yes, Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="userNameModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit user Name</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleNameUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Name</label>
                                        <input type="text" defaultValue={user?.name} placeholder='Enter user Name' className="form-control text-capitalize" id="Name" name='Name' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update user Name</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='userNameModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="userContactModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit user Contact</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleContactUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Contact</label>
                                        <input type="text" defaultValue={user?.contact_no} placeholder='Enter user Contact' className="form-control text-capitalize" id="contact" name='contact' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update user Contact</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='userContactModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="userEmailModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit user Email</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleEmailUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Email</label>
                                        <input type="text" defaultValue={user?.email} placeholder='Enter user Email' className="form-control text-capitalize" id="email" name='email' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update user Email</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='userEmailModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="userTypeModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit user Type</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleUserTypeUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">User-Type</label>
                                        <input type="text" defaultValue={user?.user_type} placeholder='Enter User-Type' className="form-control text-capitalize" id="userType" name='userType' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update User-Type</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='userTypeModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="row">
                <div className="col-xl-9 mx-auto mt-3">
                    <h6 className="mb-0 text-uppercase">Update User Data</h6>
                    <hr />
                    <div className="card">
                        <div className="card-body">
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Name</span>
                                <input type="text" className="form-control text-capitalize" value={user?.name} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#userNameModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Contact No.</span>
                                <input type="text" className="form-control text-capitalize" value={user?.contact_no} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#userContactModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Email</span>
                                <input type="text" className="form-control text-capitalize" value={user?.email ? user?.email : 'Not Added'} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#userEmailModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">User-Type</span>
                                <input type="text" className="form-control text-capitalize" value={user?.user_type} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#userTypeModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersSetting;