import React from 'react';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
    return (
        <div className='d-flex flex-column justify-content-center align-items-center mt-5'>
            <Helmet>
                <title>Dashboard - Ekka Dashboard</title>
                <link rel="icon" type="image/svg+xml" href="/assets/images/logo1.png" />
            </Helmet>
            <img src='/assets/images/logo2.png' width='150' alt="Ekka" />
            <h4 className='text-secondary text-center mt-3'>Welcome To Ekka Dashboard</h4>
        </div>
    );
};

export default Dashboard;