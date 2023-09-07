import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/jquery.dataTables.css';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import Select from 'react-select'

const DealsDetails = () => {
    const ID = useParams();
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();
    const [dealsTypes, setDealsTypes] = useState()
    const [categories, setCategories] = useState()
    const { isLoading, data: deals = [], refetch } = useQuery({
        queryKey: [],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/deals/get-deal-brand-business/${ID?.id}`,
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

    // useEffect(() => {
    //     new DataTable('#dealsTable');
    //     document.getElementById('dealsTable_filter')?.classList?.add('mb-2');
    // });

    useEffect(() => {
        handleAddPreload();
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const deal_type = form.deal_type.value
        const title = form.Title.value;
        const description = form.Description.value;
        const category_id = form.Category.value;
        const app_sale = form.app_sale.value;
        const _id = ID?.id;

        const formData = new FormData()
        const image = form.thumbnail_photo.files[0]
        formData.append("thumbnail_photo", image)
        formData.append("deal_type", deal_type)
        formData.append("title", title)
        formData.append("description", description)
        formData.append("category_id", category_id)
        formData.append("app_sale", parseInt(app_sale))
        ID?.type === "brand" && formData.append("brand_id", _id)
        ID?.type === "business" && formData.append("business_id", _id)

        axios.post(`${import.meta.env.VITE_API_URL}/deals/save-deal`, formData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('newDealModalClose').click()
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

    const handleAddPreload = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/deals/get-all-types`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => setDealsTypes(res.data))
            .catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    secureLocalStorage.removeItem("userData");
                    navigate('/login');
                    toast.error('Token Invalid! Login Again')
                }
            })

        axios.get(`${import.meta.env.VITE_API_URL}/categories/all-categories`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => setCategories(res.data))
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
                    <title>{`${ID?.type.replace(/^./, ID?.type[0].toUpperCase())} Deals - Ekka Dashboard`}</title>
                    <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
                </Helmet>
                <div className="page-breadcrumb d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">{`${ID?.type.replace(/^./, ID?.type[0].toUpperCase())} Deals`}</div>
                    <div className="ps-3 d-none d-sm-flex">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 p-0">
                                <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Deals</li>
                                <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard/deals/add-deals">Add Deals</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">{`${ID?.type.replace(/^./, ID?.type[0].toUpperCase())} Deals`}</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="ms-auto">
                        <div className="btn-group">
                            <button onClick={handleAddPreload} data-bs-toggle="modal" data-bs-target="#newDealModal" type="button" className="btn btn-primary rounded"><i className="bx bx-list-plus"></i>New Deal</button>
                            <div className="modal fade" id="newDealModal" tabIndex="-1" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Add New Deal</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <form onSubmit={handleSubmit} className="row g-3">
                                            <div className="modal-body mx-2 mb-2">
                                                <div className="col-md-12 mb-2">
                                                    <label htmlFor="Name" className="form-label">Deal Type</label>
                                                    <Select className="mb-2" name='deal_type' id='deal_type' required placeholder="Select Deal Type" isClearable options={dealsTypes} getOptionLabel={(dealsType) => dealsType.name} getOptionValue={(dealsType) => dealsType.name} />
                                                </div>
                                                <div className="col-md-12 mb-2">
                                                    <label htmlFor="Name" className="form-label">Deal Title</label>
                                                    <input required type="text" placeholder='Enter Deal Title' className="form-control" id="Title" name='Title' />
                                                </div>
                                                <div className="col-md-12 mb-2">
                                                    <label htmlFor="Icon" className="form-label">Deal Description</label>
                                                    <textarea required type="text" placeholder='Enter Deal Description' className="form-control" id="Description" name='Description' />
                                                </div>
                                                <div className="col-md-12 mb-2">
                                                    <label htmlFor="Icon" className="form-label">Deal Thumbnail</label>
                                                    <input required className="form-control" type="file" accept=".png, .jpg" id="thumbnail_photo" name="thumbnail_photo" />
                                                </div>
                                                <div className="col-md-12 mb-2">
                                                    <label htmlFor="Icon" className="form-label">Deal Category</label>
                                                    <Select required className="mb-3" isClearable id="Category" name="Category" placeholder="Select Categoty" options={categories} getOptionLabel={(category) => category.name} getOptionValue={(categoty) => categoty._id} />
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label htmlFor="app_sale" className="form-label">In App Sale</label>
                                                    <Select required className="mb-3" isClearable id="app_sale" name="app_sale" options={[{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }]} />
                                                </div>
                                                <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-add'></i>Add Deal</button>
                                            </div>
                                        </form>
                                        <div className="modal-footer px-4">
                                            <button id='newDealModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
                            <table id="dealsTable" className="table table-striped table-bordered border-top border-bottom">
                                <thead>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Deals Thumbnail</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deals?.length == 0 ? <tr>
                                        <td colSpan='7' className='text-center'>No data available in table</td>
                                        <td className='d-none'></td>
                                        <td className='d-none'></td>
                                        <td className='d-none'></td>
                                        <td className='d-none'></td>
                                        <td className='d-none'></td>
                                        <td className='d-none'></td>
                                    </tr> : <></>}
                                    {deals?.map((deal, index) =>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className='cursor-pointer'><PhotoView key={index} src={`${import.meta.env.VITE_API_URL}/${deal?.thumbnail_photo}`}><img width="36" alt={deal?.titile} src={`${import.meta.env.VITE_API_URL}/${deal?.thumbnail_photo}`}></img></PhotoView></td>
                                            <td className='text-capitalize'>{deal?.title}</td>
                                            <td>{deal?.description}</td>
                                            <td>{categories?.map((category) => {
                                                if (category._id === deal?.category_id) {
                                                    return category?.name
                                                }
                                            })}</td>
                                            <td>{deal?.status?.is_active == 1 ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Deactive</span>}<br />{deal?.status?.is_latest_deal == 1 ? <span className="badge bg-primary">Latest Deal</span> : <span className="badge bg-danger">Not Latest Deal</span>}<br />{deal?.status?.is_hot_deal == 1 ? <span className="badge bg-warning text-dark">Hot Deal</span> : <span className="badge bg-danger">Not Hot Deal</span>}</td>
                                            <td>
                                                <Link to={`/dashboard/deals/add-deals/brand/${ID?.id}/deal-setting/${deal?._id}`} type="button" className="btn btn-outline-primary btn-sm"><i className='bx bx-slider'></i>Setting</Link>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Deals Thumbnail</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </PhotoProvider>
    );
};

export default DealsDetails;