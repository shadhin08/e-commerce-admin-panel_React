import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import { PhotoProvider, PhotoView } from 'react-photo-view';

const ProductSetting = () => {
    const ProductID = useParams();
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();
    // console.log(ProductID);

    const { isLoading, data: product = [], refetch } = useQuery({
        queryKey: [ProductID?.id],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/product/get-product/${ProductID?.id}`,
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
        if (!isLoading && product?.length <= 0) {
            toast.error('This Data Not Found')
            navigate('/dashboard/products', { replace: true })
        }
    })

    const handleNameUpdate = (event) => {
        // console.log("name");
        event.preventDefault();
        const form = event.target;
        const name = form.Name.value;

        const productUpdatedData = {
            "id": product?._id,
            "name": name
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/product/update-product/${ProductID?.id}`, productUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Product Name Updated");
                    document.getElementById('productNameModalClose').click()
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
    const handlePriceUpdate=(event)=>
    {
        // console.log("Price");
        event.preventDefault();
        const form = event.target;
        const price = form.Price.value;

        const productUpdatedData = {
            "id": product?._id,
            "price": price
        }
        axios.patch(`${import.meta.env.VITE_API_URL}/product/update-product/${ProductID?.id}`, productUpdatedData,
        {
            headers: {
                authorization: `Bearer ${userData?.user_token}`
            }
        })
        .then(response => {
            if (response.data.status === "success") {
                toast.success("Product Price Updated");
                document.getElementById('productPriceModalClose').click()
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
    
    const handleDiscountUpdate=(event)=>
    {
        // console.log("Price");
        event.preventDefault();
        const form = event.target;
        const discount = form.Discount.value;

        const productUpdatedData = {
            "id": product?._id,
            "discount": discount
        }
        axios.patch(`${import.meta.env.VITE_API_URL}/product/update-product/${ProductID?.id}`, productUpdatedData,
        {
            headers: {
                authorization: `Bearer ${userData?.user_token}`
            }
        })
        .then(response => {
            if (response.data.status === "success") {
                toast.success("Product Discount Updated");
                document.getElementById('productDiscountModalClose').click()
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
    
    const handleColorUpdate=(event)=>
    {
        // console.log("Price");
        event.preventDefault();
        const form = event.target;
        const color = form.Color.value;

        const productUpdatedData = {
            "id": product?._id,
            "color": color
        }
        axios.patch(`${import.meta.env.VITE_API_URL}/product/update-product/${ProductID?.id}`, productUpdatedData,
        {
            headers: {
                authorization: `Bearer ${userData?.user_token}`
            }
        })
        .then(response => {
            if (response.data.status === "success") {
                toast.success("Product Color Updated");
                document.getElementById('productColorModalClose').click()
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
    const handleDescriptionUpdate=(event)=>
    {
        // console.log("Price");
        event.preventDefault();
        const form = event.target;
        const description = form.Description.value;

        const productUpdatedData = {
            "id": product?._id,
            "description": description
        }
        axios.patch(`${import.meta.env.VITE_API_URL}/product/update-product/${ProductID?.id}`, productUpdatedData,
        {
            headers: {
                authorization: `Bearer ${userData?.user_token}`
            }
        })
        .then(response => {
            if (response.data.status === "success") {
                toast.success("Product Description Updated");
                document.getElementById('productDescriptionModalClose').click()
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
    const handleThumbImageUpdate = (event) => {
        event.preventDefault();
        const form = event.target;

        const formData = new FormData()
        const image = form.thumb_image.files[0]
        formData.append("thumb_image", image)
        formData.append("id", ProductID?.id)

        axios.patch(`${import.meta.env.VITE_API_URL}/product/update-product/${ProductID?.id}`, formData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Product Thumb Image Updated");
                    document.getElementById('productLogoModalClose').click()
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
    
    const handleBodyImage1Update = (event) => {
        event.preventDefault();
        const form = event.target;

        const formData = new FormData()
        const image = form.body_image1.files[0]
        formData.append("body_image1", image)
        formData.append("id", ProductID?.id)

        axios.patch(`${import.meta.env.VITE_API_URL}/product/update-product/${ProductID?.id}`, formData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Product Body Image Updated");
                    document.getElementById('productBodyImage1ModelClose').click()
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
    const handleBodyImage2Update = (event) => {
        event.preventDefault();
        const form = event.target;

        const formData = new FormData()
        const image = form.body_image2.files[0]
        formData.append("body_image2", image)
        formData.append("id", ProductID?.id)

        axios.patch(`${import.meta.env.VITE_API_URL}/product/update-product/${ProductID?.id}`, formData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Product Body Image Updated");
                    document.getElementById('productBodyImage2ModelClose').click()
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
    const handleBodyImage3Update = (event) => {
        event.preventDefault();
        const form = event.target;

        const formData = new FormData()
        const image = form.body_image3.files[0]
        formData.append("body_image3", image)
        formData.append("id", ProductID?.id)

        axios.patch(`${import.meta.env.VITE_API_URL}/product/update-product/${ProductID?.id}`, formData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Product Body Image Updated");
                    document.getElementById('productBodyImage3ModelClose').click()
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
        // console.log("delete");
        axios.delete(`${import.meta.env.VITE_API_URL}/product/delete-product/${product?._id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('deleteModalClose').click()
                    navigate('/dashboard/products', { replace: true })
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

    return (
        <PhotoProvider>
        <div>
            <Helmet>
                <title>Product Setting - Ekka Dashboard</title>
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Product Setting</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard/products">Products</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Products Setting</li>
                        </ol>
                    </nav>
                </div>

                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#deleteConfermationModal" type="button" className="btn btn-danger rounded"><i className="bx bx-message-square-x"></i>Delete Product</button>
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

                <div className="modal fade" id="productNameModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Product Name</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleNameUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Name" className="form-label">Name</label>
                                        <input type="text" defaultValue={product?.name} placeholder='Enter Product Name' className="form-control" id="Name" name='Name' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Product Name</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='productNameModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="modal fade" id="productPriceModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Product Price</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handlePriceUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Price" className="form-label">Price</label>
                                        <input type="text" defaultValue={product?.price} placeholder='Enter Product Price' className="form-control" id="Price" name='Price' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Product Name</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='productPriceModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="productDiscountModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Product Discount</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleDiscountUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Discount" className="form-label">Discount</label>
                                        <input type="text" defaultValue={product?.discount} placeholder='Enter Product Discount' className="form-control" id="Discount" name='Discount' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Product Name</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='productDiscountModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="productColorModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Product Color</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleColorUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Color" className="form-label">Color</label>
                                        <input type="text" defaultValue={product?.color} placeholder='Enter Product Color' className="form-control" id="Color" name='Color' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Product Name</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='productColorModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="productDescriptionModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Product Description</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleDescriptionUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="Description" className="form-label">Description</label>
                                        <input type="text" defaultValue={product?.description} placeholder='Enter Product Description' className="form-control" id="Description" name='Description' />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Product Name</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='productDescriptionModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="productThumbImageModel" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Product Thumb Image</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleThumbImageUpdate} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="thumb_image" className="form-label">Product Thumb Image</label>
                                        <input required className="form-control" type="file" accept=".png, .jpg" id="thumb_image" name="thumb_image" />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Product Thumb Image</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='productLogoModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="productBodyImage1Model" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Product Body Image 1</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleBodyImage1Update} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="body_image1" className="form-label">Product Body Image 1</label>
                                        <input required className="form-control" type="file" accept=".png, .jpg" id="body_image1" name="body_image1" />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Product Thumb Image</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='productBodyImage1ModelClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="productBodyImage2Model" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Product Body Image 2</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleBodyImage2Update} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="body_image2" className="form-label">Product Body Image 2</label>
                                        <input required className="form-control" type="file" accept=".png, .jpg" id="body_image2" name="body_image2" />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Product Thumb Image</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='productBodyImage2ModelClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                

                <div className="modal fade" id="productBodyImage3Model" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Product Body Image 3</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleBodyImage3Update} className="row g-3">
                                <div className="modal-body mx-2 mb-2">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="body_image3" className="form-label">Product Body Image 3</label>
                                        <input required className="form-control" type="file" accept=".png, .jpg" id="body_image3" name="body_image3" />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Product Thumb Image</button>
                                </div>
                            </form>
                            <div className="modal-footer px-4">
                                <button id='productBodyImage3ModelClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            

            <div className="row">
                <div className="col-xl-9 mx-auto mt-3">
                    <h6 className="mb-0 text-uppercase">Update Product Data</h6>
                    <hr />
                    <div className="card">
                        <div className="card-body">
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Name</span>
                                <input type="text" className="form-control" value={product?.name} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#productNameModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>


                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Price</span>
                                <input type="text" className="form-control" value={product?.price} disabled aria-label="Price" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#productPriceModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Discount</span>
                                <input type="text" className="form-control" value={product?.discount} disabled aria-label="Discount" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#productDiscountModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Color</span>
                                <input type="text" className="form-control" value={product?.color} disabled aria-label="Color" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#productColorModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Description</span>
                                <input type="text" className="form-control" value={product?.description} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#productDescriptionModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Product Thumb Image</span>
                                <PhotoView key={product?.name} src={`${import.meta.env.VITE_API_URL}/${product?.thumb_image}`}><img className='cursor-pointer' width="36" alt={product?.name} src={`${import.meta.env.VITE_API_URL}/${product?.thumb_image}`}></img></PhotoView>
                                <input type="text" className="form-control" value={product?.thumb_image} disabled aria-label="Contact" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#productThumbImageModel" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Product Body Image 1</span>
                                <PhotoView key={product?.name} src={`${import.meta.env.VITE_API_URL}/${product?.media?.length>0&&product.media[0]}`}><img className='cursor-pointer' width="36" alt={product?.name} src={`${import.meta.env.VITE_API_URL}/${product?.media?.length>0&&product.media[0]}`}></img></PhotoView>
                                <input type="text" className="form-control" value={product?.media?.length>0&&product.media[0]} disabled aria-label="Contact" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#productBodyImage1Model" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Product Body Image 2</span>
                                <PhotoView key={product?.name} src={`${import.meta.env.VITE_API_URL}/${product?.media?.length>0&&product.media[1]}`}><img className='cursor-pointer' width="36" alt={product?.name} src={`${import.meta.env.VITE_API_URL}/${product?.media?.length>0&&product.media[1]}`}></img></PhotoView>
                                <input type="text" className="form-control" value={product?.media?.length>0&&product.media[1]} disabled aria-label="Contact" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#productBodyImage2Model" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>
                            <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Product Body Image 3</span>
                                <PhotoView key={product?.name} src={`${import.meta.env.VITE_API_URL}/${product?.media?.length>0&&product.media[2]}`}><img className='cursor-pointer' width="36" alt={product?.name} src={`${import.meta.env.VITE_API_URL}/${product?.media?.length>0&&product.media[2]}`}></img></PhotoView>
                                <input type="text" className="form-control" value={product?.media?.length>0&&product.media[2]} disabled aria-label="Contact" aria-describedby="basic-addon1" />
                                <button data-bs-toggle="modal" data-bs-target="#productBodyImage3Model" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        </PhotoProvider>
    );
};

export default ProductSetting;