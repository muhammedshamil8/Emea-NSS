import { useEffect, useState } from "react";
import EventCard from './components/EventCard';
import SelectedEvent from './components/SelectedEvent';
import { db } from "@/config/firebase";
import { getDocs, collection } from "firebase/firestore";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

function Activitie() {
    const eventID = useParams().id; // Get the event ID from the URL
    const [events, setEvents] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const eventCollectionRef = collection(db, "events");
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        getEvents();
    }, []);

    useEffect(() => {
        // Update selected event whenever events or eventID change
        if (events.length > 0 && eventID) {
            const event = events.find((event) => event.id === eventID);
            setSelectedEvent(event);
        }
    }, [events, eventID]);

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

            if (sortedEvents.length > 5) {
                const fifthEventDate = dayjs(eventDate(sortedEvents[4].date));
                const sixthEventDate = dayjs(eventDate(sortedEvents[5].date));
                if (fifthEventDate.isSame(sixthEventDate, 'day')) {
                    selectedEvents = sortedEvents.slice(0, 6);
                }
            }
            setEvents(sortedEvents); // Set all sorted events
            setRecentEvents(selectedEvents); // Set the latest 5 or 6 recent events
        } catch (error) {
            console.error("Error getting documents: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-[100vh] max-w-[1300px] mx-auto py-4 px-2'>
           <SelectedEvent event={selectedEvent} loading={loading} />
            <div className='flex flex-col mt-10'>
                <h1 className='text-2xl text-left text-[#332C6F] font-semibold mb-10'>Other Events</h1>
                {loading ? (
                    <div className="w-full h-96 flex items-center justify-center">
                        <p className="text-2xl text-gray-500">Loading...</p>
                    </div>
                ) : (
                    <div className='grid gap-4 mb-20' style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                        {events.map((event, index) => (
                            <EventCard key={index} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Activitie;
