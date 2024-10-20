import React from 'react'
import '../../../../assets/styles/index.css'
import { useNavigate } from 'react-router-dom'

function Report() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/reports')
  }
  return (
    <div className='relative bg-slate-200'>
        <div className="custom-shape-divider-top">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
          </svg>
      </div>
      <div className=' w-full  pt-20 p-6   sm:p-16 flex flex-col-reverse sm:flex-row gap-4 max-w-[1300px] mx-auto'>
        <div className='flex flex-col gap-4 sm:w-1/2 justify-center'>
          <h1 className='text-2xl text-left text-indigo-700 font-semibold underline underline-offset-2'>Reports</h1>
          <p className='max-w-[500px]'>
            Discover the impactful activities and initiatives carried out by our NSS volunteers. Our comprehensive reports document our journey, showcasing community service projects, special events, and the positive changes we've fostered.Discover the impactful activities and initiatives carried out by our NSS volunteers. Our comprehensive reports document our journey, showcasing community service projects, special events, and the positive changes we've fostered.
          </p>
          <button className='buttonz max-w-fit' onClick={handleClick}>View Reports</button>
        </div>
        <div className='sm:w-1/2 mx-auto'>
          <div className='flex flex-col gap-2 md:gap-3'>
            <div className='flex items-start  gap-2 md:gap-3'>
              <div className='h-36 md:h-48 w-28 md:w-48 bg-gray-400 rounded-full md:rounded-[40px] relative overflow-hidden'>
                <img src='https://picsum.photos/600/350?v=1' alt='report' className='absolute inset-0 object-cover w-full h-full ' />
              </div>
              <div className='h-48 w-28 md:w-64 bg-gray-400 rounded-full md:rounded-[40px] relative overflow-hidden'>
              <img src='https://picsum.photos/600/350?v=2' alt='report' className='absolute inset-0 object-cover w-full h-full ' />
              </div>
            </div>
            <div className='flex gap-2 md:gap-3'>
              <div className='h-48 w-28 md:w-64 -mt-12 md:mt-0 bg-gray-400 rounded-full md:rounded-[40px] relative overflow-hidden'>
              <img src='https://picsum.photos/600/350?v=3' alt='report' className='absolute inset-0 object-cover w-full h-full ' />
              </div>
              <div className='h-36 md:h-48 w-28 md:w-48 bg-gray-400 rounded-full md:rounded-[40px] relative overflow-hidden'>
              <img src='https://picsum.photos/600/350?v=4' alt='report' className='absolute inset-0 object-cover w-full h-full ' />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Report
