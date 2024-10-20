import { ArrowUp } from 'lucide-react';
import { db } from "@/config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";

const EventCard = ({ img, title }) => {
  return (
    <div className='bg-indigo-100 w-full sm:max-w-[300px] max-h-[320px] rounded-2xl relative mx-auto overflow-hidden'>
      <div className='absolute top-3 right-3 z-20 bg-white p-1 rounded-full text-black cursor-pointer'>
        <ArrowUp size={16} className='rotate-45'/>
      </div>
      <img src={img} alt='event' className='w-full h-full object-cover' />
      <div className='absolute bottom-4 left-2'>
        <h1 className='text-lg font-bold text-white'>{title}</h1>
      </div>
    </div>
  )
}

function MajorEvents() {
  const [recentEvents, setRecentEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const eventCollectionRef = collection(db, "major_events");

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    setLoading(true);
    try {
      const allEventData = await getDocs(eventCollectionRef);
      const allEvents = allEventData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      // Select the last 4 events without sorting
      const selectedEvents = allEvents.slice(-4);

      setRecentEvents(selectedEvents); 
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='p-4 w-full max-w-[1300px] mx-auto'>
        <div className='text-left mb-6 pl-5'>
          <h1 className='text-2xl text-indigo-700 font-semibold'>Major Activities</h1>
          <p className='font-normal text-sm'>Highlighting Major Activities by NSS EMEA</p>
        </div>
        <div className="grid gap-6 justify-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {loading ? (
            <p className='my-10 text-center mx-auto font-bold '>Loading events...</p>
          ) : (
            recentEvents.map(event => (
              <EventCard key={event.id} img={event.thumbnail} title={event.title} />
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default MajorEvents;
