import { ArrowUp } from 'lucide-react'
import { Timestamp } from 'firebase/firestore';
import dayjs from "dayjs";

function EventCard({ event }) {
    return (
        <div className='bg-gray-400 rounded-xl h-[280px] w-full min-w-[260px] sm:max-w-[260px] mx-auto overflow-hidden relative'>
            <img src={event?.thumbnail} alt={event?.title} className='w-full h-full object-cover' />
            <div className='absolute top-3 right-3 z-20 bg-white/50 p-1 rounded-full text-black cursor-pointer'><ArrowUp size={16} className='rotate-45' /></div>
            <div className='p-4 absolute bottom-0 text-white w-full'>
                <div className='flex justify-between items-center w-full'>
                    <p className="text-gray-500 text-sm">
                        {event?.date instanceof Timestamp
                            ? dayjs(event?.date.toDate()).format("MMMM D, YYYY h:mm A")
                            : typeof event?.date === 'string' // Check if it's a string or a date string
                                ? dayjs(event?.date).format("MMMM D, YYYY h:mm A")
                                : "Unknown Date"}
                    </p>
                    <p className='text-sm'>{event?.location}</p>
                </div>
                <h1 className='text-lg font-semibold'>{event?.title}</h1>
            </div>
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>
    )
}

export default EventCard
