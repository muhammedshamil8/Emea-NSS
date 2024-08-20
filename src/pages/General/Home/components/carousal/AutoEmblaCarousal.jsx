import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'


const EmblaCarousel = (props) => {
    const { slides, options } = props
    console.log(slides)
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
        title: 'Title',
        description: 'Description',
        button: 'Button'
    }

    return (
        <div className="embla2">
            <div className="embla__viewport2" ref={emblaRef}>
                <div className="embla__container2 ">
                    {slides.map((slide, index) => (
                        <div className="embla__slide2 relative" key={index}>
                            <img
                                className="embla__slide__img2"
                                src={slide.src}
                                alt={slide.alt}
                            />
                            <div className='text-white font-semibold z-30 absolute bottom-10 left-10'>
                                <h1>{data.title}</h1>
                                <p>{data.description}</p>
                                <button className='bg-red-500 rounded-lg p-2'>{data.button}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EmblaCarousel
