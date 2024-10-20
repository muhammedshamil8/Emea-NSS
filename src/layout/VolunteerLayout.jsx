import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import AuthRoleRequire from '@/components/router/Authrole';
import { useAuth } from '@/context/AuthContext';
import { User, Calendar, Home, LogOut } from 'lucide-react';
import classNames from 'classnames';
import { Toaster } from "@/components/ui/toaster";
import { doc, getDoc, collection } from "firebase/firestore";
import { db } from "@/config/firebase";

function VolunteerLayout() {
  const authContext = useAuth();
  const { user, role: userRole, handleSignOut } = authContext || {};
  const location = useLocation();
  const [myData, setMyData] = useState(null); // State to hold user data

  const navLinks = [
    { title: 'Dashboard', link: '/volunteer', icon: <Home size={20} /> },
    { title: 'Profile', link: '/volunteer/profile', icon: <User size={20} /> },
    { title: 'Events', link: '/volunteer/events', icon: <Calendar size={20} /> },
  ];

  // Fetch user data once when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(collection(db, "Users"), user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setMyData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <AuthRoleRequire role="volunteer">
      <header className="bg-green-600 text-white p-4 flex justify-between items-center z-50">
        <div className="text-lg font-bold">Volunteer Panel</div>
        <div className="flex items-center space-x-4">
          <span className='hidden md:block'>{user?.displayName}</span>
          <button onClick={handleSignOut} className="flex items-center bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg">
            <LogOut className="mr-2" size={20} />
            Sign Out
          </button>
        </div>
      </header>

      <nav className="hidden md:flex bg-green-500 text-white p-4 z-50">
        <ul className="flex gap-6">
          {navLinks.map((navLink, index) => (
            <li key={index} className={classNames('hover:bg-green-700 p-2 rounded-lg', {
              'bg-green-700': location.pathname === navLink.link
            })}>
              <Link to={navLink.link} className="flex items-center gap-2">
                {navLink.icon}
                {navLink.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <main className="h-full mb-20 md:mb-0 bg-slate-50">
        <Outlet context={{ myData }} /> {/* Pass user data to Outlet */}
      </main>

      <nav className="fixed bottom-0 w-full bg-green-600 text-white md:hidden">
        <ul className="flex justify-around p-2">
          {navLinks.map((navLink, index) => (
            <li key={index} className={classNames('hover:bg-green-700 p-2 rounded-lg', {
              'bg-green-700': location.pathname === navLink.link
            })}>
              <Link to={navLink.link} className="flex flex-col items-center">
                {navLink.icon}
                <span className="text-xs">{navLink.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Toaster />
    </AuthRoleRequire>
  );
}

export default VolunteerLayout;
