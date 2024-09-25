import React from 'react';
import { JasimSir, ShihabudheenSir } from '@/assets/images/NodalOfficer';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function NodalOfficer() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Adjust for desired number of officers per slide (optional)
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay (optional)
    autoplaySpeed: 3000, // Duration before switching slides (optional)
    responsive: [
      {
        breakpoint: 768, // Adjust breakpoint for smaller screens
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const NodalOfficers = [
    {
      name: 'Munavar Jasim',
      description: 'Lorem ipsum dolor sit amet consectetur. Pharetra condimentum cras purus viverra. Porttitor semper egestas augue cras facilisi at felis.',
      img: JasimSir
    },
    {
      name: 'Shihabudheen',
      description: 'Lorem ipsum dolor sit amet consectetur. Pharetra condimentum cras purus viverra. Porttitor semper egestas augue cras facilisi at felis.',
      img: ShihabudheenSir
    },
  ];

  return (
    <div className='relative max-w-[1300px] mx-auto'>
    <div className="slider-container">
      <Slider {...settings}>
        {NodalOfficers.map((officer, index) => (
          <div className='mx-auto max-w-full' key={index}>
            <div className='bg-slate-200 max-w-[800px] mx-auto flex flex-col md:flex-row rounded-3xl p-4 shadow-lg'>
              <div className='md:w-1/2 flex items-center justify-center'>
                <img
                  src={officer.img}
                  alt={`${officer.name}`}
                  className='w-full h-auto object-cover rounded-full shadow-md max-w-[260px]'
                />
              </div>
              <div className='flex flex-col items-start justify-center md:w-1/2 space-y-3 bg-white p-4 rounded-xl'>
                <h2 className='text-lg md:text-2xl font-semibold'>In-Charge</h2>
                <h2 className='text-lg md:text-2xl font-semibold'>{officer.name}</h2>
                <p className='text-sm md:text-base text-gray-700'>
                  {officer.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  </div>
  );
}

export default NodalOfficer;
