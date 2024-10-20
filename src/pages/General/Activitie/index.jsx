import { useEffect, useState } from "react";
import EventCard from './components/EventCard';
import Banner from './components/Banner';
import { db } from "@/config/firebase";
import { getDocs, collection } from "firebase/firestore";
import dayjs from "dayjs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";

function SampleNextArrow(props) {
  const { className, style, onClick, color } = props;
  const isDisabled = className && className.includes("slick-disabled");
  return (
    <div
      className={classNames(className, `rounded-xl flex items-center justify-center text-${color}  absolute right-[20px] top-[10px] sm:top-[10px] z-10 custom-arrow`,
        {
          '!text-gray-500': isDisabled,
          [`!text-${color}`]: !isDisabled
        })}
      style={{
        ...style,
        display: "block",
        background: "",
        fontSize: "40px",
        lineHeight: "1",
      }}
      onClick={onClick}
    >
      <ChevronRight size={40} />
    </div>
  );
}
function SamplePrevArrow(props) {
  const { className, style, onClick, color } = props;
  console.log('color:', color);
  const isDisabled = className && className.includes("slick-disabled");
  return (
    <div
      className={classNames(className, `rounded-xl flex items-center justify-center  text-${color}  absolute left-[20px] top-[10px] sm:top-[10px] z-10 custom-arrow `,
        {
          '!text-gray-500': isDisabled,
          [`!text-${color}`]: !isDisabled
        }
      )}
      style={{
        ...style,
        display: "block",
        background: "",
        fontSize: "40px",
        lineHeight: "1",
      }}
      onClick={onClick}
    >
      <ChevronLeft size={40} />
    </div >
  );
}

function Activitie() {
  const [events, setEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const eventCollectionRef = collection(db, "events");

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow color={'black'} />,
    prevArrow: <SamplePrevArrow color={'black'} />,
    responsive: [
      {
          breakpoint: 1124,
          settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
          }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          padding: 10,
          slidesToScroll: 1,
        }
      }
    ],
  };

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    setLoading(true);
    try {
      // Function to convert Firestore timestamp to JS Date
      function eventDate(date) {
        return new Date(date?.seconds * 1000);
      }

      // Fetch all events
      const allEventData = await getDocs(eventCollectionRef);
      const allEvents = allEventData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      // Sort events by date in descending order (latest first)
      const sortedEvents = allEvents.sort((a, b) => eventDate(b.date) - eventDate(a.date));

      // Get the latest 5 events and check for the 6th event
      let selectedEvents = sortedEvents.slice(0, 5);

      // If the 6th event has the same date as the 5th event, include it
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
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[100vh] max-w-[1300px] mx-auto py-4 px-2'>
      <Banner />

      <div className='flex flex-col my-10'>
        <h1 className='text-2xl text-left text-indigo-700 font-semibold mb-10'>Recent Activities</h1>
        <div className="slider-container p-2 mx-auto sm:max-0 max-w-[90%] md:max-w-full w-full relative">
          {loading ? (
            <div className="w-full h-96 flex items-center justify-center">
              <p className="text-2xl text-gray-500">Loading...</p>
            </div>
          ) : (
            <Slider {...settings} className="h-full">
              {recentEvents.map((event, index) => (
                <div className="flex items-start" key={index}>
                  <EventCard key={index} event={event} />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>

      <div className='flex flex-col'>
        <h1 className='text-2xl text-left text-indigo-700 font-semibold mb-10'>All Activities</h1>
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
