import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-[--color-background]">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
