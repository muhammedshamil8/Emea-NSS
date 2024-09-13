import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar, Footer } from "../components/layout";

function GuestLayout() {
    return (
        <>
            <div className="fixed !z-50 left-0 right-0 h-16 mb top-0 bg-white">
                <NavBar />
            </div>
            <div className="mt-16" />
            <Outlet />
            <Footer />
        </>
    )
}

export default GuestLayout
