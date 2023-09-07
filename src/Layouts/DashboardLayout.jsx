import React from 'react';
import SideBar from '../Pages/Shared/SideBar/SideBar';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Pages/Shared/Footer/Footer';

const DashboardLayout = () => {
    return (
        <div>
            <div className="wrapper">
                <SideBar></SideBar>
                <Navbar></Navbar>
                <div className="page-wrapper">
                    <div className="page-content">
                        <Outlet></Outlet>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        </div>
    );
};

export default DashboardLayout;