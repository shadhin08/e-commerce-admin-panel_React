import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'datatables.net-dt/css/jquery.dataTables.css';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { PhotoProvider, PhotoView } from 'react-photo-view';

const Deals = () => {
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const [dealsCount, setDealsCount] = useState();
    const [brandDetails, setBrandDetails] = useState();
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/deals/get-deal-count`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => {
                setDealsCount(res.data)
            })
            .catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    secureLocalStorage.removeItem("userData");
                    navigate('/login');
                    toast.error('Token Invalid! Login Again')
                }
            })
    }, [])

    const handleBrand = (event) => {
        event.preventDefault();
        const form = event.target;
        const brand = form.brand.value;

        axios.get(`${import.meta.env.VITE_API_URL}/brand/get-brand-name-contact/${brand.toLowerCase()}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => {
                if (res.status == 200) {
                    setBrandDetails(res.data)
                }
                if (res.data.status === "failed") {
                    // setBrandDetails(false)
                    toast.warning(res.data.message)
                }
            })
            .catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    secureLocalStorage.removeItem("userData");
                    navigate('/login');
                    toast.error('Token Invalid! Login Again')
                }
            })
    }

    return (
        <PhotoProvider>
            <div>
                <Helmet>
                    <title>Add Deals - Ekka Dashboard</title>
                    <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
                </Helmet>
                <div className="page-breadcrumb d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Add Deals</div>
                    <div className="ps-3 d-none d-sm-flex">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 p-0">
                                <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Deals</li>
                                <li className="breadcrumb-item active" aria-current="page">Add Deals</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-9 mx-auto mt-3">
                        <h6 className="mb-0 text-uppercase">Deals Count</h6>
                        <hr />
                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className='d-none d-md-block'>
                                        <table className="table table-striped table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Tolal Deals</th>
                                                    <th>Active Deals</th>
                                                    <th>Latest Deals</th>
                                                    <th>Hot Deals</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{dealsCount?.deals_count ? dealsCount?.deals_count : 0}</td>
                                                    <td>{dealsCount?.current_deal_count ? dealsCount?.current_deal_count : 0}</td>
                                                    <td>{dealsCount?.latest_deal_count ? dealsCount?.latest_deal_count : 0}</td>
                                                    <td>{dealsCount?.hot_deal_count ? dealsCount?.hot_deal_count : 0}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='d-md-none'>
                                        <table className="table table-striped table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Tolal Deals</th>
                                                    <th>Active Deals</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{dealsCount?.deals_count}</td>
                                                    <td>{dealsCount?.current_deal_count}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table className="table table-striped table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Latest Deals</th>
                                                    <th>Hot Deals</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{dealsCount?.latest_deal_count}</td>
                                                    <td>{dealsCount?.hot_deal_count}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-9 mx-auto mt-1">
                        <h6 className="mb-0 text-uppercase">Search Brand / business</h6>
                        <hr />
                        <div className="card">
                            <div className="card-body">
                                <div className='row'>
                                    <div className='col-md'>
                                        <label className="form-label">Search Brand</label>
                                        <form onSubmit={handleBrand} className="input-group col-md-12 mb-3">
                                            <input required type="text" placeholder='Brand Name / Contact No.' id='brand' name='brand' className="form-control" aria-label="brandName" aria-describedby="basic-addon1" />
                                            <button type="submit" className='btn btn-primary'><i className='bx bx-search-alt'></i>Search</button>
                                        </form>
                                    </div>
                                    <div className='col-md'>
                                        <label className="form-label">Search Business</label>
                                        <form className="input-group col-md-12 mb-3">
                                            <input required type="text" placeholder='Business Name / Contact No.' id='businessName' name='businessName' className="form-control" aria-label="businessName" aria-describedby="basic-addon1" />
                                            <button type="submit" className='btn btn-primary'><i className='bx bx-search-alt'></i>Search</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    {brandDetails?.name && <div>
                                        <table className="table table-striped table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Brand Logo</th>
                                                    <th>Name</th>
                                                    <th>Address</th>
                                                    <th>Contact No.</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className='cursor-pointer'><PhotoView src={`${import.meta.env.VITE_API_URL}/${brandDetails?.brand_logo}`}><img width="36" alt={brandDetails?.name} src={`${import.meta.env.VITE_API_URL}/${brandDetails?.brand_logo}`}></img></PhotoView></td>
                                                    <td className='text-capitalize align-middle'>{brandDetails?.name}</td>
                                                    <td className='align-middle'>{brandDetails?.address}</td>
                                                    <td className='align-middle'>{brandDetails?.contact_no}</td>
                                                    <td className='align-middle'><Link to={`/dashboard/deals/add-deals/brand/${brandDetails?._id}`} type="button" className="btn btn-outline-primary btn-sm">Go Next<i className='bx bx-right-arrow-alt'></i></Link></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>}
                                    {/* {brandDetails == false && <div className='text-center mt-4'>
                                        <h5 className='text-secondary'>No Brand Found</h5>
                                    </div>} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PhotoProvider>
    );
};

export default Deals;