import React from 'react'

function Statitics() {

    const Statitics = [
        {
            title: 'Total Donations',
            value: 1000
        },
        {
            title: 'Total Volunteers',
            value: 100
        },
        {
            title: 'Total Donors',
            value: 100
        },
        {
            title: 'Total Projects',
            value: 10
        }
    ]
  return (
    <div className='bg-[#262738] w-full p-4'>
        <div className='grid grid-cols-4 gap-2 md:gap-4 max-w-[1300px] mx-auto'>
            {
                Statitics.map((statitics, index) => (
                    <div key={index} className='text-center md:p-4'>
                        <h1 className='text-white text-xl md:text-2xl font-bold'>{statitics.value}+</h1>
                        <h1 className='text-white text-sm md:text-md'>{statitics.title}</h1>
                    </div>
                ))
            }
        </div>
    </div>  
  )
}

export default Statitics
