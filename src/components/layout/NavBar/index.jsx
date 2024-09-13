import navLinks from '@/const/navLinks';
import Logo from '@/assets/icons/NavLogo.png'
import { Link, useNavigate } from 'react-router-dom';


function NavBar() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  }
  return (
    <div className='flex justify-between p-2 max-w-[1200px] mx-auto !z-50'>
      <div>
        <img src={Logo} alt='logo' className='w-auto h-12' />
      </div>
      <div className='flex items-center justify-center gap-4'>

        {navLinks.map((link, index) => (
          <div key={index} className="flex items-center justify-center gap-4">
            <Link to={link.href} >{link.label}</Link>
          </div>
        ))}
          <button className='bg-red-500 text-white p-1.5 rounded-xl px-6' onClick={handleClick}>Login</button>
      </div>

    </div>
  )
}
export default NavBar;
