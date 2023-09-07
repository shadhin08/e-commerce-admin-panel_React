import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
    const [sidebarColaps, setSidebarColaps] = useState(true);
    const [sidebarColapsMobile, setSidebarColapsMobile] = useState(false);


    const handelOptionClick = event => {
        event.preventDefault();
    }

    const handelHover = () => {
        const navWarper = document.getElementsByClassName('wrapper');
        navWarper[0].classList.add('sidebar-hovered');
        if (!sidebarColaps) {
            const allArrow = document.getElementsByClassName('arrow');
            document.getElementById('desktop-toggle').classList.add('d-lg-flex')
            allArrow.forEach((element) => {
                element.classList.add('accordion-button');
            });
        }
    }

    const handelHoverOut = () => {
        const navWarper = document.getElementsByClassName('wrapper');
        navWarper[0].classList.remove('sidebar-hovered');
        if (!sidebarColaps) {
            const allArrow = document.getElementsByClassName('arrow');
            document.getElementById('desktop-toggle').classList.remove('d-lg-flex')
            allArrow.forEach((element) => {
                element.classList.remove('accordion-button');
            });
        }
    }

    const handleSudebarTogglemMobile = () => {
        setSidebarColapsMobile((current) => !current);
        if (sidebarColapsMobile) {
            const navWarper = document.getElementsByClassName('wrapper');
            navWarper[0].classList.add('toggled');
        }
        if (!sidebarColapsMobile) {
            const navWarper = document.getElementsByClassName('wrapper');
            navWarper[0].classList.remove('toggled');
            setSidebarColapsMobile((current) => !current);
        }
    }

    const handleSudebarToggle = () => {
        setSidebarColaps((current) => !current);
        if (sidebarColaps) {
            const navWarper = document.getElementsByClassName('wrapper');
            navWarper[0].classList.add('toggled');
        }
        if (!sidebarColaps) {
            const navWarper = document.getElementsByClassName('wrapper');
            navWarper[0].classList.remove('toggled');
        }
    }

    return (
        <div onMouseOver={handelHover} onMouseOut={handelHoverOut} className='overflow-auto'>
            <div className="sidebar-wrapper position-fixed" data-simplebar="true">
                <div className="sidebar-header">
                    <div>
                        <img src="/assets/images/logo1_white.png" width="40px" className="" alt="logo icon" />
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 800, fontSize: '30px' }} className="logo-text text-white font-weight-bold">Ekka</h4>
                    </div>
                    <div onClick={handleSudebarToggle} id='desktop-toggle' className="toggle-icon d-none d-lg-flex ms-auto mt-1"><i className='bx bx-arrow-to-left'></i>
                    </div>
                    <div onClick={handleSudebarTogglemMobile} className="toggle-icon d-lg-none ms-auto mt-1"><i className='bx bx-arrow-to-left'></i>
                    </div>
                </div>
                <ul className="metismenu" id="menu">
                    <li>
                        <NavLink className={({ isActive }) => isActive ? 'hoverd' : ' '} to="/dashboard/home">
                            <div className="parent-icon"><i className='bx bx-home-circle'></i>
                            </div>
                            <div className="menu-title">Dashboard</div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => isActive ? 'hoverd' : ' '} to="/dashboard/products">
                            <div className="parent-icon"><i className='bx bx-cart'></i>
                            </div>
                            <div className="menu-title">Products</div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => isActive ? 'hoverd' : ' '} to="/dashboard/categories">
                            <div className="parent-icon"><i className='bx bx-server'></i>
                            </div>
                            <div className="menu-title">Categories</div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => isActive ? 'hoverd' : ' '} to="/dashboard/brands">
                            <div className="parent-icon"><i className='bx bx-grid-alt'></i>
                            </div>
                            <div className="menu-title">Brands</div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => isActive ? 'hoverd' : ' '} to="/dashboard/suppliers">
                            <div className="parent-icon"><i className='bx bx-store-alt'></i>
                            </div>
                            <div className="menu-title">Suppliers</div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => isActive ? 'hoverd' : ' '} to="/dashboard/customers">
                            <div className="parent-icon"><i className='bx bx-user'></i>
                            </div>
                            <div className="menu-title">Customers</div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => isActive ? 'hoverd' : ' '} to="/dashboard/orders">
                            <div className="parent-icon"><i className='bx bx-box'></i>
                            </div>
                            <div className="menu-title">Orders</div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => isActive ? 'hoverd' : ' '} to="/dashboard/vendors">
                            <div className="parent-icon"><i className='bx bx-street-view'></i>
                            </div>
                            <div className="menu-title">Vendors</div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => isActive ? 'hoverd' : ' '} to="/dashboard/users">
                            <div className="parent-icon"><i className='bx bx-user-circle'></i>
                            </div>
                            <div className="menu-title">Users</div>
                        </NavLink>
                    </li>
                    {/* <li>
                        <a onClick={handelOptionClick} className="arrow accordion-button" data-bs-toggle="collapse" href="#dashboard-expand" role="button" aria-expanded="true" aria-controls="dashboard-expand" >
                            <div className="parent-icon"><i className='bx bx-home-circle'></i>
                            </div>
                            <div className="menu-title">Dashboard</div>
                        </a>
                        <ul className="collapse show" id="dashboard-expand">
                            <li> <a href="index.html"><i className="bx bx-right-arrow-alt"></i>Default</a>
                            </li>
                            <li> <a href="index2.html"><i className="bx bx-right-arrow-alt"></i>Alternate</a>
                            </li>
                        </ul>
                    </li> */}
                    <li>
                        <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#application-expand" role="button" aria-expanded="false" aria-controls="application-expand">
                            <div className="parent-icon"><i className="bx bx-current-location"></i>
                            </div>
                            <div className="menu-title">Locations</div>
                        </a>
                        <ul className='collapse' id='application-expand'>
                            <li> <NavLink className={({ isActive }) => isActive ? 'hoverd' : ' '} to="/dashboard/location/division"><i className="bx bx-right-arrow-alt"></i>Division</NavLink>
                            </li>
                            <li> <NavLink className={({ isActive }) => isActive ? 'hoverd' : ' '} to="/dashboard/location/district"><i className="bx bx-right-arrow-alt"></i>District</NavLink>
                            </li>
                            <li> <NavLink className={({ isActive }) => isActive ? 'hoverd' : ' '} to="/dashboard/location/city"><i className="bx bx-right-arrow-alt"></i>City</NavLink>
                            </li>
                        </ul>
                    </li>
                    {/* <li className="menu-label">UI Elements</li>
                    <li>
                        <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#ecommerce-expand" role="button" aria-expanded="false" aria-controls="ecommerce-expand">
                            <div className="parent-icon"><i className='bx bx-cart'></i>
                            </div>
                            <div className="menu-title">eCommerce</div>
                        </a>
                        <ul className='collapse' id='ecommerce-expand'>
                            <li> <a href="ecommerce-products.html"><i className="bx bx-right-arrow-alt"></i>Products</a>
                            </li>
                            <li> <a href="ecommerce-products-details.html"><i className="bx bx-right-arrow-alt"></i>Product Details</a>
                            </li>
                            <li> <a href="ecommerce-add-new-products.html"><i className="bx bx-right-arrow-alt"></i>Add New Products</a>
                            </li>
                            <li> <a href="ecommerce-orders.html"><i className="bx bx-right-arrow-alt"></i>Orders</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#components-expand" role="button" aria-expanded="false" aria-controls="components-expand">
                            <div className="parent-icon"><i className='bx bx-bookmark-heart'></i>
                            </div>
                            <div className="menu-title">Components</div>
                        </a>
                        <ul className='collapse' id='components-expand'>
                            <li> <a href="component-alerts.html"><i className="bx bx-right-arrow-alt"></i>Alerts</a>
                            </li>
                            <li> <a href="component-accordions.html"><i className="bx bx-right-arrow-alt"></i>Accordions</a>
                            </li>
                            <li> <a href="component-badges.html"><i className="bx bx-right-arrow-alt"></i>Badges</a>
                            </li>
                            <li> <a href="component-buttons.html"><i className="bx bx-right-arrow-alt"></i>Buttons</a>
                            </li>
                            <li> <a href="component-cards.html"><i className="bx bx-right-arrow-alt"></i>Cards</a>
                            </li>
                            <li> <a href="component-carousels.html"><i className="bx bx-right-arrow-alt"></i>Carousels</a>
                            </li>
                            <li> <a href="component-list-groups.html"><i className="bx bx-right-arrow-alt"></i>List Groups</a>
                            </li>
                            <li> <a href="component-media-object.html"><i className="bx bx-right-arrow-alt"></i>Media Objects</a>
                            </li>
                            <li> <a href="component-modals.html"><i className="bx bx-right-arrow-alt"></i>Modals</a>
                            </li>
                            <li> <a href="component-navs-tabs.html"><i className="bx bx-right-arrow-alt"></i>Navs & Tabs</a>
                            </li>
                            <li> <a href="component-navbar.html"><i className="bx bx-right-arrow-alt"></i>Navbar</a>
                            </li>
                            <li> <a href="component-paginations.html"><i className="bx bx-right-arrow-alt"></i>Pagination</a>
                            </li>
                            <li> <a href="component-popovers-tooltips.html"><i className="bx bx-right-arrow-alt"></i>Popovers & Tooltips</a>
                            </li>
                            <li> <a href="component-progress-bars.html"><i className="bx bx-right-arrow-alt"></i>Progress</a>
                            </li>
                            <li> <a href="component-spinners.html"><i className="bx bx-right-arrow-alt"></i>Spinners</a>
                            </li>
                            <li> <a href="component-notifications.html"><i className="bx bx-right-arrow-alt"></i>Notifications</a>
                            </li>
                            <li> <a href="component-avtars-chips.html"><i className="bx bx-right-arrow-alt"></i>Avatrs & Chips</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#content-expand" role="button" aria-expanded="false" aria-controls="content-expand">
                            <div className="parent-icon"><i className="bx bx-repeat"></i>
                            </div>
                            <div className="menu-title">Content</div>
                        </a>
                        <ul className='collapse' id='content-expand'>
                            <li> <a href="content-grid-system.html"><i className="bx bx-right-arrow-alt"></i>Grid System</a>
                            </li>
                            <li> <a href="content-typography.html"><i className="bx bx-right-arrow-alt"></i>Typography</a>
                            </li>
                            <li> <a href="content-text-utilities.html"><i className="bx bx-right-arrow-alt"></i>Text Utilities</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#icon-expand" role="button" aria-expanded="false" aria-controls="icon-expand">
                            <div className="parent-icon"> <i className="bx bx-donate-blood"></i>
                            </div>
                            <div className="menu-title">Icons</div>
                        </a>
                        <ul className='collapse' id='icon-expand'>
                            <li> <a href="icons-line-icons.html"><i className="bx bx-right-arrow-alt"></i>Line Icons</a>
                            </li>
                            <li> <a href="icons-boxicons.html"><i className="bx bx-right-arrow-alt"></i>Boxicons</a>
                            </li>
                            <li> <a href="icons-feather-icons.html"><i className="bx bx-right-arrow-alt"></i>Feather Icons</a>
                            </li>
                        </ul>
                    </li>
                    <li className="menu-label">Forms & Tables</li>
                    <li>
                        <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#forms-expand" role="button" aria-expanded="false" aria-controls="forms-expand">
                            <div className="parent-icon"><i className='bx bx-message-square-edit'></i>
                            </div>
                            <div className="menu-title">Forms</div>
                        </a>
                        <ul className='collapse' id='forms-expand'>
                            <li> <a href="form-elements.html"><i className="bx bx-right-arrow-alt"></i>Form Elements</a>
                            </li>
                            <li> <a href="form-input-group.html"><i className="bx bx-right-arrow-alt"></i>Input Groups</a>
                            </li>
                            <li> <a href="form-layouts.html"><i className="bx bx-right-arrow-alt"></i>Forms Layouts</a>
                            </li>
                            <li> <a href="form-validations.html"><i className="bx bx-right-arrow-alt"></i>Form Validation</a>
                            </li>
                            <li> <a href="form-wizard.html"><i className="bx bx-right-arrow-alt"></i>Form Wizard</a>
                            </li>
                            <li> <a href="form-text-editor.html"><i className="bx bx-right-arrow-alt"></i>Text Editor</a>
                            </li>
                            <li> <a href="form-file-upload.html"><i className="bx bx-right-arrow-alt"></i>File Upload</a>
                            </li>
                            <li> <a href="form-date-time-pickes.html"><i className="bx bx-right-arrow-alt"></i>Date Pickers</a>
                            </li>
                            <li> <a href="form-select2.html"><i className="bx bx-right-arrow-alt"></i>Select2</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#tables-expand" role="button" aria-expanded="false" aria-controls="tables-expand">
                            <div className="parent-icon"><i className="bx bx-grid-alt"></i>
                            </div>
                            <div className="menu-title">Tables</div>
                        </a>
                        <ul className='collapse' id='tables-expand'>
                            <li> <a href="table-basic-table.html"><i className="bx bx-right-arrow-alt"></i>Basic Table</a>
                            </li>
                            <li> <a href="table-datatable.html"><i className="bx bx-right-arrow-alt"></i>Data Table</a>
                            </li>
                        </ul>
                    </li>
                    <li className="menu-label">Pages</li>
                    <li>
                        <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#authentication-expand" role="button" aria-expanded="false" aria-controls="authentication-expand">
                            <div className="parent-icon"><i className="bx bx-lock"></i>
                            </div>
                            <div className="menu-title">Authentication</div>
                        </a>
                        <ul className='collapse' id='authentication-expand'>
                            <li> <a href="authentication-signin.html" target="_blank"><i className="bx bx-right-arrow-alt"></i>Sign In</a>
                            </li>
                            <li> <a href="authentication-signup.html" target="_blank"><i className="bx bx-right-arrow-alt"></i>Sign Up</a>
                            </li>
                            <li> <a href="authentication-signin-with-header-footer.html" target="_blank"><i className="bx bx-right-arrow-alt"></i>Sign In with Header & Footer</a>
                            </li>
                            <li> <a href="authentication-signup-with-header-footer.html" target="_blank"><i className="bx bx-right-arrow-alt"></i>Sign Up with Header & Footer</a>
                            </li>
                            <li> <a href="authentication-forgot-password.html" target="_blank"><i className="bx bx-right-arrow-alt"></i>Forgot Password</a>
                            </li>
                            <li> <a href="authentication-reset-password.html" target="_blank"><i className="bx bx-right-arrow-alt"></i>Reset Password</a>
                            </li>
                            <li> <a href="authentication-lock-screen.html" target="_blank"><i className="bx bx-right-arrow-alt"></i>Lock Screen</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="user-profile.html">
                            <div className="parent-icon"><i className="bx bx-user-circle"></i>
                            </div>
                            <div className="menu-title">User Profile</div>
                        </a>
                    </li>
                    <li>
                        <a href="timeline.html">
                            <div className="parent-icon"> <i className="bx bx-video-recording"></i>
                            </div>
                            <div className="menu-title">Timeline</div>
                        </a>
                    </li>
                    <li>
                        <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#error-expand" role="button" aria-expanded="false" aria-controls="merror-expand">
                            <div className="parent-icon"><i className="bx bx-error"></i>
                            </div>
                            <div className="menu-title">Errors</div>
                        </a>
                        <ul className='collapse' id='error-expand'>
                            <li> <a href="errors-404-error.html" target="_blank"><i className="bx bx-right-arrow-alt"></i>404 Error</a>
                            </li>
                            <li> <a href="errors-500-error.html" target="_blank"><i className="bx bx-right-arrow-alt"></i>500 Error</a>
                            </li>
                            <li> <a href="errors-coming-soon.html" target="_blank"><i className="bx bx-right-arrow-alt"></i>Coming Soon</a>
                            </li>
                            <li> <a href="error-blank-page.html" target="_blank"><i className="bx bx-right-arrow-alt"></i>Blank Page</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="faq.html">
                            <div className="parent-icon"><i className="bx bx-help-circle"></i>
                            </div>
                            <div className="menu-title">FAQ</div>
                        </a>
                    </li>
                    <li>
                        <a href="pricing-table.html">
                            <div className="parent-icon"><i className="bx bx-diamond"></i>
                            </div>
                            <div className="menu-title">Pricing</div>
                        </a>
                    </li>
                    <li className="menu-label">Charts & Maps</li>
                    <li>
                        <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#charts-expand" role="button" aria-expanded="false" aria-controls="charts-expand">
                            <div className="parent-icon"><i className="bx bx-line-chart"></i>
                            </div>
                            <div className="menu-title">Charts</div>
                        </a>
                        <ul className='collapse' id='charts-expand'>
                            <li> <a href="charts-apex-chart.html"><i className="bx bx-right-arrow-alt"></i>Apex</a>
                            </li>
                            <li> <a href="charts-chartjs.html"><i className="bx bx-right-arrow-alt"></i>Chartjs</a>
                            </li>
                            <li> <a href="charts-highcharts.html"><i className="bx bx-right-arrow-alt"></i>Highcharts</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#map-expand" role="button" aria-expanded="false" aria-controls="map-expand">
                            <div className="parent-icon"><i className="bx bx-map-alt"></i>
                            </div>
                            <div className="menu-title">Maps</div>
                        </a>
                        <ul className='collapse' id='map-expand'>
                            <li> <a href="map-google-maps.html"><i className="bx bx-right-arrow-alt"></i>Google Maps</a>
                            </li>
                            <li> <a href="map-vector-maps.html"><i className="bx bx-right-arrow-alt"></i>Vector Maps</a>
                            </li>
                        </ul>
                    </li>
                    <li className="menu-label">Others</li>
                    <li>
                        <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#menue-expand" role="button" aria-expanded="false" aria-controls="menue-expand">
                            <div className="parent-icon"><i className="bx bx-menu"></i>
                            </div>
                            <div className="menu-title">Menu Levels</div>
                        </a>
                        <ul className='collapse' id='menue-expand'>
                            <li> <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#level1-expand" role="button" aria-expanded="false" aria-controls="level1-expand"><i className="bx bx-right-arrow-alt"></i>Level One</a>
                                <ul className='collapse' id='level1-expand'>
                                    <li> <a onClick={handelOptionClick} className="arrow accordion-button collapsed" data-bs-toggle="collapse" href="#level2-expand" role="button" aria-expanded="false" aria-controls="level2-expand"><i className="bx bx-right-arrow-alt"></i>Level Two</a>
                                        <ul className='collapse' id='level2-expand'>
                                            <li> <a href="javascript:;"><i className="bx bx-right-arrow-alt"></i>Level Three</a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="https://codervent.com/rocker/documentation/index.html" target="_blank">
                            <div className="parent-icon"><i className="bx bx-folder"></i>
                            </div>
                            <div className="menu-title">Documentation</div>
                        </a>
                    </li>
                    <li>
                        <a href="https://themeforest.net/user/codervent" target="_blank">
                            <div className="parent-icon"><i className="bx bx-support"></i>
                            </div>
                            <div className="menu-title">Support</div>
                        </a>
                    </li> */}
                </ul>
            </div>
        </div>
    );
};

export default SideBar;