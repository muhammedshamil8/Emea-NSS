import React from 'react'

const EventCard = ({ img, title }) => {
  return (
    <div className='bg-indigo-700 w-full max-w-60  rounded-xl p-4 relative mx-auto'>
      <div className='absolute top-2 right-2 z-20 text-white'>#</div>
      <img src={img} alt='event' className='w-full h-48 object-cover rounded-md' />
      <div>
        <h1 className='text-lg text-white'>{title}</h1>
      </div>
    </div>
  )
}

function MajorEvents() {
  return (
    <>
      <div className='p-4 w-full max-w-[1200px] mx-auto'>
        {/* major event card */}
        <div className="grid  gap-6 p-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <EventCard img='/images/event1.jpg' title='NSS Day Celebration' />
          <EventCard img='/images/event2.jpg' title='NSS Day Celebration' />
          <EventCard img='/images/event3.jpg' title='NSS Day Celebration' />
          <EventCard img='/images/event4.jpg' title='NSS Day Celebration' />
        </div>
      </div>
    </>
  )
}

export default MajorEvents
