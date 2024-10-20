import EmblaCarousel from './carousal/OpacityEmblaCarousal'
import '@/assets/styles/slide.css'
import { db } from "@/config/firebase";
import { getDocs, collection } from "firebase/firestore";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const OPTIONS = { loop: true };

function Activitie() {
  const [recentEvents, setRecentEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const eventCollectionRef = collection(db, "events");

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    setLoading(true);
    try {
      function eventDate(date) {
        return new Date(date?.seconds * 1000);
      }

      const allEventData = await getDocs(eventCollectionRef);
      const allEvents = allEventData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const sortedEvents = allEvents.sort((a, b) => eventDate(b.date) - eventDate(a.date));

      let selectedEvents = sortedEvents.slice(0, 5);

      // If the 6th event has the same date as the 5th event, include it
      if (sortedEvents.length > 5) {
        const fifthEventDate = dayjs(eventDate(sortedEvents[4].date));
        const sixthEventDate = dayjs(eventDate(sortedEvents[5].date));
        if (fifthEventDate.isSame(sixthEventDate, 'day')) {
          selectedEvents = sortedEvents.slice(0, 6);
        }
      }

      setRecentEvents(selectedEvents); 
    } catch (error) {
      console.error("Error getting documents: ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto max-w-[1300px] '>
      <div className='text-center mb-6'>
        <h1 className='text-2xl text-center text-indigo-700 font-semibold'>Recent Activities</h1>
        <p className='font-normal text-sm'>Highlighting Major Activities by NSS EMEA</p>
      </div>
      <EmblaCarousel slides={recentEvents} options={OPTIONS} />
      <div className='w-full text-center'>
        <a href='/activities' className=' text-sm cursor-pointer font-semibold'>
          View all Activities
        </a>
      </div>

    </div>
  )
}

export default Activitie
