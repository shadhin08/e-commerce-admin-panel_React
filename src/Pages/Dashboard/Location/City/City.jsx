import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
// import DataTable from 'datatables.net-dt';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import Select from 'react-select'

const City = () => {
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const [division, setDivision] = useState();
    const [district, setDistrict] = useState();
    const navigate = useNavigate();

    // useEffect(() => {
    //     new DataTable('#cityTable');
    //     document.getElementById('cityTable_filter')?.classList?.add('mb-2');
    // });

    const { isLoading, data: city = [], refetch } = useQuery({
        queryKey: [],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/locations/get-all-city`,
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

    const handleState = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/locations/all-states`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => {
                setDivision(res.data)
            })
            .catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    secureLocalStorage.removeItem("userData");
                    navigate('/login');
                    toast.error('Token Invalid! Login Again')
                }
            })
    }

    const handleDivisionChange = (event) => {
        division?.map((division) => {
            if (division._id === event._id) {
                setDistrict(division.districts);
            }
        }
        )
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;
        const state_id = form.State.value
        const district_id = form.District.value

        if (state_id === 'false' || district_id === 'false' || !name) {
            return toast.error('All Data Not Added')
        }

        const cityData = {
            "name": name,
            "state_id": state_id,
            "district_id": district_id
        }

        axios.post(`${import.meta.env.VITE_API_URL}/locations/save-city`, cityData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('newCityModalClose').click()
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
    return (
        <div>
            <Helmet>
                <title>City - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">City</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Location</li>
                            <li className="breadcrumb-item active" aria-current="page">City</li>
                        </ol>
                    </nav>
                </div>
                <div className="ms-auto">
                    <div className="btn-group">
                        <button onClick={handleState} data-bs-toggle="modal" data-bs-target="#newCityModal" type="button" className="btn btn-primary rounded"><i className="bx bx-list-plus"></i>New City</button>
                        <div className="modal fade" id="newCityModal" tabIndex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New City</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form onSubmit={handleSubmit} className="row g-3">
                                        <div className="modal-body mx-2 mb-2">
                                            <div className="col-md-12 mb-2">
                                                <label htmlFor="Name" className="form-label">Name</label>
                                                <input type="text" placeholder='Enter Division Name' className="form-control" id="Name" name='Name' />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="Name" className="form-label">Division</label>
                                                <Select onChange={handleDivisionChange} required className="mb-3" isClearable id="State" name="State" placeholder="Select Division" options={division} getOptionLabel={(division) => division.name} getOptionValue={(division) => division._id} />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="Name" className="form-label">District</label>
                                                <Select onChange={handleDivisionChange} required className="mb-3" isClearable id="District" name="District" placeholder="Select District" options={district} getOptionLabel={(district) => district.name} getOptionValue={(district) => district.id} />
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-add'></i>Add City</button>
                                        </div>
                                    </form>
                                    <div className="modal-footer px-4">
                                        <button id='newCityModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="cityTable" className="table table-striped table-bordered border-top border-bottom">
                            <thead>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Name</th>
                                    <th>No. Of Area</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {city?.length <= 0 ? <tr>
                                    <td colSpan='4' className='text-center'>No data available in table</td>
                                    <td className='d-none'></td>
                                    <td className='d-none'></td>
                                    <td className='d-none'></td>
                                </tr> : <></>}
                                {city?.map((city, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{city?.name}</td>
                                        <td>{city?.area?.length}</td>
                                        <td>
                                            <Link to={`/dashboard/location/city/details/${city?._id}`} type="button" className="btn btn-outline-primary btn-sm me-1"><i className='bx bx-receipt'></i>Details</Link>
                                            <Link to={`/dashboard/location/city/setting/${city?._id}`} type="button" className="btn btn-outline-primary btn-sm"><i className='bx bx-slider'></i>Setting</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Name</th>
                                    <th>No. Of Area</th>
                                    <th>Action</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default City;