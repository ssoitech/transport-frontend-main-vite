import React, { useEffect, useContext } from 'react'
import './newNavBar.css';
import { AuthContext } from '../services/AuthContext';
import { NavLink } from 'react-router-dom';


function NewNavBar() {
    const { isAuthenticated, username, logout } = useContext(AuthContext);



    return (
        <nav className="navbar nav-bar navbar-expand-lg bg-body-tertiary pr-4">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    Logo
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">

                            <NavLink exact className="nav-link active" to="/work-space">Home</NavLink>
                        </li>
                        {/* <li className="nav-item">

                            <NavLink exact className="nav-link active" to="/billing-work-space">Billing</NavLink>
                        </li> */}
                        <li className="nav-item dropdown">
                            {/* <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Dropdown
                            </a> */}
                            <ul className="dropdown-menu">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Action
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Another action
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Something else here
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            {/* <a className="nav-link disabled" aria-disabled="true">
                                Disabled
                            </a> */}
                        </li>
                    </ul>
                    <form className="d-flex" role="search">
                        <input
                            className="form-control form-control-sm me-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                        />
                        <button className="btn btn-sm btn-outline-primary" type="submit">
                            <i class="bi bi-search"></i>
                        </button>
                    </form>


                    {/* <!-- Nav Item - User Information --> */}
                    <div className="btn-group ml-4 mr-2">
                        {
                            isAuthenticated &&
                            <button type="button" className="btn btn-sm btn-outline-primary dropdown-toggle" id="userDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className='pr-2'>{username ? username : ""}</span>
                                <i className="bi bi-person-circle"></i>
                            </button>
                        }


                        {/*  <!-- Dropdown - User Information --> */}
                        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                            aria-labelledby="userDropdown">
                            <a className="dropdown-item" href="#">
                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                Profile
                            </a>
                            <a className="dropdown-item" href="#">
                                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                Settings
                            </a>
                            <a className="dropdown-item" href="#">
                                <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                Activity Log
                            </a>
                            <div className="dropdown-divider"></div>
                            {
                                isAuthenticated &&
                                <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Logout
                                </a>

                            }

                        </div>
                    </div>









                </div>
            </div>
        </nav>

    )
}

export default NewNavBar
