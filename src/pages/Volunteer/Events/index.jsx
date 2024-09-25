import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from "@/config/firebase";
import {
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useNavigate, useOutletContext } from 'react-router-dom';
import dayjs from 'dayjs';

const Event = () => {
  const { myData } = useOutletContext();
  console.log('User Data:', myData);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedEventIds, setAssignedEventIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setAssignedEventIds(myData?.events_attended || []);
    console.log('Assigned Event IDs:', myData?.events_attended);
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
      console.log('Assigned Event IDs:', assignedEventIds); // Check assigned IDs
      const data = await getDocs(eventsQuery);

      const fetchedEvents = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      console.log('Assigned Events:', fetchedEvents);

      if (fetchedEvents.length > 0) {
        setEvents(fetchedEvents);
      } else {
        console.log('No events found for the assigned IDs.');
      }
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (id) => {
    navigate(`/volunteer/events/attendance/${id}`);
  }

  function eventDate(date) {
    return new Date(date?.seconds * 1000);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Assigned Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : (
          events.map(event => (
            <Card key={event.id} className="flex flex-col shadow-lg rounded-lg overflow-hidden border border-gray-200 max-w-[360px]">
              <CardHeader className="bg-gray-100 p-4">
                <CardTitle className="text-xl font-semibold text-gray-800">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-1">
                <p className="text-gray-600">{event.description}</p>
                <p className="text-gray-600 mb-4">
                  {dayjs(eventDate(event.date)).format('MMMM D, YYYY')} - {dayjs(eventDate(event.date)).format('dddd')}
                </p>
              </CardContent>
              <CardFooter className="bg-gray-100 p-4">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" variant="primary" onClick={() => handleNavigate(event.id)}>
                  Add attendance
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
        {!loading && events.length === 0 && <p className="text-gray-500 text-center">No events assigned.</p>}
      </div>
    </div>
  );
};

export default Event;
