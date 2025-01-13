import React from 'react'
import NssLogo from '@/assets/icons/FooterLogo.png';
import navLinks from '@/const/navLinks';
import { NavLink } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react'

function Footer() {
  return (
    <div className='bg-[#CABBE2]/30'>
      <footer className='bg-[#262738] rounded-t-3xl w-full p-4 md:p-6 py-8 pb-3 h-full'>
        <div className=' flex flex-col md:flex-row justify-between md:p-6 text-white max-w-[1300px] mx-auto gap-4 md:gap-0'>
          <div className='flex flex-col  gap-6 w-full'>
            <div>
              <img src={NssLogo} alt='NSS EMEA Logo' className='h-10 md:h-12 mx-auto md:mx-0' />
            </div>
            <div className=' gap-2 hidden md:flex mx-auto md:mx-0 pl-14'>
              <div className='bg-[#64656F]/50 p-1.5 rounded-full flex items-center justify-center'>
                <Twitter size={15} />
              </div>
              <div className='bg-[#64656F]/50 p-1.5 rounded-full flex items-center justify-center'>
                <Instagram size={15} />
              </div>
              <div className='bg-[#64656F]/50 p-1.5 rounded-full flex items-center justify-center'>
                <Facebook size={15} />
              </div>

            </div>
          </div>
          <div className='flex flex-col gap-6 mx-auto'>
            <div className='flex flex-col md:flex-row gap-4 mx-auto text-sm'>
              {navLinks.map((link, index) => (
                <NavLink key={index} to={link.href} className='text-white truncate'>{link.label}</NavLink>
                // <a key={index} href={link.href} className='text-white'>{link.label}</a>
              ))}
            </div>
            <div className='w-fit overflow-hidden rounded-full my-2 flex mx-auto md:mx-0'>
              <input type='text' placeholder='Email' className='bg-gray-200 text-gray-600   rounded-full px-4 h-10 max-w-[260px]' /><button className='bg-[#FF4C5A] text-white  px-4 h-10 rounded-full -ml-10'>Subscribe</button>
            </div>
          </div>
          <div className='flex gap-2 md:hidden mx-auto mb-4'>
            <div className='bg-[#64656F]/50 p-1 rounded-full flex items-center justify-center'>
              <Instagram size={15} />
            </div>
            <Facebook />
            <Twitter />
          </div>
        </div>
        <p className="text-center text-white py-3 text-sm"> © {new Date().getFullYear()} NSS EMEA. All rights reserved.</p>
        <hr className='h-2 border-gray-500' />
        <p className="text-center text-gray-400 text-sm pt-2">
          Crafted with <span className="text-[#FF4C5A]">❤️</span> by{' '}
          <a href="https://dayyan.me" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
            Dayyan
          </a>{' '}
          and{' '}
          <a href="https://zamil.me" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
            Shamil
          </a>
        </p>
      </footer>
    </div>
  )
}

export default Footer
