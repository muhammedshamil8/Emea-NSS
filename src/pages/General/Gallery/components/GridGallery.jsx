import React, { useState } from 'react';

const loadingCard = () => {
  return (
    <div className="bg-gray-200 min-h-48 h-auto rounded-lg animate-pulse"></div>
  );
};
export function GridGallery({ galleryItems, isLoading }) {
  const [loading, setLoading] = useState(true);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-gray-200 h-40 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="columns-2 md:columns-4 gap-4 space-y-4">
      {galleryItems.map((item) => (
        <div key={item.id} className="break-inside-avoid">
          {loading && loadingCard()}
          <img
            className="w-full h-auto rounded-lg object-cover"
            src={item.image}
            alt={item.title}
            onLoad={() => setLoading(false)}
          />
          {/* <h2 className="text-sm text-center text-gray-600 mt-2">{item.title}</h2> */}
        </div>
      ))}
    </div>
  );
}
