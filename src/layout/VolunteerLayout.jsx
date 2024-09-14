import { Link, Outlet, useLocation } from 'react-router-dom';
import AuthRoleRequire from '../components/router/Authrole';
import { useAuth } from '../context/AuthContext';
import { User, Calendar, Home, LogOut } from 'lucide-react';
import classNames from 'classnames';
function VolunteerLayout() {
  const authContext = useAuth();
  const { user, role: userRole, handleSignOut } = authContext || {};
  const location = useLocation();
  const navLinks = [
    {
      title: 'Dashboard',
      link: '/volunteer',
      icon: <Home size={20} />
    },
    {
      title: 'Profile',
      link: '/volunteer/profile',
      icon: <User size={20} />
    },
    {
      title: 'Events',
      link: '/volunteer/events',
      icon: <Calendar size={20} />
    }
  ];

  return (
    <AuthRoleRequire role="volunteer">
      {/* Header Section */}
      <header className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">Volunteer Panel</div>
        <div className="flex items-center space-x-4">
          <span>{user?.displayName}</span>
          <button
            onClick={handleSignOut}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
          >
            <LogOut className="mr-2" size={20} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation for larger screens */}
      <nav className="hidden md:flex bg-green-500 text-white p-4">
        <ul className="flex gap-6">
          {navLinks.map((navLink, index) => (
            <li key={index} className={classNames('hover:bg-green-700 p-2 rounded-lg',
              {
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

      {/* Main Content Area */}
      <main className="p-4">
        <Outlet />
      </main>

      {/* Bottom Navigation for mobile devices */}
      <nav className="fixed bottom-0 w-full bg-green-600 text-white md:hidden">
        <ul className="flex justify-around p-2">
          {navLinks.map((navLink, index) => (
             <li key={index} className={classNames('hover:bg-green-700 p-2 rounded-lg',
             {
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
    </AuthRoleRequire>
  );
}

export default VolunteerLayout;
