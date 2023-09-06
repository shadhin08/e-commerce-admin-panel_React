import { createBrowserRouter, Navigate } from "react-router-dom"
import AuthenticationLayout from "../Layouts/authenticationLayout";
import Login from "../Pages/Login/Login";
import DashboardLayout from "../Layouts/DashboardLayout";
import Dashboard from "../Pages/Dashboard/Dashboard/Dashboard";
import NotFound from "../Pages/NotFound/NotFound";
import Categories from "../Pages/Dashboard/Categories/Categories";
import PrivateRoute from "./PrivateRoute";
import Brands from "../Pages/Dashboard/Brands/Brands";
import BrandSetting from "../Pages/Dashboard/Brands/BrandSetting";
import CategorySetting from "../Pages/Dashboard/Categories/CategorySetting";
import Products from "../Pages/Dashboard/Products/Products";
import ProductSetting from "../Pages/Dashboard/Products/ProductSetting";
import Division from "../Pages/Dashboard/Location/Division/Division";
import DivisionSetting from "../Pages/Dashboard/Location/Division/DivisionSetting";
import District from "../Pages/Dashboard/Location/District/District";
import DistrictSetting from "../Pages/Dashboard/Location/District/DistrictSetting";
import City from "../Pages/Dashboard/Location/City/City";
import CitySetting from "../Pages/Dashboard/Location/City/CitySetting";
import CityDetails from "../Pages/Dashboard/Location/City/CityDetails";
import Suppliers from "../Pages/Dashboard/Suppliers/Suppliers";
import SupplierSetting from "../Pages/Dashboard/Suppliers/SupplierSetting";
import Customers from "../Pages/Dashboard/Customers/Customers";
import CustomerSettings from "../Pages/Dashboard/Customers/CustomerSettings";
import Vendors from "../Pages/Dashboard/Vendors/Vendors";
import VendorSettings from "../Pages/Dashboard/Vendors/VendorSettings";
import Users from "../Pages/Dashboard/Users/Users";
import UsersSetting from "../Pages/Dashboard/Users/UsersSetting";

const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthenticationLayout></AuthenticationLayout>,
        children: [
            {
                path: '/',
                element: <Navigate to="/login" />
            },
            {
                path: '/login',
                element: <Login></Login>
            },
            {
                path: "*",
                element: <NotFound></NotFound>
            }
            // {
            //     path: '/signup',
            //     element: <Signup></Signup>
            // }
        ],
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
        children: [
            {
                path: '/dashboard',
                element: <Navigate to="/dashboard/home" />
            },
            {
                path: '/dashboard/home',
                element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>
            },
            {
                path: '/dashboard/categories',
                element: <PrivateRoute><Categories></Categories></PrivateRoute>
            },
            {
                path: '/dashboard/categories/setting/:id',
                element: <PrivateRoute><CategorySetting></CategorySetting></PrivateRoute>
            },
            {
                path: '/dashboard/suppliers',
                element: <PrivateRoute><Suppliers></Suppliers></PrivateRoute>
            },
            {
                path: '/dashboard/suppliers/setting/:id',
                element: <PrivateRoute><SupplierSetting></SupplierSetting></PrivateRoute>
            },
            {
                path: '/dashboard/brands',
                element: <PrivateRoute><Brands></Brands></PrivateRoute>
            },
            {
                path: '/dashboard/brands/setting/:id',
                element: <PrivateRoute><BrandSetting></BrandSetting></PrivateRoute>
            },
            {
                path: '/dashboard/products',
                element: <PrivateRoute><Products></Products></PrivateRoute>
            },
            {
                path: '/dashboard/products/setting/:id',
                element: <PrivateRoute><ProductSetting></ProductSetting></PrivateRoute>
            },
            {
                path: '/dashboard/location/division',
                element: <PrivateRoute><Division></Division></PrivateRoute>
            },
            {
                path: '/dashboard/location/division/setting/:id',
                element: <PrivateRoute><DivisionSetting></DivisionSetting></PrivateRoute>
            },
            {
                path: '/dashboard/location/district',
                element: <PrivateRoute><District></District></PrivateRoute>
            },
            {
                path: '/dashboard/location/district/setting/:id',
                element: <PrivateRoute><DistrictSetting></DistrictSetting></PrivateRoute>
            },
            {
                path: '/dashboard/location/city',
                element: <PrivateRoute><City></City></PrivateRoute>
            },
            {
                path: '/dashboard/location/city/setting/:id',
                element: <PrivateRoute><CitySetting></CitySetting></PrivateRoute>
            },
            {
                path: '/dashboard/location/city/details/:id',
                element: <PrivateRoute><CityDetails></CityDetails></PrivateRoute>
            },

            //My changes--------------------------------------------------------------------------------
            {
                path: '/dashboard/customers',
                element: <PrivateRoute><Customers></Customers></PrivateRoute>
            },
            {
                path: '/dashboard/customer/setting/:id',
                element: <PrivateRoute><CustomerSettings></CustomerSettings></PrivateRoute>
            },
            {
                path: '/dashboard/vendors',
                element: <PrivateRoute><Vendors></Vendors></PrivateRoute>
            },
            {
                path: '/dashboard/vendor/setting/:id',
                element: <PrivateRoute><VendorSettings></VendorSettings></PrivateRoute>
            },
            
            //My changes--------------------------------------------------------------------------------
            //changes by masud vai--------------------------------------------------------------------------------
            {
                path: '/dashboard/users',
                element: <PrivateRoute><Users></Users></PrivateRoute>
            },
            {
                path: '/dashboard/users/setting/:id',
                element: <PrivateRoute><UsersSetting></UsersSetting></PrivateRoute>
            }
            //changes by masud vai--------------------------------------------------------------------------------
        ]
    }
])

export default router;