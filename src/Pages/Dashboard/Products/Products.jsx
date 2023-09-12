import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DataTable from 'datatables.net-dt';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import { PhotoProvider, PhotoView } from 'react-photo-view';

const Products = () => {
    const [brands, setBrands]=useState([]);
    const [Category, setCategory]=useState([]);
    const [SubCategory, setSubCategory]=useState([]);

    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();
    const { isLoading, data: products = [], refetch } = useQuery({
        queryKey: [],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/product/get-all-product`,
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

    console.log(products);
    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL+"/brand/get-all-brand")
        .then(response=>response.json())
        .then(data=>
        {
            if(data.length>0)
            {
                let byName=data.slice(0);
                byName.sort(function(a, b)
                {
                    var x = a.name;
                    var y = b.name;
                    return x < y ? -1 : x > y ? 1 : 0;
                })
                setBrands(byName);
            } 
        })
        

        fetch(import.meta.env.VITE_API_URL+"/categories/all-categories")
        .then(response=>response.json())
        .then(data=>
        {
            if(data.length>0)
            {
                let byName=data.slice(0);
                byName.sort(function(a, b)
                {
                    var x = a.name;
                    var y = b.name;
                    return x < y ? -1 : x > y ? 1 : 0;
                })
                setCategory(byName);
            }
        })
        
    }, [products]);

    const categoryHandelar=(e)=>
    {
        const selectedCat=Category.find(cat=>cat.name===e.target.value)
        setSubCategory(selectedCat.subcategories)
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.target;

        const name = form.Name.value;
        const category = form.Categorie.value;
        const subcategory=form.Subcategorie.value;
        const price = form.Price.value;
        const discount = form.Discount.value;
        const brand = form.Brand.value;
        const color = form.Color.value;
        const description = form.Description.value;

        const formData = new FormData()
        const ThumbImage = form.ThumbImage.files[0];
        const BodyImage1=form.BodyImage1.files[0];
        const BodyImage2=form.BodyImage2.files[0];
        const BodyImage3=form.BodyImage3.files[0];

        // console.log(BodyImage1);

        formData.append("thumb_image", ThumbImage)
        formData.append("body_image1",BodyImage1)
        formData.append("body_image2",BodyImage2)
        formData.append("body_image3",BodyImage3)
        formData.append("name",  name.toLowerCase())
        formData.append("category", category)
        formData.append("subcategory", subcategory)
        formData.append("price", price)
        formData.append("discount", discount)
        formData.append("brand", brand)
        formData.append("color", color)
        formData.append("description", description)

        axios.post(`${import.meta.env.VITE_API_URL}/product/add-product`, formData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                console.log(response);
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('newProductModalClose').click()
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
                <title>Products - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Products</div>
                <div className="ps-3 d-none d-sm-flex">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Products</li>
                        </ol>
                    </nav>
                </div>
                <div className="ms-auto">
                    <div className="btn-group">
                        <button data-bs-toggle="modal" data-bs-target="#newProductModal" type="button" className="btn btn-primary rounded"><i className="bx bx-list-plus"></i>New Product</button>
                        <div className="modal fade" id="newProductModal" tabIndex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Product</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form onSubmit={handleSubmit} className="row g-3">
                                        <div className="modal-body mx-2 mb-2">
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="Name" className="form-label">Name</label>
                                                <input required type="text" placeholder='Enter Name' className="form-control" id="Name" name='Name' />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="Categorie" className="form-label">Categorie</label>
                                                <select name="Categorie" id="Categorie" class="form-control" onChange={categoryHandelar}>
                                                    <option value="Categorie">Select a Categorie</option>
                                                    {Category&&
                                                        Category.map(cat=>cat&&<option value={cat.name}>{cat.name}</option>)
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="Subcategorie" className="form-label">Subcategorie</label>
                                                <select name="Subcategorie" id="Subcategorie" class="form-control">
                                                    <option value="Subcategorie">Select a Subcategorie</option>
                                                    {SubCategory&&
                                                        SubCategory.map(subCat=>subCat&&<option value={subCat.name}>{subCat.name}</option>)
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="Price" className="form-label">Price</label>
                                                <input type="number" placeholder='Enter Price' className="form-control" id="Price" name='Price' />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="Discount" className="form-label">Discount</label>
                                                <input type="number" placeholder='Enter Discount' className="form-control" id="Discount" name='Discount' />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="Brand" className="form-label">Brand</label>
                                                <select name="Brand" id="Brand" class="form-control">
                                                    <option value="Brand">Select a brand</option>
                                                    {brands&&
                                                        brands.map(brand=>brand&&<option value={brand.name}>{brand.name}</option>)
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="ThumbImage" className="form-label">Thumb Image</label>
                                                {/* <input type="text" className="form-control" id="ThumbImage" name='ThumbImage'/> */}
                                                <input type="file" accept=".png, .jpg" className="form-control" id="ThumbImage" name='ThumbImage'/>
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="BodyImage1" className="form-label">Body Image</label>
                                                <input type="file" accept=".png, .jpg" className="form-control" id="BodyImage1" name='BodyImage1'/>
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="BodyImage2" className="form-label">Body Image</label>
                                                <input type="file" accept=".png, .jpg" className="form-control" id="BodyImage2" name='BodyImage2'/>
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="BodyImage3" className="form-label">Body Image</label>
                                                <input type="file" accept=".png, .jpg" className="form-control" id="BodyImage3" name='BodyImage3'/>
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="Color" className="form-label">Color</label>
                                                <input type="text" placeholder='Enter Colour' className="form-control" id="Color" name='Color' />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="Description" className="form-label">Description</label>
                                                <textarea type="text" placeholder='Enter Description' className="form-control" id="Description" name='Description' />
                                            </div>




                                            <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-add'></i>Add Product</button>
                                        </div>
                                    </form>
                                    <div className="modal-footer px-4">
                                        <button id='newProductModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
                        <table id="productsTable" className="table table-striped table-bordered border-top border-bottom">
                            <thead>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Image</th>
                                    <th>All Images</th>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Color</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.length <= 0 && <tr>
                                    <td colSpan='4' className='text-center'>No data available in table</td>
                                    <td className='d-none'></td>
                                    <td className='d-none'></td>
                                </tr>}
                                {products.length>0&&products.map((product, index) =>
                                    product&&
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className='cursor-pointer'><PhotoView key={index} src={`${import.meta.env.VITE_API_URL}/${product?.thumb_image}`}><img width="36" alt={product?.name} src={`${import.meta.env.VITE_API_URL}/${product?.thumb_image}`}></img></PhotoView></td>
                                        <td className='cursor-pointer'>
                                            <PhotoView key={index+1} src={`${import.meta.env.VITE_API_URL}/${product?.media?.length>0&&product.media[0]}`}><img width="36" alt={product&&product?.name} src={`${import.meta.env.VITE_API_URL}/${product?.media?.length>0&&product?.media[0]}`}></img></PhotoView>
                                            <PhotoView key={index+2} src={`${import.meta.env.VITE_API_URL}/${product?.media?.length>1&&product?.media[1]}`}><img width="36" alt={product&&product?.name} src={`${import.meta.env.VITE_API_URL}/${product?.media?.length>1&&product?.media[1]}`}></img></PhotoView>
                                            <PhotoView key={index+3} src={`${import.meta.env.VITE_API_URL}/${product?.media?.length>2&&product?.media[2]}`}><img width="36" alt={product&&product?.name} src={`${import.meta.env.VITE_API_URL}/${product?.media?.length>2&&product?.media[2]}`}></img></PhotoView>
                                        </td>
                                        <td>{product?.name}</td>
                                        <td>{product?.brand}</td>
                                        <td>{product?.color}</td>
                                        <td>
                                            <Link to={`/dashboard/products/setting/${product?._id}`} type="button" className="btn btn-outline-primary btn-sm"><i className='bx bx-slider'></i>Setting</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Image</th>
                                    <th>All Images</th>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Color</th>
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

export default Products;