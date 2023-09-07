import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';

const CategorySetting = () => {
    const CategoryID = useParams();
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();

    const [subCategory, setSubCategory] = useState();

    const { isLoading, data: category = [], refetch } = useQuery({
        queryKey: [CategoryID?.id],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/categories/get-category/${CategoryID?.id}`,
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
        if (!isLoading && category.length <= 0) {
            toast.error('This Data Not Found')
            navigate('/dashboard/categories', { replace: true })
        }
    })

    const handleNameUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;

        const categoryUpdatedData = {
            "category_id": category?._id,
            "category_name": name
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/categories/update-category-name`, categoryUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Category Name Updated");
                    document.getElementById('categoryNameModalClose').click()
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
        axios.delete(`${import.meta.env.VITE_API_URL}/categories/delete-category/${category?._id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('deleteModalClose').click()
                    navigate('/dashboard/categories', { replace: true })
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

    const handleSubCategoryDelete = () => {
        axios.delete(`${import.meta.env.VITE_API_URL}/categories/delete-subcategory/${category?._id}/${subCategory?.id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('deleteModalClose3').click()
                    refetch();
                }
                if (response.data.status === "failed") {
                    toast.error(response.data.message);
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong");
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;

        const subcategoryData = {
            "category_id": category?._id,
            "name": name
        }

        axios.post(`${import.meta.env.VITE_API_URL}/categories/save-subcategory`, subcategoryData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('newsubcatModalClose').click()
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
                <title>Category Setting - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Category Setting</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard/categories">Categories</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Category Setting</li>
                        </ol>
                    </nav>
                </div>

                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#deleteConfermationModal" type="button" className="btn btn-danger rounded"><i className="bx bx-message-square-x"></i>Delete Category</button>
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

                <div className="modal fade" id="categoryNameModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Category Name</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleNameUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Name</label>
                                        <input type="text" defaultValue={category?.name} placeholder='Enter Category Name' className="form-control" id="Name" name='Name' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Category Name</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='categoryNameModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-9 mx-auto mt-3">
                    <h6 className="mb-0 text-uppercase">Update Brand Data</h6>
                    <hr />
                    <div className="card">
                        <div className="card-body">
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Name</span>
                                <input type="text" className="form-control" value={category?.name} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#categoryNameModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-9 mx-auto mt-3">
                    <div className='d-flex align-items-center justify-content-between'>
                        <h6 className="mb-0 text-uppercase">Add SubCategory</h6>
                        <div className="btn-group">
                            <button data-bs-toggle="modal" data-bs-target="#newsubModal" type="button" className="btn btn-primary rounded"><i className="bx bx-list-plus"></i>Add SubCategory</button>
                            <div className="modal fade" id="newsubModal" tabIndex="-1" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Add SubCategory</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <form onSubmit={handleSubmit} className="row g-3">
                                            <div className="modal-body mx-2 mb-2">
                                                <div className="col-md-12 mb-2">
                                                    <label htmlFor="Name" className="form-label">Name</label>
                                                    <input type="text" placeholder='Enter Category Name' className="form-control" id="Name" name='Name' />
                                                </div>
                                                <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-add'></i>Add SubCategory</button>
                                            </div>
                                        </form>
                                        <div className="modal-footer px-4">
                                            <button id='newsubcatModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ms-auto">
                                <div className="btn-group">
                                    <div className="modal fade" tabIndex="-1" id="deleteConfermationModal3" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Delete Confermation</h5>
                                                    <button id='deleteModalClose3' type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <p>Are you sure you want to delete?</p>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                                    <button onClick={handleSubCategoryDelete} type="button" className="btn btn-danger">Yes, Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />

                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table id="dealsTable" className="table table-striped table-bordered border-top border-bottom">
                                    <thead>
                                        <tr>
                                            <th>SL No.</th>
                                            <th>Name</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {category?.subcategories?.length == 0 ? <tr>
                                            <td colSpan='3' className='text-center'>No data available in table</td>
                                            <td className='d-none'></td>
                                            <td className='d-none'></td>
                                        </tr> : <></>}
                                        {category?.subcategories?.map((subcategory, index) =>
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className='text-capitalize'>{subcategory?.name}</td>
                                                <td>
                                                    {/* <button onClick={() => { setPriorityArea(area); handleDistrictChange({ id: area?.district }, area?.city); }} data-bs-toggle="modal" data-bs-target="#editAreaModal" type="button" className="btn btn-outline-primary btn-sm me-1"><i className='bx bx-slider'></i>Edit</button> */}
                                                    <button onClick={() => setSubCategory(subcategory)} data-bs-toggle="modal" data-bs-target="#deleteConfermationModal3" type="button" className="btn btn-outline-danger btn-sm"><i className='bx bx-slider'></i>Delete</button>
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
            </div>

        </div>
    );
};

export default CategorySetting;