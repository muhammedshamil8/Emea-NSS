import React from 'react'
import NSSLOGO from '@/assets/icons/NSSlogo.png'
import { useNavigate } from 'react-router-dom'

function About() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/about')
  }
  return (
    <div className='bg-slate-100 p-6 py-10 '>
      <div className='max-w-[1300px] mx-auto flex gap-10'>
          <div className='hidden items-center justify-center md:w-1/2 md:flex'>
            <img  src={NSSLOGO} alt='NSS EMEA Logo' className='max-w-[300px]' />
          </div>
          <div className='flex flex-col gap-4 md:w-1/2 justify-center'>
            <h1 className='text-2xl text-left text-indigo-700 font-semibold underline underline-offset-2'>About NSS</h1>
            <p className='md:max-w-[500px]'>
            The National Service Scheme (NSS), a scheme by the Government of India's Ministry of Youth Affairs & Sports, engages students from schools to universities in voluntary community service. Launched in 1969, NSS has grown to involve 657 universities and 51 +2 councils, benefiting over 7.4 crore students nationwide. Its primary goal is to develop student personality and character through service, promoting 'Education through Service'.
            </p>
            <button className='border border-red-500 text-red-500 px-8 py-1 rounded-md w-fit' onClick={handleClick}>Know More</button>
          </div>
       </div>
    </div>
  )
}

export default About
