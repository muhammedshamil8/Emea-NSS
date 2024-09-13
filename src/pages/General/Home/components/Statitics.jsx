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
    <div className='bg-blue-950 w-full p-4'>
        <div className='grid grid-cols-3 gap-4 max-w-[1200px] mx-auto'>
            {
                Statitics.map((statitics, index) => (
                    <div key={index} className='text-center p-4'>
                        <h1 className='text-white text-2xl font-semibold'>{statitics.value}+</h1>
                        <h1 className='text-white text-md'>{statitics.title}</h1>
                    </div>
                ))
            }
        </div>
    </div>  
  )
}

export default Statitics
