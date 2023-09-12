import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/jquery.dataTables.css';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { PhotoProvider, PhotoView } from 'react-photo-view';

const Brands = () => {
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();
    const { isLoading, data: brands = [], refetch } = useQuery({
        queryKey: [],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/brand/get-all-brand`,
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
    console.log(brands);

    // useEffect(() => {
    //     new DataTable('#brandsTable');
    //     document.getElementById('brandsTable_filter')?.classList?.add('mb-2');
    // }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;

        const formData = new FormData()
        const image = form.brand_logo.files[0]
        formData.append("brand_logo", image)
        formData.append("name", name.toLowerCase())

        axios.post(`${import.meta.env.VITE_API_URL}/brand/add-brand`, formData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('newBrandModalClose').click()
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
                <title>Brands - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Brands</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Brands</li>
                        </ol>
                    </nav>
                </div>
                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#newCategoryModal" type="button" className="btn btn-primary rounded"><i className="bx bx-list-plus"></i>New Brand</button>
                        <div className="modal fade" id="newCategoryModal" tabIndex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Brands</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form onSubmit={handleSubmit} className="row g-3">
                                        <div className="modal-body mx-2 mb-2">
                                            <div className="col-md-12 mb-2">
                                                <label htmlFor="Name" className="form-label">Name</label>
                                                <input required type="text" placeholder='Enter Brand Name' className="form-control" id="Name" name='Name' />
                                            </div>
                                            <div className="col-md-12 mb-2">
                                                <label htmlFor="brand_logo" className="form-label">Name</label>
                                                <input required type="file" accept=".png, .jpg" className="form-control" id="brand_logo" name='brand_logo' />
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-add'></i>Add Brand</button>
                                        </div>
                                    </form>
                                    <div className="modal-footer px-4">
                                        <button id='newBrandModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
                        <table id="brandsTable" className="table table-striped table-bordered border-top border-bottom">
                            <thead>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Logo</th>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brands?.length <= 0 ? <tr>
                                    <td colSpan='3' className='text-center'>No data available in table</td>
                                    <td className='d-none'></td>
                                    <td className='d-none'></td>
                                </tr> : <></>}
                                {brands?.map((brand, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className='cursor-pointer'><PhotoView key={index} src={`${import.meta.env.VITE_API_URL}/${brand?.brand_logo}`}><img width="36" alt={brand?.name} src={`${import.meta.env.VITE_API_URL}/${brand?.brand_logo}`}></img></PhotoView></td>
                                        <td className='text-capitalize'>{brand?.name}</td>
                                        <td>
                                            <button type="button" className="btn btn-outline-primary btn-sm me-1"><i className='bx bx-receipt'></i>Details</button>
                                            <Link to={`/dashboard/brands/setting/${brand?._id}`} type="button" className="btn btn-outline-primary btn-sm"><i className='bx bx-slider'></i>Setting</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Logo</th>
                                    <th>Name</th>
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

export default Brands;