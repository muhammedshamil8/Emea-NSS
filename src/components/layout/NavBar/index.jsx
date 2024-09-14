import { Link, useNavigate, useLocation } from 'react-router-dom';
import navLinks from '@/const/navLinks';
import Logo from '@/assets/icons/NavLogo.png';

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleClick = () => {
    navigate('/login');
  }

  return (
    <div className='flex justify-between py-2 max-w-[1200px] mx-auto !z-50 '>
      <div>
        <img src={Logo} alt='logo' className='w-auto h-12' />
      </div>
      <div className='flex items-center justify-center gap-4'>
        {navLinks.map((link, index) => (
          <div key={index} className="flex items-center justify-center gap-4">
            <Link
              to={link.href}
              className={`${
                location.pathname === link.href ? 'text-red-500 font-bold' : 'text-black'
              } hover:text-red-500 transition-all ease-in-out`} 
            >
              {link.label}
            </Link>
          </div>
        ))}
        <button
          className='bg-red-500 text-white p-1.5 rounded-xl px-6 hover:bg-red-600'
          onClick={handleClick}
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default NavBar;
