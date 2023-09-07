import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/jquery.dataTables.css';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

const Categories = () => {
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();
    // useEffect(() => {
    //     new DataTable('#catagoriesTable');
    //     document.getElementById('catagoriesTable_filter')?.classList?.add('mb-2');
    // });

    const { isLoading, data: categories = [], refetch } = useQuery({
        queryKey: [],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/categories/all-categories`,
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

        const cayegoryData = {
            "category_name": name
        }

        axios.post(`${import.meta.env.VITE_API_URL}/categories/save-category`, cayegoryData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('newCategoryModalClose').click()
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
                <title>Categories - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Categoties</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Categoties</li>
                        </ol>
                    </nav>
                </div>
                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#newCategoryModal" type="button" className="btn btn-primary rounded"><i className="bx bx-list-plus"></i>New Category</button>
                        <div className="modal fade" id="newCategoryModal" tabIndex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Category</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form onSubmit={handleSubmit} className="row g-3">
                                        <div className="modal-body mx-2 mb-2">
                                            <div className="col-md-12 mb-2">
                                                <label htmlFor="Name" className="form-label">Name</label>
                                                <input type="text" placeholder='Enter Category Name' className="form-control" id="Name" name='Name' />
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-add'></i>Add Category</button>
                                        </div>
                                    </form>
                                    <div className="modal-footer px-4">
                                        <button id='newCategoryModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
                        <table id="catagoriesTable" className="table table-striped table-bordered border-top border-bottom">
                            <thead>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories?.length <= 0 ? <tr>
                                    <td colSpan='3' className='text-center'>No data available in table</td>
                                    <td className='d-none'></td>
                                    <td className='d-none'></td>
                                </tr> : <></>}
                                {categories?.map((category, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{category?.name}</td>
                                        <td>
                                            <button type="button" className="btn btn-outline-primary btn-sm me-1"><i className='bx bx-receipt'></i>Details</button>
                                            <Link to={`/dashboard/categories/setting/${category?._id}`} type="button" className="btn btn-outline-primary btn-sm"><i className='bx bx-slider'></i>Setting</Link>
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

export default Categories;