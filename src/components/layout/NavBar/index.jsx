import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import navLinks from '@/const/navLinks';
import Logo from '@/assets/icons/NavLogo.png';
import { LayoutGrid, X } from 'lucide-react'
import { useState } from 'react';

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const handleClick = () => {
    navigate('/login');
  };

  const handleContactScroll = () => {
    scroll.scrollTo('contact', {
      smooth: true,
      duration: 500,
    });
  };

  const toggleNav = () => {
    setNavOpen(!navOpen);
  }

  return (
    <div className='flex justify-between p-2 max-w-[1300px] mx-auto !z-50'>
      <div>
        <img src={Logo} alt='logo' className='w-auto h-12' />
      </div>
      <div className='hidden md:flex items-center justify-center gap-4'>
        {navLinks.map((link, index) => (
          <div key={index} className="flex items-center justify-center gap-4" onClick={handleContactScroll}>
            {link.href === '/contact' ? (
              <ScrollLink
                onClick={() => {
                  if (location.pathname !== '/' || location.pathname !== '/#contact') navigate('/');
                  if (location.pathname === '/' && location.pathname !== '/#contact') navigate('/#contact');
                }}
                to='contact'
                smooth={true}
                duration={500}
                className={`${location.pathname === link.href || location.hash === '#contact' ? 'text-red-500 font-bold' : 'text-black'
                  } hover:text-red-500 transition-all ease-in-out cursor-pointer`}
              >
                {link.label}
              </ScrollLink>
            ) : (
              <Link
                to={link.href}
                className={`${location.pathname === link.href && location.hash !== '#contact' ? 'text-red-500 font-bold' : 'text-black'
                  } hover:text-red-500 transition-all ease-in-out`}
              >
                {link.label}
              </Link>
            )}
          </div>
        ))}
        <button
          className='bg-red-500 text-white p-1.5 rounded-xl px-6 hover:bg-red-600'
          onClick={handleClick}
        >
          Login
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex gap-2 items-center justify-center">
        <button
          className='bg-red-500 text-white p-1.5 rounded-xl px-6 hover:bg-red-600'
          onClick={handleClick}
        >
          Login
        </button>
        <button onClick={toggleNav} className="focus:outline-none">
          <div className=" flex items-center justify-center gap-1 rounded-lg  transition-transform duration-300">
            <div
              className={`transform transition-transform duration-300 ${navOpen ? "rotate-90" : ""
                }`}
            >
              {navOpen ? (
                <X size={24} className='text-green-900' />
              ) : (
                <LayoutGrid size={24} className='text-green-900' />
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Mobile Navigation Links */}
      <div
        className={`absolute top-16 !z-50 right-10 w-36 bg-white text-black rounded-lg shadow-lg flex flex-col items-start p-4 transition-all duration-300 transform ${navOpen
          ? "scale-100 opacity-100"
          : "scale-95 opacity-0 pointer-events-none"
          }`}
      >
        {navLinks.map((link, index) => (
          <div key={index} className="flex items-center justify-center gap-4" onClick={handleContactScroll}>
            {link.href === '/contact' ? (
              <ScrollLink
                onClick={() => {
                  toggleNav();
                  if (location.pathname !== '/' || location.pathname !== '/#contact') navigate('/');
                  if (location.pathname === '/' && location.pathname !== '/#contact') navigate('/#contact');
                }}
                to='contact'
                smooth={true}
                duration={500}
                className={`${location.pathname === link.href || location.hash === '#contact' ? 'text-red-500 font-bold' : 'text-black'
                  } hover:text-red-500 transition-all ease-in-out cursor-pointer`}
              >
                {link.label}
              </ScrollLink>
            ) : (
              <Link
                to={link.href}
                onClick={() => { toggleNav() }}
                className={`${location.pathname === link.href && location.hash !== '#contact' ? 'text-red-500 font-bold' : 'text-black'
                  } hover:text-red-500 transition-all ease-in-out`}
              >
                {link.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NavBar;
