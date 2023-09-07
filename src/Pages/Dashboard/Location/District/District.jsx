import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
// import DataTable from 'datatables.net-dt';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import Select from 'react-select'

const District = () => {
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const [division, setDivision] = useState();
    const navigate = useNavigate();

    // useEffect(() => {
    //     new DataTable('#districtTable');
    //     document.getElementById('districtTable_filter')?.classList?.add('mb-2');
    // });

    const { isLoading, data: district = [], refetch } = useQuery({
        queryKey: [],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/locations/get-all-district`,
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;
        const state_id = form.State.value

        if (state_id === 'false') {
            return toast.error('Please Select Division')
        }

        const districtData = {
            "name": name,
            "state_id": state_id
        }

        console.log(districtData)

        axios.post(`${import.meta.env.VITE_API_URL}/locations/save-district`, districtData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('newDistrictModalClose').click()
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
                <title>District - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">District</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Location</li>
                            <li className="breadcrumb-item active" aria-current="page">District</li>
                        </ol>
                    </nav>
                </div>
                <div className="ms-auto">
                    <div className="btn-group">
                        <button onClick={handleState} data-bs-toggle="modal" data-bs-target="#newDistrictnModal" type="button" className="btn btn-primary rounded"><i className="bx bx-list-plus"></i>New District</button>
                        <div className="modal fade" id="newDistrictnModal" tabIndex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New District</h5>
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
                                                <Select isClearable className="mb-3" id="State" name="State" placeholder="Select Division" options={division} getOptionLabel={(division) => division.name} getOptionValue={(division) => division._id} />
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-add'></i>Add Division</button>
                                        </div>
                                    </form>
                                    <div className="modal-footer px-4">
                                        <button id='newDistrictModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
                        <table id="districtTable" className="table table-striped table-bordered border-top border-bottom">
                            <thead>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Name</th>
                                    <th>No. Of Cities</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {district?.length <= 0 ? <tr>
                                    <td colSpan='4' className='text-center'>No data available in table</td>
                                    <td className='d-none'></td>
                                    <td className='d-none'></td>
                                    <td className='d-none'></td>
                                </tr> : <></>}
                                {district?.map((district, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{district?.name}</td>
                                        <td>{district?.cities?.length}</td>
                                        <td>
                                            <Link to={`/dashboard/location/district/setting/${district?._id}`} type="button" className="btn btn-outline-primary btn-sm"><i className='bx bx-slider'></i>Setting</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Name</th>
                                    <th>No. Of Cities</th>
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

export default District;