import React from 'react'

function EventCard({ event }) {
    return (
        <div className='bg-gray-400 rounded-xl h-[300px] w-[300px]'>
            <img src={event.image} alt={event.title} className='w-full h-[150px] object-cover rounded-t-xl' />
            <div className='p-4'>
                <h1 className='text-lg font-semibold'>{event.title}</h1>
                <p className='text-sm'>{event.date}</p>
                <p className='text-sm'>{event.location}</p>
            </div>
        </div>
    )
}

export default EventCard
