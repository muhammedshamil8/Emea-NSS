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

  return (
    <>
      <EmblaCarousel slides={banners} options={OPTIONS} />
    </>
  )
}

export default Banner