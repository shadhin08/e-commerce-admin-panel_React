import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';

const CustomerSettings = () => {
    const CustomerID = useParams();
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();

    const { isLoading, data: customer = [], refetch } = useQuery({
        queryKey: [CustomerID?.id],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/customres/get-customer-by-id/${CustomerID?.id}`,
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

    // console.log(customer, CustomerID?.id);
    useEffect(() => {
        if (!isLoading && customer.length <= 0) {
            toast.error('This Data Not Found')
            navigate('/dashboard/customers', { replace: true })
        }
    })

    const handleDelete = () => {
        // console.log(customer._id);
        axios.delete(`${import.meta.env.VITE_API_URL}/customer/delete-customer/${customer?._id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                // console.log(response)
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('deleteModalClose').click()
                    navigate('/dashboard/customers', { replace: true })
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
        //console.log("Name update");
        const form = event.target;
        const name = form.Name.value;

        //console.log(email);
        const customerUpdatedData = {
            "customer_id": customer?._id,
            "name": name
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/customers/update-customer/${customer?._id}`, customerUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                //console.log(response)
                if (response.statusText === "OK") {
                    toast.success("Customer Name Updated");
                    document.getElementById('customerNameModalClose').click()
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

        const customerUpdatedData = {
            "customer_id": customer?._id,
            "contact": contact
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/customers/update-customer/${customer?._id}`, customerUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.statusText === "OK") {
                    toast.success("Customer Contact No. Updated");
                    document.getElementById('customerContactModalClose').click()
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

        const customerUpdatedData = {
            "customer_id": customer?._id,
            "email": email
        }

        //console.log(email);
        axios.patch(`${import.meta.env.VITE_API_URL}/customers/update-customer/${customer?._id}`, customerUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.statusText === "OK") {
                    toast.success("customer Email Updated");
                    document.getElementById('customerEmailModalClose').click()
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

        const customerUpdatedData = {
            "customer_id": customer?._id,
            "address": address
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/customers/update-customer/${customer?._id}`, customerUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.statusText === "OK") {
                    toast.success("Customer Address Updated");
                    document.getElementById('customerAddressModalClose').click()
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
    //console.log(customer);

    return (
        <div>
            <Helmet>
                <title>Customer Setting - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Customer Setting</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard/customers">Customers</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Customer Setting</li>
                        </ol>
                    </nav>
                </div>

                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#deleteConfermationModal" type="button" className="btn btn-danger rounded"><i className="bx bx-message-square-x"></i>Delete Customer</button>
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

                <div className="modal fade" id="customerNameModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Customer Name</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleNameUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Name</label>
                                        <input type="text" defaultValue={customer?.name} placeholder='Enter Customer Name' className="form-control text-capitalize" id="Name" name='Name' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Customer Name</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='customerNameModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="customerContactModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Customer Contact</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleContactUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Contact</label>
                                        <input type="text" defaultValue={customer?.contact_no} placeholder='Enter Customer Name' className="form-control text-capitalize" id="contact" name='contact' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Customer Contact</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='customerContactModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="customerEmailModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Customer Email</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleEmailUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Email</label>
                                        <input type="text" defaultValue={customer?.email} placeholder='Enter Customer Name' className="form-control text-capitalize" id="email" name='email' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Customer Email</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='customerEmailModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="customerAddressModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Customer Address</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleAddressUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Address</label>
                                        <input type="text" defaultValue={customer?.address} placeholder='Enter Customer Name' className="form-control text-capitalize" id="address" name='address' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Customer Address</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='customerAddressModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="row">
                <div className="col-xl-9 mx-auto mt-3">
                    <h6 className="mb-0 text-uppercase">Update Customer Data</h6>
                    <hr />
                    <div className="card">
                        <div className="card-body">
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Name</span>
                                <input type="text" className="form-control text-capitalize" value={customer?.name} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#customerNameModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Contact No.</span>
                                <input type="text" className="form-control text-capitalize" value={customer?.contact_no} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#customerContactModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Email</span>
                                <input type="text" className="form-control text-capitalize" value={customer?.email ? customer?.email : 'Not Added'} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#customerEmailModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Address</span>
                                <input type="text" className="form-control text-capitalize" value={customer?.address} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#customerAddressModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSettings;