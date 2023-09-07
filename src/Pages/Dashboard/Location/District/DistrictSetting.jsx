import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import Select from 'react-select'

const DistrictSetting = () => {
    const DistrictID = useParams();
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();
    const [Alldivision, setAllDivision] = useState();
    const [division, setDivision] = useState();

    const { isLoading, data: district = [], refetch } = useQuery({
        queryKey: [DistrictID?.id],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/locations/get-district/${DistrictID?.id}`,
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
        if (!isLoading && district.length <= 0) {
            toast.error('This Data Not Found')
            navigate('/dashboard/location/district', { replace: true });
        }
    })

    const handleDivision = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/locations/get-states/${district?.state}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => setDivision(res.data))
            .catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    secureLocalStorage.removeItem("userData");
                    navigate('/login');
                    toast.error('Token Invalid! Login Again')
                }
            })
    }

    useEffect(() => {
        handleDivision();
    }, [district?.state])

    const handleNameUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;

        const districtUpdatedData = {
            "district_id": district?._id,
            "new_name": name
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/locations/update-district`, districtUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("District Name Updated");
                    document.getElementById('districtNameModalClose').click()
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

    const handleStateUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const state = form.State.value;

        if (state === division?._id) {
            return toast.error("Division Not Changed")
        }

        const districtUpdatedData = {
            "district_id": district?._id,
            "state_id": state
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/locations/update-district`, districtUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("District Division Updated");
                    document.getElementById('districtDivisionModalClose').click()
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
        axios.delete(`${import.meta.env.VITE_API_URL}/locations/delete-district/${district?._id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('deleteModalClose').click()
                    navigate('/dashboard/location/district', { replace: true })
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

    const handleState = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/locations/all-states`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => {
                setAllDivision(res.data)
            })
            .catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    secureLocalStorage.removeItem("userData");
                    navigate('/login');
                    toast.error('Token Invalid! Login Again')
                }
            })
    }

    return (
        <div>
            <Helmet>
                <title>District Setting - Ekka Dashboard</title>
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">District Setting</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Location</li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard/location/district">District</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">District Setting</li>
                        </ol>
                    </nav>
                </div>

                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#deleteConfermationModal" type="button" className="btn btn-danger rounded"><i className="bx bx-message-square-x"></i>Delete District</button>
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

                <div className="modal fade" id="districtNameModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit District Name</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleNameUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Name</label>
                                        <input type="text" defaultValue={district?.name} placeholder='Enter Division Name' className="form-control" id="Name" name='Name' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update District Name</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='districtNameModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="districtDivisionModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit District Division</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleStateUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Division</label>
                                        {division && <Select required className="mb-3" isClearable id="State" name="State" placeholder="Select Division" options={Alldivision} getOptionLabel={(division) => division.name} getOptionValue={(division) => division._id} defaultValue={{ _id: division?._id, name: division?.name }} />}
                                        {!division && <Select required className="mb-3" isClearable id="State" name="State" placeholder="Select Division" options={Alldivision} getOptionLabel={(division) => division.name} getOptionValue={(division) => division._id} />}
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Division State</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='districtDivisionModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-9 mx-auto mt-3">
                    <h6 className="mb-0 text-uppercase">Update District Data</h6>
                    <hr />
                    <div className="card">
                        <div className="card-body">
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Name</span>
                                <input type="text" className="form-control" value={district?.name} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#districtNameModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Division</span>
                                <input type="text" className="form-control" value={division?.name ? division?.name : "Not Added"} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button onClick={handleState} data-bs-toggle="modal" data-bs-target="#districtDivisionModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DistrictSetting;