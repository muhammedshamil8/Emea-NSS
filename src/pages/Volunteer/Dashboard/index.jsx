import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; // Adjust the path as needed
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { Button } from '@/components/ui/button';
import { db } from '@/config/firebase';
import {
  getDocs,
  collection,
} from "firebase/firestore";
import { useOutletContext } from 'react-router-dom';
import dayjs from 'dayjs';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const { myData } = useOutletContext();
  const totalEvents = events.length;
  const attendedEvents = events.filter(event => event.attended).length;
  const attendancePercentage = totalEvents > 0 ? (attendedEvents / totalEvents) * 100 : 0;
  const eventCollectionRef = collection(db, "events");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents();
  }, [myData]);

  const getEvents = async () => {
    setLoading(true);
    try {
      const data = await getDocs(eventCollectionRef);
      const allEvents = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      if (myData) {
        const attendedEvents = myData.events_attended || [];
        const eventsWithAttendance = allEvents.map(event => ({
          ...event,
          attended: attendedEvents.includes(event.id)
        }));
        setEvents(eventsWithAttendance);
      } else {
        setEvents(allEvents);
      }
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Data for the radial bar chart
  const chartData = [
    { name: 'Attendance', attendance: attendancePercentage, fill: "#4caf50" }
  ];

  function eventDate(date) {
    return new Date(date?.seconds * 1000);
  }


  return (
    <div className="p-1">
      {/* <h1 className="text-3xl font-bold mb-6">Volunteer Dashboard</h1> */}

      <section className='flex flex-col md:flex-row-reverse justify- w-full'>

        <div className="mb-6 shadow-lg border p-4 border-gray-200 rounded-lg w-fit md:sticky md:top-10 h-fit mx-auto md:mx-0">
          <h1 className="text-2xl font-semibold">Attendance Percentage</h1>
          <div className="flex justify-center items-center ">
            <div className="w-full max-w-xs h-[250px] relative">
              <div className='top-[44px] left-[44px] absolute border-[18px] h-[162px] !border-gray-200/70 w-[162px] rounded-full z-0'></div>

              <RadialBarChart
                width={250} // Ensure width and height are set
                height={250}
                data={chartData}
                startAngle={90} // Start angle of the radial bar
                endAngle={90 - (Math.floor(attendancePercentage * 3.6))}  // End angle to complete the circle
                innerRadius="60%" // Inner radius of the chart
                outerRadius="100%" // Outer radius of the chart
                paddingAngle={5} // Padding angle between segments
                className='relative'
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none" // Remove grid lines
                  className="first:fill-muted last:fill-background "
                />
                <RadialBar
                  minAngle={233}
                  background
                  clockWise={false}
                  dataKey='attendance'
                  cornerRadius={10}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    value={`${attendancePercentage.toFixed(1)}%`}
                    position="center"
                    className="text-xl font-bold fill-foreground"
                  />
                </PolarRadiusAxis>

              </RadialBarChart>
            </div>
          </div>
        </div>

        <div className='flex-grow w-full'>

          <div className='flex justify-between items-center mb-6'>
            <h2 className="text-2xl font-semibold mb-4">Events List</h2>
            <div className='flex items-center space-x-2 px-4'>
              <div className='relative group select-none '>
                <span className='w-4 h-4 bg-green-300 inline-block'></span>
                <span className='absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 '>
                  Attended
                </span>
              </div>
              <p className='cursor-default'>Attended</p>
              <div className='relative group'>
                <span className='w-4 h-4 bg-red-300 inline-block'></span>
                <span className='absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2'>
                  not attended
                </span>
              </div>
              <p className='cursor-default'>Not Attended</p>
            </div>
          </div>
          <div className='flex items-center space-x-2 mb-4'>
            <p className='text-gray-600'>Total Events: {totalEvents}</p>
            <p className='text-gray-600'>Attended Events: {attendedEvents}</p>
          </div>

          <ul className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {loading ? (
              <p>Loading...</p>
            ) : (events && (events.map(event => (
              <Card
                key={event.id}
                className={`flex h-full flex-col shadow-lg border border-gray-300 rounded-lg p-4 max-w-[300px] min-w-[300px] mx-auto ${event.attended ? 'bg-green-50' : 'bg-red-50'
                  }`}
              >
                <CardHeader>
                  <CardTitle className={`text-xl font-semibold ${event.attended ? 'text-green-800' : 'text-red-800'
                    }`}>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{event.description}</p>
                  <p className="text-gray-600 mb-4">
                    {dayjs(eventDate(event.date)).format('MMMM D, YYYY')} - {dayjs(eventDate(event.date)).format('dddd')}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))))}
          </ul>
        </div>


      </section>

    </div >
  );
};

export default Dashboard;
