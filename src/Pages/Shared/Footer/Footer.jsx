import React from 'react';

const Footer = () => {
    const date = new Date();
    return (
        <div>
            <div className="page-footer">
                <p className="mb-0">Copyright © {date?.getFullYear()}. All right reserved.</p>
            </div>
        </div>
    );
};

export default Footer;