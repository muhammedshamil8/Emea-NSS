import React, { useState, useEffect } from 'react';
import { GridGallery } from './components/GridGallery';
import Images from '@/const/data/ActivityImages';

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dummyData = [
    Images[0], // First image
    Images[2], // Repeat Third image
    Images[1], // Second image
    Images[3], // Fourth image
    Images[4], // Fifth image
    Images[5], // Sixth image
    Images[3], // Repeat Fourth image
    Images[4], // Repeat Fifth image
    Images[1], // Repeat Second image
    Images[2], // Third image
    Images[0], // Repeat First image
    Images[5], // Repeat Sixth image
];

  // Simulate data fetching
  useEffect(() => {
    setTimeout(() => {
      setGalleryItems(dummyData);
      setIsLoading(false);
    }, 2000); // Simulate a 2-second delay for loading
  }, []);

  return (
    <div className="min-h-[100vh] bg-gray-50 py-8">
      <h1 className="text-2xl text-center text-[#332C6F] font-semibold mb-8">Photo Gallery</h1>
      <div className="mx-auto max-w-[1300px] px-4">
        <GridGallery galleryItems={galleryItems} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default Gallery;
