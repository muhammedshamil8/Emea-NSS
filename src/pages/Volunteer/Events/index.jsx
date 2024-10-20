import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from "@/config/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useNavigate, useOutletContext } from 'react-router-dom';
import dayjs from 'dayjs';

const Event = () => {
  const { myData } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedEventIds, setAssignedEventIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setAssignedEventIds(myData?.events_attended || []);
  }, [myData]);

  useEffect(() => {
    getAssignedEvents();
  }, [assignedEventIds]);

  const getAssignedEvents = async () => {
    setLoading(true);
    try {
      if (assignedEventIds.length === 0) {
        setLoading(false);
        return;
      }
      const eventCollectionRef = collection(db, "events");
      const eventsQuery = query(eventCollectionRef, where("id", "in", assignedEventIds));
      const data = await getDocs(eventsQuery);
      const fetchedEvents = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      if (fetchedEvents.length > 0) {
        setEvents(fetchedEvents);
      }
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (id) => {
    navigate(`/volunteer/events/attendance/${id}`);
  };

  function eventDate(date) {
    return new Date(date?.seconds * 1000);
  }

  return (
    <section className="py-10 px-6 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Assigned Events</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="flex flex-wrap gap-8 justify-center items-center">
          {events.length > 0 ? (
            events.map(event => (
              <Card key={event.id} className="w-full max-w-xs shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-blue-100 p-6 rounded-t-lg">
                  <CardTitle className="text-2xl font-semibold text-gray-800">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700">{event.description}</p>
                  <p className="text-gray-600 mt-4">
                    {dayjs(eventDate(event.date)).format('MMMM D, YYYY')} - {dayjs(eventDate(event.date)).format('dddd')}
                  </p>
                </CardContent>
                <CardFooter className="p-6 bg-gray-100 rounded-b-lg">
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                    onClick={() => handleNavigate(event.id)}
                  >
                    Add Attendance
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500">No events assigned.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Event;
