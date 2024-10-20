import { Timestamp } from '@firebase/firestore';
import dayjs from 'dayjs';

function SelectedEvent({ event, loading }) {
    if (loading) {
        return (
            <div className="w-full flex justify-center items-center h-64 bg-sky-300/30 rounded-xl">
                <p className="text-2xl text-gray-500">Loading Event...</p>
            </div>
        );
    }

    return (
        <div className='w-full flex flex-col-reverse md:flex-row bg-sky-300/20 rounded-xl shadow p-8 gap-8'>
            <div className='flex flex-col justify-between w-full md:w-1/2'>
                <h1 className='text-4xl text-black font-semibold mb-2'>{event?.title}</h1>
                <p className="text-gray-500 text-sm mb-2">
                    {event?.date instanceof Timestamp
                        ? dayjs(event?.date.toDate()).format("MMMM D, YYYY h:mm A")
                        : typeof event?.date === 'string'
                            ? dayjs(event?.date).format("MMMM D, YYYY h:mm A")
                            : "Unknown Date"}
                </p>
                <p className='text-black text-sm mb-4'>{event?.description}</p>
                <p className='text-black text-sm mb-2'><strong>Location:</strong> {event?.location}</p>
            </div>
            <div className='flex justify-center items-center border rounded-md border-black overflow-hidden max-h-[400px] w-full md:w-1/2'>
                <img src={event?.thumbnail} alt={event?.title} className='w-full h-full object-cover transition-transform duration-300 transform hover:scale-105' />
            </div>
        </div>
    );
}

export default SelectedEvent;
