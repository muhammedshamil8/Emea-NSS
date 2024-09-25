import { Link, Outlet, useLocation } from 'react-router-dom';
import AuthRoleRequire from '@/components/router/Authrole';
import { useAuth } from '@/context/AuthContext';
import { Home, Flag, Calendar, BarChart2, Users, LogOut } from 'lucide-react';
import classNames from 'classnames';
import { Toaster } from "@/components/ui/toaster"

function AdminLayout() {
  const authContext = useAuth();
  const { user, role: userRole, handleSignOut } = authContext || {};
  const location = useLocation();

  const navLinks = [
    {
      title: 'Dashboard',
      link: '/admin',
      icon: <Home size={20} />
    },
    {
      title: 'Banners',
      link: '/admin/banners',
      icon: <Flag size={20} />
    },
    {
      title: 'Events',
      link: '/admin/events',
      icon: <Calendar size={20} />
    },
    {
      title: 'Reports',
      link: '/admin/reports',
      icon: <BarChart2 size={20} />
    },
    {
      title: 'Volunteers',
      link: '/admin/volunteers',
      icon: <Users size={20} />
    }
  ];

  return (
    <AuthRoleRequire role="admin">

      {/* Header Section */}
      <div className='fixed w-full top-0 '>
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center ">
          <div className="text-lg font-bold">Admin Panel</div>
          <button
            onClick={handleSignOut}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
          >
            <LogOut className="mr-2" size={20} />
            Sign Out
          </button>
        </header>

        {/* Navigation for larger screens */}
        <nav className="hidden md:flex bg-blue-500 text-white p-4">
          <ul className="flex gap-6">
            {navLinks.map((navLink, index) => (
              <li key={index} className={classNames('hover:bg-blue-700 p-2 rounded-lg',
                {
                  'bg-blue-700': location.pathname === navLink.link
                })}>
                <Link to={navLink.link} className={classNames('flex items-center gap-2')}>
                  {navLink.icon}
                  {navLink.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="p-4 pb-[80px] md:pb-0 h-full mt-[80px] md:mt-[165px] overflow-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation for mobile devices */}
      <nav className="fixed bottom-0 w-full bg-blue-600 text-white md:hidden">
        <ul className="flex justify-around p-2">
          {navLinks.map((navLink, index) => (
            <li key={index} className={classNames('hover:bg-blue-700 p-2 rounded-lg',
              {
                'bg-blue-700': location.pathname === navLink.link
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

export default AdminLayout;
