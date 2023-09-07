import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import './DealSetting.css'
import makeAnimated from 'react-select/animated';

const DealSetting = () => {
    const Param = useParams()
    const userData = JSON.parse(secureLocalStorage.getItem("userData"));
    const navigate = useNavigate();
    const [categories, setCategories] = useState()
    const [category, setCategory] = useState()
    const [dealsTypes, setDealsTypes] = useState()
    const [product, setProduct] = useState()
    const [priorityArea, setPriorityArea] = useState()
    const [Allproduct, setAllProduct] = useState()
    const [division, setDivision] = useState();
    const [district, setDistrict] = useState();
    const [cities, setCities] = useState();
    const [areas, setAreas] = useState();
    // const [Updateareas, setUpdateAreas] = useState();
    const [selectedAreas, setSelectedAreas] = useState();
    const [key, setKey] = useState(0)
    const [isAllOvreCountry, setIsAllOvreCountry] = useState()

    const animatedComponents = makeAnimated()

    const { isLoading, data: deal = [], refetch } = useQuery({
        queryKey: [Param?.deal_id],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/deals/get-deal/${Param?.deal_id}`,
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
        if (!isLoading && deal.length <= 0) {
            toast.error('This Data Not Found')
            navigate(`/dashboard/deals/add-deals/brand/${Param?.brand_id}`, { replace: true });
        }
    })

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/categories/all-categories`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => {
                setCategories(res.data)
                res.data?.map((category) => {
                    if (category._id === deal?.category_id) {
                        setCategory(category)
                    }
                })
            })
            .catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    secureLocalStorage.removeItem("userData");
                    navigate('/login');
                    toast.error('Token Invalid! Login Again')
                }
            })
    }, [deal?.category_id])

    const handleDealType = () => {
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
    }

    const handleDelete = () => {
        axios.delete(`${import.meta.env.VITE_API_URL}/deals/delete-deal/${Param?.deal_id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('deleteModalClose').click()
                    navigate(`/dashboard/deals/add-deals/brand/${Param?.brand_id}`, { replace: true });
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

    const handleTypeUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const deal_type = form.deal_type.value;

        if (deal_type === deal.deal_type) {
            return toast.warning("Deal Type Not Changed")
        }

        const dealUpdatedData = {
            "deal_id": Param?.deal_id,
            "deal_type": deal_type
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/deals/update-deal`, dealUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Deal Type Updated");
                    document.getElementById('dealTypeModalClose').click()
                    refetch();
                    form.reset();
                }
                if (response.data.status === "failed") {
                    toast.error(response.data.message);
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong1");
            });
    }

    const handleTitleUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const titile = form.Title.value;

        if (titile === deal?.title) {
            return toast.warning("Deal Title Not Changed")
        }

        const dealUpdatedData = {
            "deal_id": Param?.deal_id,
            "title": titile
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/deals/update-deal`, dealUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Deal Title Updated");
                    document.getElementById('dealTitleModalClose').click()
                    refetch();
                    form.reset();
                }
                if (response.data.status === "failed") {
                    toast.error(response.data.message);
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong1");
            });
    }

    const handleDescriptionUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const description = form.description.value;

        if (description === deal?.description) {
            return toast.warning("Deal Description Not Changed")
        }

        const dealUpdatedData = {
            "deal_id": Param?.deal_id,
            "description": description
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/deals/update-deal`, dealUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Deal Description Updated");
                    document.getElementById('dealDescriptionModalClose').click()
                    refetch();
                    form.reset();
                }
                if (response.data.status === "failed") {
                    toast.error(response.data.message);
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong1");
            });
    }

    const handleCategorynUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
        const category = form.category.value;

        if (category === deal?.category_id) {
            return toast.warning("Deal Category Not Changed")
        }

        const dealUpdatedData = {
            "deal_id": Param?.deal_id,
            "category_id": category
        }

        axios.patch(`${import.meta.env.VITE_API_URL}/deals/update-deal`, dealUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Deal Category Updated");
                    document.getElementById('dealCategoryModalClose').click()
                    refetch();
                    form.reset();
                }
                if (response.data.status === "failed") {
                    toast.error(response.data.message);
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong1");
            });
    }

    const handleLogoUpdate = (event) => {
        event.preventDefault();
        const form = event.target;

        const formData = new FormData()
        const image = form.thumbnail_photo.files[0]
        formData.append("thumbnail_photo", image)
        formData.append("deal_id", Param?.deal_id)

        axios.patch(`${import.meta.env.VITE_API_URL}/deals/update-deal`, formData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Deal Thumbnail Updated");
                    document.getElementById('dealThumbnailModalClose').click()
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

    const handleCurentButton = () => {
        if (deal?.status?.is_active == 0) {
            document.getElementById('dealEndStartModalOpen').click()
        } else {
            const dealUpdatedData = {
                "deal_id": Param?.deal_id,
                "current_deal": deal?.status?.is_active == 0 ? true : false
            }
            axios.patch(`${import.meta.env.VITE_API_URL}/deals/handle-curent-deal`, dealUpdatedData,
                {
                    headers: {
                        authorization: `Bearer ${userData?.user_token}`
                    }
                })
                .then(response => {
                    if (response.data.status === "success") {
                        toast.success(response.data.message);
                        document.getElementById('dealEndStartModalClose').click()
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
    }

    const handleCurent = (event) => {
        event.preventDefault();
        const form = event.target;
        const start_datetime = form.start_datetime.value
        const end_datetime = form.end_datetime.value

        const dealUpdatedData = {
            "deal_id": Param?.deal_id,
            "current_deal": deal?.status?.is_active == 0 ? true : false,
            "start_datetime": start_datetime,
            "end_datetime": end_datetime
        }
        axios.patch(`${import.meta.env.VITE_API_URL}/deals/handle-curent-deal`, dealUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('dealEndStartModalClose').click()
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

    const handleLatest = () => {
        const dealUpdatedData = {
            "deal_id": Param?.deal_id,
            "latest_deal": deal?.status?.is_latest_deal == 0 ? true : false,
        }
        axios.patch(`${import.meta.env.VITE_API_URL}/deals/handle-latest-deal`, dealUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    // document.getElementById('dealEndStartModalClose').click()
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

    const handleHot = () => {
        const dealUpdatedData = {
            "deal_id": Param?.deal_id,
            "hot_deal": deal?.status?.is_hot_deal == 0 ? true : false,
        }
        axios.patch(`${import.meta.env.VITE_API_URL}/deals/handle-hot-deal`, dealUpdatedData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    // document.getElementById('dealEndStartModalClose').click()
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

    const handleAddProduct = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value
        const price = form.price.value
        const offer_price = form.offer_price.value

        const productData = {
            "deal_id": Param?.deal_id,
            "name": name,
            "price": price,
            "offer_price": offer_price
        }

        axios.post(`${import.meta.env.VITE_API_URL}/deals/add-product`, productData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('newProductModalClose').click()
                    refetch();
                    form.reset()

                    const peoductData = {
                        "name": name
                    }

                    axios.post(`${import.meta.env.VITE_API_URL}/product/save-product`, peoductData,
                        {
                            headers: {
                                authorization: `Bearer ${userData?.user_token}`
                            }
                        })
                        .then(response => {

                        })
                        .catch(error => {
                            toast.error("Something Went To Wrong");
                        });
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

    const handleProductDelete = () => {
        axios.delete(`${import.meta.env.VITE_API_URL}/deals/delete-product/${Param?.deal_id}/${product?.id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('deleteModalClose2').click()
                    refetch();
                }
                if (response.data.status === "failed") {
                    toast.error(response.data.message);
                }
                if (deal?.products?.length == 1) {
                    const dealUpdatedData = {
                        "deal_id": Param?.deal_id,
                        "current_deal": false,
                    }
                    axios.patch(`${import.meta.env.VITE_API_URL}/deals/handle-curent-deal`, dealUpdatedData,
                        {
                            headers: {
                                authorization: `Bearer ${userData?.user_token}`
                            }
                        })
                        .then(response => {
                            if (response.data.status === "success") {
                                toast.warning("Deal Remove From Curent Deal.");
                                // document.getElementById('dealEndStartModalClose').click()
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
            })
            .catch(error => {
                console.error(error);
                toast.error("Something Went To Wrong");
            });
    }

    const handleProductName = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/product/get-all-products`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => {
                const options = []
                res.data?.map((product) => {
                    options.push({ value: product?.name, label: product?.name });
                })

                setAllProduct(options)
            })
            .catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    secureLocalStorage.removeItem("userData");
                    navigate('/login');
                    toast.error('Token Invalid! Login Again')
                }
            })
    }

    const handleAddPhoto = () => {
        document.getElementById('deal_photo').click()
    }

    const handleUploadPhoto = (event) => {
        const formData = new FormData()
        const image = event.target.files[0]
        if (!image) {
            return;
        }
        formData.append("deal_photo", image)
        formData.append("deal_id", Param?.deal_id)

        axios.post(`${import.meta.env.VITE_API_URL}/deals/add-deal-photo`, formData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
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

    const handleDeletePhoto = (photo) => {
        const photoData = {
            "deal_id": Param?.deal_id,
            "photo": photo
        }
        axios.post(`${import.meta.env.VITE_API_URL}/deals/delete-deal-photo`, photoData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
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

    const handleLocationPreload = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/locations/all-states`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => {
                setDivision(res.data)
            })
            .catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    secureLocalStorage.removeItem("userData");
                    navigate('/login');
                    toast.error('Token Invalid! Login Again')
                }
            })
    }

    const handleDivisionChange = (event) => {
        division?.map((division) => {
            if (division._id === event._id) {
                setDistrict(division.districts);
            }
        }
        )
    };

    const handleDistrictChange = (event) => {
        axios.get(`${import.meta.env.VITE_API_URL}/locations/get-city-by-district/${event?.id}`,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            }
        )
            .then((res) => {
                setCities(res.data);
                // res.data?.map((city) => {
                //     if (city.name === area) {
                //         setUpdateAreas(city.area)
                //     }
                // }
                // )
            })
            .catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    secureLocalStorage.removeItem("userData");
                    navigate('/login');
                    toast.error('Token Invalid! Login Again')
                }
            })
    };

    const handleCityChange = (event) => {
        setKey(currentKey => currentKey + 1)
        cities?.map((city) => {
            if (city._id === event?._id) {
                setAreas(city.area);
                // setUpdateAreas(city.area)
            }
        }
        )
    };

    const handleAreaChange = (event) => {
        setSelectedAreas(event)
    }

    const handleAddArea = (event) => {
        event.preventDefault();
        const form = event.target;
        const division = form.State?.value
        const district = form.District?.value
        const city = form.City?.value

        const areaData = {
            "deal_id": Param?.deal_id,
            "division": division,
            "district": district,
            "city": city,
            "areas": selectedAreas,
            "across_country": isAllOvreCountry?.value ? 1 : 0
        }

        const areaData1 = {
            "deal_id": Param?.deal_id,
            "across_country": isAllOvreCountry?.value ? 1 : 0
        }

        // console.log(areaData)

        axios.post(`${import.meta.env.VITE_API_URL}/deals/add-deal-priority-areas`, isAllOvreCountry?.value ? areaData1 : areaData,
            {
                headers: {
                    authorization: `Bearer ${userData?.user_token}`
                }
            })
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    document.getElementById('newAreaModalClose').click();
                    refetch();
                    // setIsAllOvreCountry(null)
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

    const handlePriorityAreaDelete = () => {
        axios.delete(`${import.meta.env.VITE_API_URL}/deals/delete-deal-priority-areas/${Param?.deal_id}/${priorityArea?.id}`,
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
            });
    }

    return (
        <PhotoProvider>
            <div>
                <Helmet>
                    <title>Deal Setting - Ekka Dashboard</title>
                    <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
                </Helmet>
                <div className="page-breadcrumb d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Deal Setting</div>
                    <div className="ps-3 d-none d-sm-flex">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 p-0">
                                <li className="breadcrumb-item"><Link to="/dashboard"><i className="bx bx-home-alt"></i></Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page"><Link to="/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Deals</li>
                                {Param?.type && <li className="breadcrumb-item active" aria-current="page"><Link to='/dashboard/deals/add-deals'>Add Deal</Link></li>}
                                {Param?.type && <li className="breadcrumb-item active" aria-current="page">{`${Param?.type.replace(/^./, Param?.type[0].toUpperCase())}`}</li>}
                                <li className="breadcrumb-item active" aria-current="page">Deal Setting</li>
                            </ol>
                        </nav>
                    </div>

                    <div className="ms-auto">
                        <div className="btn-group">
                            <button data-bs-toggle="modal" data-bs-target="#deleteConfermationModal" type="button" className="btn btn-danger rounded"><i className="bx bx-message-square-x"></i>Delete Deal</button>
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

                    <div className="modal fade" id="dealTypeModal" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Deal Type</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <form onSubmit={handleTypeUpdate} className="row g-3">
                                    <div className="modal-body mx-2 mb-2">
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="Name" className="form-label">Deal Type</label>
                                            {dealsTypes && <Select className="mb-2" name='deal_type' id='deal_type' required placeholder="Select Deal Type" isClearable options={dealsTypes} getOptionLabel={(dealsType) => dealsType.name} getOptionValue={(dealsType) => dealsType.name} defaultValue={{ name: deal?.deal_type, name: deal?.deal_type }} />}
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Deal Type</button>
                                    </div>
                                </form>
                                <div className="modal-footer px-4">
                                    <button id='dealTypeModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="dealTitleModal" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Deal Title</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <form onSubmit={handleTitleUpdate} className="row g-3">
                                    <div className="modal-body mx-2 mb-2">
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="Name" className="form-label">Title</label>
                                            <input type="text" defaultValue={deal?.title} placeholder='Enter Deal Title' className="form-control text-capitalize" id="Title" name='Title' />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Deal Title</button>
                                    </div>
                                </form>
                                <div className="modal-footer px-4">
                                    <button id='dealTitleModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="dealDescriptionModal" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Deal Description</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <form onSubmit={handleDescriptionUpdate} className="row g-3">
                                    <div className="modal-body mx-2 mb-2">
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="Name" className="form-label">Deal Description</label>
                                            <textarea type="text" name='description' id='description' className="form-control" defaultValue={deal?.description} placeholder='Enter Deal Description' aria-describedby="basic-addon1" />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Deal Description</button>
                                    </div>
                                </form>
                                <div className="modal-footer px-4">
                                    <button id='dealDescriptionModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="dealCategoryModal" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Deal Category</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <form onSubmit={handleCategorynUpdate} className="row g-3">
                                    <div className="modal-body mx-2 mb-2">
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="Name" className="form-label">Category</label>
                                            {category && <Select className="mb-2" name='category' id='category' required placeholder="Select Categoty" isClearable options={categories} getOptionLabel={(category) => category.name} getOptionValue={(category) => category._id} defaultValue={{ _id: category._id, name: category.name }} />}
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Brand Contact No.</button>
                                    </div>
                                </form>
                                <div className="modal-footer px-4">
                                    <button id='dealCategoryModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="dealThumbnailModal" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Deal Thumbnail</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <form onSubmit={handleLogoUpdate} className="row g-3">
                                    <div className="modal-body mx-2 mb-2">
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="thumbnail_photo" className="form-label">Deal Thumbnail</label>
                                            <input required className="form-control" type="file" accept=".png, .jpg" id="thumbnail_photo" name="thumbnail_photo" />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Update Deal Thumbnail</button>
                                    </div>
                                </form>
                                <div className="modal-footer px-4">
                                    <button id='dealThumbnailModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="dealEndStartModal" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Deal Start And End Time</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <form onSubmit={handleCurent} className="row g-3">
                                    <div className="modal-body mx-2 mb-2">
                                        <div class="mb-3">
                                            <label class="form-label">Start Datetime</label>
                                            <input name='start_datetime' id='start_datetime' type="datetime-local" class="form-control" />
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">End Datetime</label>
                                            <input name='end_datetime' id='end_datetime' type="datetime-local" class="form-control" />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-edit'></i>Make It Curent</button>
                                    </div>
                                </form>
                                <div className="modal-footer px-4">
                                    <button id='dealEndStartModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="row">
                    <div className="col-xl-9 mx-auto mt-3">
                        <h6 className="mb-0 text-uppercase">Update Deal Data</h6>
                        <hr />
                        <div className="card">
                            <div className="card-body">
                                <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Type</span>
                                    <input type="text" className="form-control text-capitalize" value={deal?.deal_type} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                    <button onClick={handleDealType} data-bs-toggle="modal" data-bs-target="#dealTypeModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                                </div>
                                <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Title</span>
                                    <input type="text" className="form-control text-capitalize" value={deal?.title} disabled aria-label="Name" aria-describedby="basic-addon1" />
                                    <button data-bs-toggle="modal" data-bs-target="#dealTitleModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                                </div>
                                <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Description</span>
                                    <textarea type="text" className="form-control" value={deal?.description} disabled aria-label="Address" aria-describedby="basic-addon1" />
                                    <button data-bs-toggle="modal" data-bs-target="#dealDescriptionModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                                </div>
                                <div className="input-group mb-3"> <span className="input-group-text" id="basic-addon1">Category</span>
                                    <input type="text" className="form-control" value={category?.name} disabled aria-label="Contact" aria-describedby="basic-addon1" />
                                    <button data-bs-toggle="modal" data-bs-target="#dealCategoryModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                                </div>
                                <div className="input-group mb-4"> <span className="input-group-text" id="basic-addon1">Brand Image</span>
                                    <PhotoView key={deal?._id} src={`${import.meta.env.VITE_API_URL}/${deal?.thumbnail_photo}`}><img className='cursor-pointer' width="36" alt={deal?.name} src={`${import.meta.env.VITE_API_URL}/${deal?.thumbnail_photo}`}></img></PhotoView>
                                    <input type="text" className="form-control" value={deal?.thumbnail_photo} disabled aria-label="Contact" aria-describedby="basic-addon1" />
                                    <button data-bs-toggle="modal" data-bs-target="#dealThumbnailModal" className='btn btn-primary'><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>
                                </div>
                                <div className='d-md-flex justify-content-md-between'>
                                    <div>
                                        <div className='d-flex justify-content-between justify-content-md-start'>
                                            <label className="form-label me-md-4" htmlFor="flexSwitchCheckChecked">Current Deal</label>
                                            <div className="form-check form-switch">
                                                <input onChange={handleCurentButton} disabled={deal?.products?.length == 0 || deal?.photos?.length == 0 ? true : false} checked={deal?.status?.is_active == 0 ? false : true} className="form-check-input cursor-pointer" type="checkbox" id="flexSwitchCheckChecked" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='d-flex justify-content-between justify-content-md-start'>
                                            <label className="form-label me-md-4" htmlFor="flexSwitchCheckChecked">Latest Deal</label>
                                            <div className="form-check form-switch">
                                                <input onChange={handleLatest} disabled={deal?.status?.is_active == 0 ? true : false} checked={deal?.status?.is_latest_deal == 0 ? false : true} className="form-check-input cursor-pointer" type="checkbox" id="flexSwitchCheckChecked" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='d-flex justify-content-between justify-content-md-start'>
                                            <label className="form-label me-md-4" htmlFor="flexSwitchCheckChecked">Hot Deal</label>
                                            <div className="form-check form-switch">
                                                <input onChange={handleHot} disabled={deal?.status?.is_active == 0 ? true : false} checked={deal?.status?.is_hot_deal == 0 ? false : true} className="form-check-input cursor-pointer" type="checkbox" id="flexSwitchCheckChecked" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button id='dealEndStartModalOpen' data-bs-toggle="modal" data-bs-target="#dealEndStartModal" className='btn d-none '><i className='bx bx-message-square-edit ps-2 pe-1'></i></button>

                <div className="row">
                    <div className="col-xl-9 mx-auto mt-3">
                        <div className='d-flex align-items-center justify-content-between'>
                            <h6 className="mb-0 text-uppercase">Add Deal Product</h6>
                            <div className="btn-group">
                                <button onClick={handleProductName} data-bs-toggle="modal" data-bs-target="#newProductModal" type="button" className="btn btn-primary rounded"><i className="bx bx-list-plus"></i>Add Product</button>
                                <div className="modal fade" id="newProductModal" tabIndex="-1" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Add New Deal</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <form onSubmit={handleAddProduct} className="row g-3">
                                                <div className="modal-body mx-2 mb-2">
                                                    <div className="col-md-12 mb-2">
                                                        <label htmlFor="Name" className="form-label">Product Name</label>
                                                        {Allproduct && <CreatableSelect isClearable id="name" name='name' options={Allproduct} />}
                                                        {/* <input required type="text" placeholder='Enter Product Name' className="form-control" id="name" name='name' /> */}
                                                    </div>
                                                    <div className="col-md-12 mb-2">
                                                        <label htmlFor="Name" className="form-label">Product Price</label>
                                                        <input required type="text" placeholder='Enter Product Price' className="form-control" id="price" name='price' />
                                                    </div>
                                                    <div className="col-md-12 mb-3">
                                                        <label htmlFor="Name" className="form-label">Product Offer Price</label>
                                                        <input required type="text" placeholder='Enter Product Offer Price' className="form-control" id="offer_price" name='offer_price' />
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
                                <div className="ms-auto">
                                    <div className="btn-group">
                                        <div className="modal fade" tabIndex="-1" id="deleteConfermationModal2" aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Delete Confermation</h5>
                                                        <button id='deleteModalClose2' type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <p>Are you sure you want to delete?</p>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                                        <button onClick={handleProductDelete} type="button" className="btn btn-danger">Yes, Delete</button>
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
                                                <th>Price</th>
                                                <th>Offer Price</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deal?.products?.length == 0 ? <tr>
                                                <td colSpan='5' className='text-center'>No data available in table</td>
                                                <td className='d-none'></td>
                                                <td className='d-none'></td>
                                                <td className='d-none'></td>
                                                <td className='d-none'></td>
                                            </tr> : <></>}
                                            {deal?.products?.map((product, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td className='text-capitalize'>{product?.name}</td>
                                                    <td>{product?.price}</td>
                                                    <td>{product?.offer_price}</td>
                                                    <td>
                                                        <button onClick={() => setProduct(product)} data-bs-toggle="modal" data-bs-target="#deleteConfermationModal2" type="button" className="btn btn-outline-danger btn-sm"><i className='bx bx-slider'></i>Delete</button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th>SL No.</th>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Offer Price</th>
                                                <th>Action</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-9 mx-auto mt-3">
                        <h6 className="mb-0 text-uppercase">Add Deal Photos</h6>
                        <hr />
                        <div className="card">
                            <div className="card-body">
                                <div className='d-flex col-12 flex-wrap gap-2 justify-content-center'>
                                    {deal?.photos?.map((photo) =>
                                        <div className="container">
                                            <PhotoView src={`${import.meta.env.VITE_API_URL}/${photo}`}>
                                                <img width='120' src={`${import.meta.env.VITE_API_URL}/${photo}`} alt="Avatar" className="image img-fluid img-thumbnail" />
                                            </PhotoView>
                                            <div onClick={() => handleDeletePhoto(photo)} className="middle">
                                                <button className='btn btn-danger'><i className='bx bx-x-circle ms-1'></i></button>
                                            </div>
                                        </div>
                                    )}

                                    <div onClick={handleAddPhoto} className="container cursor-pointer">
                                        <img width='137' height='135' src="https://i.postimg.cc/8zqJ2ZJJ/add-image.jpg" alt="Add Photo" className="img-thumbnail" />
                                    </div>
                                    <div>
                                        <input onChange={handleUploadPhoto} id='deal_photo' required className="form-control d-none" type="file" accept=".png, .jpg" name="deal_photo" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-9 mx-auto mt-3">
                        <div className='d-flex align-items-center justify-content-between'>
                            <h6 className="mb-0 text-uppercase">Add Priority Area</h6>
                            <div className="btn-group">
                                <button onClick={handleLocationPreload} data-bs-toggle="modal" data-bs-target="#newAreaModal" type="button" className="btn btn-primary rounded"><i className="bx bx-list-plus"></i>Add Area</button>
                                <div className="modal fade" id="newAreaModal" tabIndex="-1" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Add Area</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <form onSubmit={handleAddArea} className="row g-3">
                                                <div className="modal-body mx-2 mb-2">
                                                    {deal?.priority_area?.length <= 0 && <div className="col-md-12 mb-3">
                                                        <label htmlFor="Name" className="form-label">Want To Run All Over Country?</label>
                                                        <Select onChange={(e) => setIsAllOvreCountry(e)} required className="mb-3" isClearable id="across_country" name="across_country" placeholder="Select.." options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]} />
                                                    </div>}
                                                    {(deal?.priority_area?.length > 0 || isAllOvreCountry?.value === false) && <div>
                                                        <div className="col-md-12 mb-3">
                                                            <label htmlFor="Name" className="form-label">Division</label>
                                                            <Select onChange={handleDivisionChange} required className="mb-3" isClearable id="State" name="State" placeholder="Select Division" options={division} getOptionLabel={(division) => division.name} getOptionValue={(division) => division.name} />
                                                        </div>
                                                        <div className="col-md-12 mb-3">
                                                            <label htmlFor="Name" className="form-label">District</label>
                                                            <Select onChange={(e) => handleDistrictChange(e)} required className="mb-3" isClearable id="District" name="District" placeholder="Select District" options={district} getOptionLabel={(district) => district.name} getOptionValue={(district) => district.name} />
                                                        </div>
                                                        <div className="col-md-12 mb-3">
                                                            <label htmlFor="Name" className="form-label">City</label>
                                                            <Select onChange={(e) => handleCityChange(e)} required className="mb-3" isClearable id="City" name="City" placeholder="Select City" options={cities} getOptionLabel={(city) => city.name} getOptionValue={(city) => city.name} />
                                                        </div>
                                                        <div className="col-md-12 mb-3">
                                                            <label htmlFor="Name" className="form-label">Area</label>
                                                            <Select
                                                                id='priority_area'
                                                                name='priority_area'
                                                                key={key}
                                                                onChange={(e) => handleAreaChange(e)}
                                                                closeMenuOnSelect={false}
                                                                components={animatedComponents}
                                                                // defaultValue={deal?.priority_area}
                                                                isMulti
                                                                options={areas}
                                                                getOptionLabel={(area) => area.name}
                                                                getOptionValue={(area) => area.id}
                                                            />
                                                        </div>
                                                    </div>}
                                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-add'></i>Add Areas</button>
                                                </div>
                                            </form>
                                            <div className="modal-footer px-4">
                                                <button id='newAreaModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="modal fade" id="editAreaModal" tabIndex="-1" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Update Area</h5>
                                                <button onClick={() =>setUpdateAreas(null)} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <form onSubmit={handleAddArea} className="row g-3">
                                                <div className="modal-body mx-2 mb-2">
                                                    <div className="col-md-12 mb-3">
                                                        <label htmlFor="Name" className="form-label">Division</label>
                                                        <input disabled={true} className="form-control" id="State" name="State" placeholder="Select Division" defaultValue={priorityArea?.division} />
                                                    </div>
                                                    <div className="col-md-12 mb-3">
                                                        <label htmlFor="Name" className="form-label">District</label>
                                                        <input disabled={true} className="form-control" id="State" name="State" placeholder="Select Division" defaultValue={priorityArea?.district} />
                                                    </div>
                                                    <div className="col-md-12 mb-3">
                                                        <label htmlFor="Name" className="form-label">City</label>
                                                        <input disabled={true} className="form-control" id="State" name="State" placeholder="Select Division" defaultValue={priorityArea?.city} />
                                                    </div>
                                                    <div className="col-md-12 mb-3">
                                                        <label htmlFor="Name" className="form-label">Area</label>
                                                        {priorityArea?.areas && Updateareas && <Select
                                                            id='priority_area_update'
                                                            name='priority_area_update'
                                                            onChange={(e) => handleAreaChange(e)}
                                                            closeMenuOnSelect={false}
                                                            components={animatedComponents}
                                                            defaultValue={priorityArea?.areas}
                                                            isMulti
                                                            options={Updateareas}
                                                            getOptionLabel={(area) => area.name}
                                                            getOptionValue={(area) => area.id}
                                                        />}
                                                    </div>
                                                    <button type="submit" className="btn btn-primary w-100"><i className='bx bx-message-square-add'></i>Add Areas</button>
                                                </div>
                                            </form>
                                            <div className="modal-footer px-4">
                                                <button onClick={() =>setUpdateAreas(null)} id='editAreaModalClose' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}


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
                                                        <button onClick={handlePriorityAreaDelete} type="button" className="btn btn-danger">Yes, Delete</button>
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
                                                <th>Division</th>
                                                <th>District</th>
                                                <th>City</th>
                                                <th>Areas</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deal?.priority_area?.length == 0 ? <tr>
                                                <td colSpan='6' className='text-center'>{deal?.across_country == 1 ? "This Run All Over The Country" : 'No data available in table'}</td>
                                                <td className='d-none'></td>
                                                <td className='d-none'></td>
                                                <td className='d-none'></td>
                                                <td className='d-none'></td>
                                                <td className='d-none'></td>
                                            </tr> : <></>}
                                            {deal?.priority_area?.map((area, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td className='text-capitalize'>{area?.division}</td>
                                                    <td>{area?.district}</td>
                                                    <td>{area?.city}</td>
                                                    <td>{area?.areas.map((area, index) => index == 0 ? `${area?.name}` : `, ${area?.name}`)}</td>
                                                    <td>
                                                        {/* <button onClick={() => { setPriorityArea(area); handleDistrictChange({ id: area?.district }, area?.city); }} data-bs-toggle="modal" data-bs-target="#editAreaModal" type="button" className="btn btn-outline-primary btn-sm me-1"><i className='bx bx-slider'></i>Edit</button> */}
                                                        <button onClick={() => setPriorityArea(area)} data-bs-toggle="modal" data-bs-target="#deleteConfermationModal3" type="button" className="btn btn-outline-danger btn-sm"><i className='bx bx-slider'></i>Delete</button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th>SL No.</th>
                                                <th>Division</th>
                                                <th>District</th>
                                                <th>City</th>
                                                <th>Areas</th>
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
        </PhotoProvider>
    );
};

export default DealSetting;