import '@/assets/styles/banner.css'
import EmblaCarousel from './carousal/AutoEmblaCarousal'
import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { getDocs, collection } from "firebase/firestore";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const eventCollectionRef = collection(db, "banners");
  const OPTIONS = { loop: true }
  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    setLoading(true);
    try {
      const allEventData = await getDocs(eventCollectionRef);
      const allEvents = allEventData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setBanners(allEvents);
    } catch (error) {
      console.error("Error getting documents: ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  const data = {
    title: 'NOT ME, BUT YOU',
    description: `The NSS motto, "Not Me But You," emphasizes selfless service and democratic values. It encourages students to appreciate others' viewpoints and consider all living beings, highlighting that individual welfare depends on the well-being of society.`,
    button: 'Get Started '
}

  return (
    <>
      {loading ? (
        <div className="embla2">
          <div className="embla__viewport2" >
            <div className="embla__container2">
                <div className="embla__slide2 relative" >
                  <div className="embla__slide__img2 flex items-center justify-center" >
                  <img
                    src="https://i.imgur.com/llF5iyg.gif"
                    className="mx-auto"
                  />
                  </div>
                  <div className="z-30 absolute bottom-8 md:bottom-16 left-0 right-0 mx-auto max-w-full flex justify-center px-4">
                    <div className="w-full text-white max-w-[1300px] p-2">
                      <h1 className="text-[20px] sm:text-[38px] font-black text-left">
                        {data.title || "Default Title"}
                      </h1>
                      <p className="text-responsive font-normal text-left text-sm sm:text-xl">
                        {data.description || "Default description text that is long enough to test the two-line limit."}
                      </p>
                      <button
                        className="bg-red-500 rounded-lg text-sm py-1 sm:text-md sm:py-2 px-6 font-semibold hover:bg-red-600 transition duration-200"
                        aria-label={data.button || "Default button action"}
                      >
                        {data.button || "Click Me"}
                      </button>
                    </div>
                  </div>

                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/50 to-black/50 md:from-black/90 md:via-transparent md:to-transparent"></div>
                </div>
            </div>
          </div>
        </div>
      ) : (<EmblaCarousel slides={banners} options={OPTIONS} />
      )}
    </>
  )
}

export default Banner