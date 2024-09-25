import BannerIMG from '@/const/data/Banner'
import React from 'react'

function Banner() {
    return (
        <div className='w-full relative rounded-[40px] overflow-hidden max-h-[240px] sm:max-h-[300px] md:max-h-[340px]'>
            <img src={BannerIMG[0].src} alt='Banner' className='w-full max-h-[240px] sm:max-h-[300px] md:max-h-[340px] object-cover' />
            <div className='absolute top-[30%] left-16 text-white text-left z-30 max-w-[500px] '>
                <h1 className='text-xl md:text-4xl font-bold '>Discover the incredible
                    impact of NSS at EMEA! </h1>
                <p className='text-sm md:text-lg'>Where each initiative sparks a wave of transformation, uplifting communities and inspiring progress!</p>
            </div>
            <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
    )
}

export default Banner
