import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DataTable from 'datatables.net-dt';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';

const CityDetails = () => {
    const CityID = useParams();
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const [areaDetails, setAreaDetails] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        new DataTable('#areaTable');
        document.getElementById('areaTable_filter')?.classList?.add('mb-2');
    });

    const { isLoading, data: area = [], refetch } = useQuery({
        queryKey: [],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/locations/get-area/${CityID?.id}`,
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;

        if (!name) {
            return toast.error('Data Not Added')
        }

        const areaData = {
            "city_id": CityID?.id,
            "name": name
        }

        axios.post(`${import.meta.env.VITE_API_URL}/locations/add-area`, areaData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('newAreaModalClose').click()
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

    const handleUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;

        if (name === areaDetails?.name) {
            return toast.error("Name Not Changed")
        }

        const areaUpdatedData = {
            "city_id": CityID?.id,
            "area_id": areaDetails?.id,
            "new_name": name
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/locations/update-area`, areaUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Area Name Updated");
                    document.getElementById('newAreaEditModalClose').click()
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
        axios.delete(`${import.meta.env.VITE_API_URL}/locations/delete-area/${CityID?.id}/${areaDetails?.id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('deleteModalClose').click()
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
                <title>City Details - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">City Details</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Location</li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard/location/city">City</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">City Details (All Area)</li>
                        </ol>
                    </nav>
                </div>
                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#newAreaModal" type="button" className="btn btn-primary rounded"><i className="bx bx-list-plus"></i>New Area</button>
                        <div className="modal fade" id="newAreaModal" tabIndex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Area</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form onSubmit={handleSubmit} className="row g-3">
                                        <div className="modal-body mx-2 mb-2">
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="Name" className="form-label">Name</label>
                                                <input type="text" placeholder='Enter Area Name' className="form-control" id="Name" name='Name' />
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-add'></i>Add Area</button>
                                        </div>
                                    </form>
                                    <div className="modal-footer px-4">
                                        <button id='newAreaModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal fade" id="newAreaEditModal" tabIndex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Area</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form onSubmit={handleUpdate} className="row g-3">
                                        <div className="modal-body mx-2 mb-2">
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="Name" className="form-label">Name</label>
                                                <input type="text" defaultValue={areaDetails?.name} placeholder='Enter Area Name' className="form-control" id="Name" name='Name' />
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-add'></i>Update Area</button>
                                        </div>
                                    </form>
                                    <div className="modal-footer px-4">
                                        <button id='newAreaEditModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ms-auto">
                            <div className="btn-group">
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
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="areaTable" className="table table-striped table-bordered border-top border-bottom">
                            <thead>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {area?.length <= 0 ? <tr>
                                    <td colSpan='4' className='text-center'>No data available in table</td>
                                    <td className='d-none'></td>
                                    <td className='d-none'></td>
                                </tr> : <></>}
                                {area?.map((area, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{area?.name}</td>
                                        <td>
                                            <button onClick={() => setAreaDetails(area)} data-bs-toggle="modal" data-bs-target="#newAreaEditModal" type="button" className="btn btn-outline-primary btn-sm me-1"><i className='bx bx-receipt'></i>Edit</button>
                                            <button onClick={() => setAreaDetails(area)} data-bs-toggle="modal" data-bs-target="#deleteConfermationModal" type="button" className="btn btn-outline-danger btn-sm"><i className='bx bx-slider'></i>Delete</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Name</th>
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

export default CityDetails;