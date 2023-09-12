import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';

import { PhotoProvider, PhotoView } from 'react-photo-view';

const BrandSetting = () => {
    const BrandID = useParams();
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();

    const { isLoading, data: brand = [], refetch } = useQuery({
        queryKey: [BrandID?.id],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/brand/get-brand/${BrandID?.id}`,
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
        if (!isLoading && brand.length <= 0) {
            toast.error('This Data Not Found')
            navigate('/dashboard/brands', { replace: true })
        }
    })

    const handleDelete = () => {
        axios.delete(`${import.meta.env.VITE_API_URL}/brand/delete-brand/${brand?._id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('deleteModalClose').click()
                    navigate('/dashboard/brands', { replace: true })
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

    const handleNameUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;

        const brandUpdatedData = {
            "brand_id": brand?._id,
            "brand_name": name.toLowerCase()
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/brand/update-brand`, brandUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Brand Name Updated");
                    document.getElementById('brandNameModalClose').click()
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
    const handleLogoUpdate = (event) => {
        event.preventDefault();
        const form = event.target;

        const formData = new FormData()
        const image = form.brand_logo.files[0]
        formData.append("brand_logo", image)
        formData.append("brand_id", BrandID?.id)

        // console.log("logo update");
        axios.patch(`${import.meta.env.VITE_API_URL}/brand/update-brand`, formData,
        {
            headers: {
                authorization: `Bearer ${userData?.user_token}`
            }
        })
        .then(response => {
            if (response.data.status === "success") {
                toast.success("Brand Logo Updated");
                document.getElementById('brandLogoModalClose').click()
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
        <PhotoProvider>
        <div>
            <Helmet>
                <title>Brand Setting - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Brand Setting</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard/brands">Brands</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Brand Setting</li>
                        </ol>
                    </nav>
                </div>

                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#deleteConfermationModal" type="button" className="btn btn-danger rounded"><i className="bx bx-message-square-x"></i>Delete Brand</button>
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

                <div className="modal fade" id="brandNameModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Brand Name</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleNameUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Name</label>
                                        <input type="text" defaultValue={brand?.name} placeholder='Enter Brand Name' className="form-control text-capitalize" id="Name" name='Name' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Brand Name</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='brandNameModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="brandLogoModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Brand Logo</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleLogoUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="brand_logo" className="form-label">Brand Logo</label>
                                        <input required className="form-control" type="file" accept=".png, .jpg" id="brand_logo" name="brand_logo" />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Brand Logo</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='brandLogoModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
                                <input type="text" className="form-control text-capitalize" value={brand?.name} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#brandNameModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group"> <span className="input-group-text" id="basic-addon1">Brand Image</span>
                                <PhotoView key={brand?.name} src={`${import.meta.env.VITE_API_URL}/${brand?.brand_logo}`}><img className='cursor-pointer' width="36" alt={brand?.name} src={`${import.meta.env.VITE_API_URL}/${brand?.brand_logo}`}></img></PhotoView>
                                <input type="text" className="form-control" value={brand?.brand_logo} disabled aria-label="Contact" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#brandLogoModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </PhotoProvider>
    );
};

export default BrandSetting;