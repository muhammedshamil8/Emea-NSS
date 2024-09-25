import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'


const EmblaCarousel = (props) => {
    const { slides, options } = props
    // console.log(slides)
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        Autoplay({ delay: 3500 }),
        Fade()
    ])
    const [isPlaying, setIsPlaying] = useState(true)

    useEffect(() => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return

        setIsPlaying(autoplay.isPlaying())
        emblaApi
            .on('autoplay:play', () => setIsPlaying(true))
            .on('autoplay:stop', () => setIsPlaying(false))
            .on('reInit', () => setIsPlaying(autoplay.isPlaying()))
    }, [emblaApi])

    const data = {
        title: 'NOT ME, BUT YOU',
        description: `The NSS motto, "Not Me But You," emphasizes selfless service and democratic values. It encourages students to appreciate others' viewpoints and consider all living beings, highlighting that individual welfare depends on the well-being of society.`,
        button: 'Get Started '
    }

    return (
        <div className="embla2">
            <div className="embla__viewport2" ref={emblaRef}>
                <div className="embla__container2">
                    {slides.map((slide, index) => (
                        <div className="embla__slide2 relative" key={index}>
                            <img
                                className="embla__slide__img2"
                                src={slide.src}
                                alt={slide.alt}
                            />
                            <div className=' z-30 absolute bottom-10 sm:bottom-24 left-4 space-y-2 max-w-full'>
                                <div className="w-full mx-auto text-white max-w-[1300px] p-2">
                                    <h1 className="text-[20px] sm:text-[38px] font-black">{data.title}</h1>
                                    <p className="max-w-[80%] sm:max-w-[60%] text-sm sm:text-xl pb-2 font-normal">{data.description}</p>
                                    <button className="bg-red-500  rounded-lg text-sm py-1 sm:text-md sm:py-2 px-6 font-semibold">
                                        {data.button}
                                    </button>
                                </div>
                            </div>
                            {/* Add the gradient overlay */}
                            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}

export default EmblaCarousel
