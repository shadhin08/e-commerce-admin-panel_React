import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'datatables.net-dt/css/jquery.dataTables.css';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { useQuery } from '@tanstack/react-query';
import DataTable from 'datatables.net-dt';

const DealsType = () => {
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const [typeDetails, setTypeDetails] = useState();
    const { isLoading, data: dealsType = [], refetch } = useQuery({
        queryKey: [],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/deals/get-all-types`,
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
        new DataTable('#typeTable');
        document.getElementById('typeTable_filter')?.classList?.add('mb-2');
    }, [dealsType]);

    const handleTypeDelete = () => {
        axios.delete(`${import.meta.env.VITE_API_URL}/deals/delete-types/${typeDetails?._id}`,
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;
        const description = form.Description.value;

        const typeData = {
            "name": name,
            "description": description
        }

        axios.post(`${import.meta.env.VITE_API_URL}/deals/save-types`, typeData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('newTypeModalClose').click()
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
        const description = form.Description.value;

        const typeData = {
            "deal_types_id": typeDetails?._id,
            "name": name,
            "description": description
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/deals/update-types`, typeData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('newTypeModalEditClose').click()
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
                <title>Deals Types - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Deals Types</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Deals</li>
                            <li className="breadcrumb-item active" aria-current="page">Deals Types</li>
                        </ol>
                    </nav>
                </div>

                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#newTypeModal" type="button" className="btn btn-primary rounded"><i className="bx bx-list-plus"></i>New Type</button>
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
                                        <button onClick={handleTypeDelete} type="button" className="btn btn-danger">Yes, Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="newTypeModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Type</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleSubmit} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Name</label>
                                        <input required type="text" placeholder='Enter Type Name' className="form-control" id="Name" name='Name' />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Description</label>
                                        <textarea required type="textarea" placeholder='Enter Type Description' className="form-control" id="Description" name='Description' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-add'></i>Add Type</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='newTypeModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="newTypeEditModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Type</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Name</label>
                                        <input required type="text" defaultValue={typeDetails?.name} placeholder='Enter Type Name' className="form-control" id="Name" name='Name' />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Description</label>
                                        <textarea defaultValue={typeDetails?.description} required type="textarea" placeholder='Enter Type Description' className="form-control" id="Description" name='Description' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Edit Type</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='newTypeModalEditClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <table id="typeTable" className="table table-striped table-bordered border-top border-bottom">
                        <thead>
                            <tr>
                                <th>SL No.</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dealsType?.length <= 0 ? <tr>
                                <td colSpan='4' className='text-center'>No data available in table</td>
                                <td className='d-none'></td>
                                <td className='d-none'></td>
                                <td className='d-none'></td>
                            </tr> : <></>}
                            {dealsType?.map((type, index) =>
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{type?.name}</td>
                                    <td>{type?.description}</td>
                                    <td>
                                        <button onClick={() => setTypeDetails(type)} data-bs-toggle="modal" data-bs-target="#newTypeEditModal" type="button" className="btn btn-outline-primary btn-sm me-1 mb-1"><i className='bx bx-message-square-edit'></i>Edit</button>
                                        <button onClick={() => setTypeDetails(type)} data-bs-toggle="modal" data-bs-target="#deleteConfermationModal" type="button" className="btn btn-outline-danger btn-sm mb-1 d-flex align-items-center "><i className='bx bx-message-square-x'></i>Delete</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>SL No.</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DealsType;