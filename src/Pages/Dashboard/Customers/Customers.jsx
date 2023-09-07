import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

const Customers = () => {

    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();
    const { isLoading, data: customers = [], refetch } = useQuery(
    {
        queryKey: [],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/customres/get-all-customers`,
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

    return (
        <div>
             <Helmet>
                <title>Customers - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Customers</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Customers</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* ---------------------------------------remove before deploy------------------------------------------- */}
            {/* <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#newSupplierModal" type="button" className="btn btn-primary rounded"><i className="bx bx-list-plus"></i>New Supplier</button>
                        <div className="modal fade" id="newSupplierModal" tabIndex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Supplier</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form onSubmit={handleSubmit} className="row g-3">
                                        <div className="modal-body mx-2 mb-2">
                                            <div className="col-md-12 mb-2">
                                                <label htmlFor="Name" className="form-label">Name</label>
                                                <input required type="text" placeholder='Enter Supplier Name' className="form-control" id="Name" name='Name' />
                                            </div>
                                            <div className="col-md-12 mb-2">
                                                <label htmlFor="Name" className="form-label">Contact</label>
                                                <input required type="text" placeholder='Enter Supplier Contact' className="form-control" id="contact" name='contact' />
                                            </div>
                                            <div className="col-md-12 mb-2">
                                                <label htmlFor="Name" className="form-label">Email</label>
                                                <input type="text" placeholder='Enter Supplier Email' className="form-control" id="email" name='email' />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="Name" className="form-label">Address</label>
                                                <input required type="text" placeholder='Enter Supplier Address' className="form-control" id="address" name='address' />
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-add'></i>Add Supplier</button>
                                        </div>
                                    </form>
                                    <div className="modal-footer px-4">
                                        <button id='newSupplierModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* ---------------------------------------remove before deploy------------------------------------------- */}
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="brandsTable" className="table table-striped table-bordered border-top border-bottom">
                            <thead>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers?.length <= 0 ? <tr>
                                    <td colSpan='6' className='text-center'>No data available in table</td>
                                    <td className='d-none'></td>
                                    <td className='d-none'></td>
                                    <td className='d-none'></td>
                                    <td className='d-none'></td>
                                    <td className='d-none'></td>
                                </tr> : <></>}
                                {customers?.map((customer, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className='text-capitalize'>{customer?.name}</td>
                                        <td className='text-capitalize'>{customer?.contact_no? customer?.contact_no : 'Not Added'}</td>
                                        <td className='text-capitalize'>{customer?.email ? customer?.email : 'Not Added'}</td>
                                        <td className='text-capitalize'>{customer?.address}</td>
                                        <td>
                                            <button type="button" className="btn btn-outline-primary btn-sm me-1"><i className='bx bx-receipt'></i>Details</button>
                                            <Link to={`/dashboard/customer/setting/${customer?._id}`} type="button" className="btn btn-outline-primary btn-sm"><i className='bx bx-slider'></i>Setting</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Email</th>
                                    <th>Address</th>
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

export default Customers;