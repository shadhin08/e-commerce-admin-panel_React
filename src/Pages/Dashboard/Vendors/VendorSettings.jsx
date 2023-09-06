import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';

const VendorSettings = () => {

    const VendorID = useParams();
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();

    const { isLoading, data: vendorObj = [], refetch } = useQuery({
        queryKey: [VendorID?.id],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/vendor/get-vendor-details/${VendorID?.id}`,
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

    const vendor=vendorObj&&vendorObj[0];
    useEffect(() => {
        if (!isLoading && vendor.length <= 0) {
            toast.error('This Data Not Found')
            navigate('/dashboard/vendors', { replace: true })
        }
    })

    const handleDelete = () => {
        // console.log(vendor._id);
        // axios.delete(`${import.meta.env.VITE_API_URL}/vendor/delete-vendor/${vendor?._id}`,
        //     {
        //         headers: {
        //             authorization: `Bearer ${userData?.user_token}`
        //         }
        //     })
        //     .then(response => {
        //         // console.log(response)
        //         if (response.data.status === "success") {
        //             toast.success(response.data.message);
        //             document.getElementById('deleteModalClose').click()
        //             navigate('/dashboard/vendors', { replace: true })
        //             refetch();
        //         }
        //         if (response.data.status === "failed") {
        //             toast.error(response.data.message);
        //         }
        //     })
        //     .catch(error => {
        //         console.error(error);
        //         toast.error("Something Went To Wrong");
        //     });
    }

    const handleNameUpdate = (event) => {
        event.preventDefault();
        console.log("Name update");
        const form = event.target;
        const name = form.Name.value;

        // //console.log(email);
        const vendorUpdatedData = {
            "vendor_id": vendor?._id,
            "name": name
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/vendor/update-vendor/${vendor?._id}`, vendorUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                //console.log(response)
                if (response.statusText === "OK") {
                    toast.success("Vendor Name Updated");
                    document.getElementById('vendorNameModalClose').click()
                    refetch();
                    form.reset();
                }
                else {
                    toast.error(response.statusText);
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong");
            });
    }

    const handleContactUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const contact = form.contact.value;

        const vendorUpdatedData = {
            "vendor_id": vendor?._id,
            "contact_no": contact
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/vendor/update-vendor/${vendor?._id}`, vendorUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.statusText === "OK") {
                    toast.success("Vendor Contact No. Updated");
                    document.getElementById('vendorContactModalClose').click()
                    refetch();
                    form.reset();
                }
                else {
                    toast.error(response.statusText);
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong");
            });
    }

    const handleEmailUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;

        const vendorUpdatedData = {
            "vendor_id": vendor?._id,
            "email": email
        }

        //console.log(email);
        axios.patch(`${import.meta.env.VITE_API_URL}/vendor/update-vendor/${vendor?._id}`, vendorUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.statusText === "OK") {
                    toast.success("Vendor Email Updated");
                    document.getElementById('vendorEmailModalClose').click()
                    refetch();
                    form.reset();
                }
                else {
                    toast.error(response.statusText);
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong");
            });
    }

    const handleAddressUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const address = form.address.value;

        const vendorUpdatedData = {
            "vendor_id": vendor?._id,
            "address": address
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/vendor/update-vendor/${vendor?._id}`, vendorUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.statusText === "OK") {
                    toast.success("Vendor Address Updated");
                    document.getElementById('vendorAddressModalClose').click()
                    refetch();
                    form.reset();
                }
                else {
                    toast.error(response.statusText);
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
                <title>Vendor Setting - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Vandor Setting</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard/vendors">Vendors</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Vendors Setting</li>
                        </ol>
                    </nav>
                </div>

                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#deleteConfermationModal" type="button" className="btn btn-danger rounded"><i className="bx bx-message-square-x"></i>Delete Vandor</button>
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

                <div className="modal fade" id="vendorNameModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Vendor Name</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleNameUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Name</label>
                                        <input type="text" defaultValue={vendor?.name} placeholder='Enter Vendor Name' className="form-control text-capitalize" id="Name" name='Name' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Vendor Name</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='vendorNameModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="vendorContactModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Vendor Contact</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleContactUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Contact</label>
                                        <input type="text" defaultValue={vendor?.contact_no} placeholder='Enter Vendor Name' className="form-control text-capitalize" id="contact" name='contact' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Vendor Contact</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='vendorContactModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="vendorEmailModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Vendor Email</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleEmailUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Email</label>
                                        <input type="text" defaultValue={vendor?.email} placeholder='Enter Vendor Name' className="form-control text-capitalize" id="email" name='email' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Vendor Email</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='vendorEmailModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="vendorAddressModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Vendor Address</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleAddressUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Address</label>
                                        <input type="text" defaultValue={vendor?.address} placeholder='Enter Vendor Name' className="form-control text-capitalize" id="address" name='address' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Vendor Address</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='vendorAddressModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="row">
                <div className="col-xl-9 mx-auto mt-3">
                    <h6 className="mb-0 text-uppercase">Update Vendor Data</h6>
                    <hr />
                    <div className="card">
                        <div className="card-body">
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Name</span>
                                <input type="text" className="form-control text-capitalize" value={vendor?.name} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#vendorNameModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Contact No.</span>
                                <input type="text" className="form-control text-capitalize" value={vendor?.contact_no} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#vendorContactModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Email</span>
                                <input type="text" className="form-control text-capitalize" value={vendor?.email ? vendor?.email : 'Not Added'} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#vendorEmailModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Address</span>
                                <input type="text" className="form-control text-capitalize" value={vendor?.address} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#vendorAddressModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorSettings;