import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';

const DivisionSetting = () => {
    const DivisionID = useParams();
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();

    const { isLoading, data: division = [], refetch } = useQuery({
        queryKey: [DivisionID?.id],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/locations/get-states/${DivisionID?.id}`,
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

    useEffect(() => {
        if (!isLoading && division.length <= 0) {
            toast.error('This Data Not Found')
            navigate('/dashboard/location/division', { replace: true });
        }
    })

    const handleNameUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;

        const divisionUpdatedData = {
            "state_id": division?._id,
            "new_name": name
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/locations/update-state`, divisionUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Division Name Updated");
                    document.getElementById('divisionNameModalClose').click()
                    refetch();
                    form.reset();
                }
                if (response.data.status === "failed") {
                    toast.error(response.data.message);
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong");
            });
    }

    const handleDelete = () => {
        axios.delete(`${import.meta.env.VITE_API_URL}/locations/delete-state/${division?._id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('deleteModalClose').click()
                    navigate('/dashboard/location/division', { replace: true })
                    refetch();
                }
                if (response.data.status === "failed") {
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
                <title>Division Setting - Ekka Dashboard</title>
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Division Setting</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Location</li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard/location/division">Division</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Division Setting</li>
                        </ol>
                    </nav>
                </div>

                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#deleteConfermationModal" type="button" className="btn btn-danger rounded"><i className="bx bx-message-square-x"></i>Delete Division</button>
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

                <div className="modal fade" id="divisionNameModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Division Name</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleNameUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Name</label>
                                        <input type="text" defaultValue={division?.name} placeholder='Enter Division Name' className="form-control" id="Name" name='Name' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Division Name</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='divisionNameModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-9 mx-auto mt-3">
                    <h6 className="mb-0 text-uppercase">Update Division Data</h6>
                    <hr />
                    <div className="card">
                        <div className="card-body">
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Name</span>
                                <input type="text" className="form-control" value={division?.name} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#divisionNameModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DivisionSetting;