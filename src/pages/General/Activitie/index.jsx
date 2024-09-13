import React from 'react'
import EventCard from './components/EventCard';

function Activitie() {
  const events = [
    {
      title: 'Event 1',
      date: '12/12/2021',
      location: 'Location 1',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Event 2',
      date: '12/12/2021',
      location: 'Location 2',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Event 3',
      date: '12/12/2021',
      location: 'Location 3',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Event 4',
      date: '12/12/2021',
      location: 'Location 4',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Event 5',
      date: '12/12/2021',
      location: 'Location 5',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Event 6',
      date: '12/12/2021',
      location: 'Location 6',
      image: 'https://via.placeholder.com/150'
    }
  ];
  return (
    <div className='min-h-[100vh]'>
      <h1 className='text-2xl text-center text-indigo-700 font-semibold'>Activite</h1>

      <div className='grid grid-cols-3 gap-4 max-w-[1200px] mx-auto'>
        {
          events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))
        }
      </div>
    </div>
  )
}

export default Activitie
