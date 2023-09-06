import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import Select from 'react-select'


const CitySetting = () => {
    const CityID = useParams();
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();
    const [Alldivision, setAllDivision] = useState();
    const [division, setDivision] = useState();
    const [district, setDistrict] = useState(false);

    const { isLoading, data: city = [], refetch } = useQuery({
        queryKey: [CityID?.id],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/locations/get-city/${CityID?.id}`,
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
        if (!isLoading && city.length <= 0) {
            toast.error('This Data Not Found')
            navigate('/dashboard/location/city', { replace: true });
        }
    })

    const handleDivisionAndDistrict = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/locations/get-states/${city?.state}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => {
                setDivision(res.data)
                res.data?.districts?.map((element) => {
                    if (element.id === city?.district) {
                        setDistrict(element)
                    }
                })
            })
            .catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    secureLocalStorage.removeItem("userData");
                    navigate('/login');
                    toast.error('Token Invalid! Login Again')
                }
            })
    }

    useEffect(() => {
        handleDivisionAndDistrict();
        setDistrict(false)
    }, [city?.state, city?.district])

    const handleNameUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;

        const cityUpdatedData = {
            "city_id": city?._id,
            "new_name": name
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/locations/update-city`, cityUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("City Name Updated");
                    document.getElementById('cityNameModalClose').click()
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

        const cityUpdatedData = {
            "city_id": city?._id,
            "state_id": state
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/locations/update-city`, cityUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("City Division Updated");
                    document.getElementById('cityDivisionModalClose').click()
                    document.getElementById('cityDistrictnDivisionModalOpen').click()
                    toast.warning("Please, Add New District Now")
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

    const handleDistrictUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const district = form.District.value;

        if (district === city?.district) {
            return toast.error("District Not Changed")
        }

        const cityUpdatedData = {
            "city_id": city?._id,
            "district_id": district
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/locations/update-city`, cityUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("City District Updated");
                    document.getElementById('cityDistrictModalClose').click()
                    document.getElementById('cityDistrictDivisionModalClose').click()
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
        axios.delete(`${import.meta.env.VITE_API_URL}/locations/delete-city/${city?._id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('deleteModalClose').click()
                    navigate('/dashboard/location/city', { replace: true })
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
                <title>City Setting - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
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
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard/location/city">City</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">City Setting</li>
                        </ol>
                    </nav>
                </div>

                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#deleteConfermationModal" type="button" className="btn btn-danger rounded"><i className="bx bx-message-square-x"></i>Delete City</button>
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

                <div className="modal fade" id="cityNameModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit City Name</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleNameUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Name</label>
                                        <input type="text" defaultValue={city?.name} placeholder='Enter City Name' className="form-control" id="Name" name='Name' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update District Name</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='cityNameModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="cityDivisionModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit City Division</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleStateUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Division</label>
                                        {division && <Select required className="mb-3" isClearable id="State" name="State" placeholder="Select Division" options={Alldivision} getOptionLabel={(division) => division.name} getOptionValue={(division) => division._id} defaultValue={{ _id: division?._id, name: division?.name }} />}
                                        {!division && <Select required className="mb-3" isClearable id="State" name="State" placeholder="Select Division" options={Alldivision} getOptionLabel={(division) => division.name} getOptionValue={(division) => division._id} />}
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update City Division</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='cityDivisionModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="cityDistrictnModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit City District</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleDistrictUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">District</label>
                                        {district && <Select required className="mb-3" isClearable id="District" name="District" placeholder="Select District" options={division?.districts} getOptionLabel={(district) => district.name} getOptionValue={(district) => district.id} defaultValue={{ id: district.id, name: district?.name }} />}
                                        {!district && <Select required className="mb-3" isClearable id="District" name="District" placeholder="Select District" options={division?.districts} getOptionLabel={(district) => district.name} getOptionValue={(district) => district.id} />}
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update City District</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='cityDistrictModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" data-bs-backdrop='static' id="cityDistrictnDivisionModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New District</h5>
                            </div>
                            <form onSubmit={handleDistrictUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">District</label>
                                        <Select required className="mb-3" isClearable id="District" name="District" placeholder="Select District" options={division?.districts} getOptionLabel={(district) => district.name} getOptionValue={(district) => district.id} />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update City District</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4 d-none">
                                <button id='cityDistrictDivisionModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-9 mx-auto mt-3">
                    <h6 className="mb-0 text-uppercase">Update City Data</h6>
                    <hr />
                    <div className="card">
                        <div className="card-body">
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Name</span>
                                <input type="text" className="form-control" value={city?.name} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#cityNameModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Division</span>
                                <input type="text" className="form-control" value={division?.name ? division?.name : "Not Added"} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button onClick={handleState} data-bs-toggle="modal" data-bs-target="#cityDivisionModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">District</span>
                                <input type="text" className="form-control" value={district ? district.name : "Not Added"} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button onClick={handleState} data-bs-toggle="modal" data-bs-target="#cityDistrictnModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <button id='cityDistrictnDivisionModalOpen' onClick={handleState} data-bs-toggle="modal" data-bs-target="#cityDistrictnDivisionModal" className='btn d-none '><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitySetting;