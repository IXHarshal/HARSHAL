import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiPieChart, FiList } from 'react-icons/fi';

const Navbar = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-2xl text-indigo-600">AI Expense</span>
                        </div>
                        <div className="ml-6 flex items-center space-x-4">
                            <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                                <FiPieChart /> Dashboard
                            </Link>
                            <Link to="/expenses" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                                <FiList /> Expenses
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-500 mr-4 font-medium hidden sm:block">Hello, {user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 bg-indigo-50 border border-transparent rounded-md px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                        >
                            <FiLogOut /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
