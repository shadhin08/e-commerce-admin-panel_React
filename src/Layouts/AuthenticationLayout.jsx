import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthenticationLayout = () => {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
};

export default AuthenticationLayout;