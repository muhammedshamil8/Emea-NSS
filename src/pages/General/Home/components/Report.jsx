import React from 'react'
import '../../../../assets/styles/index.css'
import { useNavigate } from 'react-router-dom'

function Report() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/about')
  }
  return (
    <div className='relative bg-slate-200'>
      <div className="custom-shape-divider-top">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
        </svg>
      </div>
      <div className=' w-full  pt-20 p-16 flex gap-4 max-w-[1200px] mx-auto'>
        <div className='flex flex-col gap-4 w-1/2 justify-center'>
          <h1 className='text-2xl text-left text-indigo-700 font-semibold underline underline-offset-2'>About NSS EMEA</h1>
          <p className='max-w-[500px]'>
            The National Service Scheme (NSS), a scheme by the Government of India's Ministry of Youth Affairs & Sports, engages students from schools to universities in voluntary community service. Launched in 1969, NSS has grown to involve 657 universities and 51 +2 councils, benefiting over 7.4 crore students nationwide. Its primary goal is to develop student personality and character through service, promoting 'Education through Service'.
          </p>
          <button className='border border-red-500 text-red-500 px-4 py-2 rounded-md w-fit' onClick={handleClick}>Know More</button>
        </div>
      <div className='w-1/2'>

      </div>
      </div>

    </div>
  )
}

export default Report
