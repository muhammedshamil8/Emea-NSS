import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar, Footer } from "../components/layout";

function GuestLayout() {
    return (
        <main className='w-full'>
            <div className="fixed !z-50 left-0 w-full right-0 h-16  top-0 bg-white shadow-sm shadow-gray-400 max-w-full">
                <NavBar />
            </div>
            <div className="mt-16" />
            <Outlet />
            <Footer />
        </main>
    )
}

export default GuestLayout
