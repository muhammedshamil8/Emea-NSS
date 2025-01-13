import React from 'react';
import { JadimSirBig, ShihabudheenSir } from '@/assets/images/NodalOfficer';
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
      className={classNames(className, `rounded-xl flex items-center justify-center text-${color}  absolute !right-[10px] top-[10px] sm:top-[10px] z-10 custom-arrow`,
        {
          '!text-gray-500': isDisabled,
          [`!text-${color} `]: !isDisabled
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
      className={classNames(className, `rounded-xl flex items-center justify-center  text-${color}  absolute left-[0px] top-[10px] sm:top-[10px] z-10 custom-arrow `,
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


function NodalOfficer() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    nextArrow: <SampleNextArrow color={'black'} />,
    prevArrow: <SamplePrevArrow color={'black'} />,
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
      img: JadimSirBig
    },
    {
      name: 'Shihabudheen',
      description: 'Lorem ipsum dolor sit amet consectetur. Pharetra condimentum cras purus viverra. Porttitor semper egestas augue cras facilisi at felis.',
      img: ShihabudheenSir
    },
  ];

  return (
    <div className='relative max-w-[1300px] mx-auto'>
      <div className="slider-container max-w-[90%] w-full  mx-auto ">
        <Slider {...settings}>
          {NodalOfficers.map((officer, index) => (
            <div className='mx-auto w-fit p-3 min-h-[200px] flex items-end justify-end  ' key={index}>
              <div className=' overflow-x-hidden relative overflow-y-visible h-full min-h-[200px] pt-20 '>
                <div className='bg-gradient-to-r from-[#D4DDFB]/50 to-[#F0EDFF]/50 max-w-[800px] mx-auto flex flex-col md:flex-row rounded-3xl min-h-[250px]'>
                  <div className='md:w-[30%] flex items-center justify-center '>
                    <img
                      src={officer.img}
                      alt={`${officer.name}`}
                      className='w-full h-full   max-w-[260px] absolute -top-[0px] left-4 bottom-0'
                    />
                  </div>
                  <div className='p-4 md:w-[70%]'>
                    <div className='flex flex-col items-start justify-center   bg-white p-4 rounded-xl '>
                      <h2 className='text-lg md:text-2xl font-semibold'>In-Charge</h2>
                      <h2 className='text-lg md:text-2xl font-semibold'>{officer.name}</h2>
                      <p className='text-sm md:text-base text-gray-700 pt-4'>
                        {officer.description}
                        <h2 className='text-lg md:text-2xl font-semibold'>{officer.name}</h2>
                      </p>
                    </div>
                  </div>
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
