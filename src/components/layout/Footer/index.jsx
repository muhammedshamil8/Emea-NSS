import React from 'react'
import NssLogo from '../../../assets/icons/FooterLogo.png';
import navLinks from '../../../const/navLinks';

function Footer() {
  return (
    <footer className='bg-blue-950 rounded-t-xl w-full p-6 py-16 h-full'>
      <div className=' flex justify-between p-6 text-white max-w-[1200px] mx-auto'>
        <div className='flex flex-col gap-6'>
          <div>
           <img src={NssLogo} alt='NSS EMEA Logo' className='h-12'/>
          </div>
          <div>
            Icons
          </div>
        </div>
        <div className='flex flex-col gap-6'>
          <div className='flex gap-4'>
           {navLinks.map((link) => (
             <a href={link.href} className='text-white'>{link.label}</a>
           ))}
          </div>
          <div className='w-fit overflow-hidden rounded-full my-4'>
           <input type='text' placeholder='Email' className='bg-gray-200 text-gray-600   rounded-full px-4 h-10 w-[260px]'/><button className='bg-red-400 text-white  px-4 h-10 rounded-full -ml-10'>Subscribe</button>
          </div>
        </div>
      </div>
      <hr className='h-2 border-gray-500'/>
    </footer>
  )
}

export default Footer
