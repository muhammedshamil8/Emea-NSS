import React, { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaArrowBtn'

const TWEEN_FACTOR_BASE = 0.84

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max)

const EmblaCarousel = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [activeIndex, setActiveIndex] = useState(0)
  const tweenFactor = useRef(0)
  
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi, () => updateActiveIndex(emblaApi))

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenOpacity = useCallback((emblaApi, eventName) => {
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const slidesInView = emblaApi.slidesInView()
    const isScrollEvent = eventName === 'scroll'

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress)
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress)
              }
            }
          })
        }

        const tweenValue = 1.3 - Math.abs(diffToTarget * tweenFactor.current)
        const opacity = numberWithinRange(tweenValue, 0, 1).toString()
        emblaApi.slideNodes()[slideIndex].style.opacity = opacity
      })
    })
  }, [])

  const updateActiveIndex = useCallback((emblaApi) => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [])

  const handleNavigationClick = (index) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }

  useEffect(() => {
    if (!emblaApi) return

    setTweenFactor(emblaApi)
    tweenOpacity(emblaApi)
    updateActiveIndex(emblaApi)
    emblaApi
      .on('reInit', setTweenFactor)
      .on('reInit', tweenOpacity)
      .on('scroll', tweenOpacity)
      .on('select', () => updateActiveIndex(emblaApi))
  }, [emblaApi, tweenOpacity, updateActiveIndex])

  return (
    <div className="embla relative">
      <div className="embla__viewport rounded-[30px]" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <img
                className="embla__slide__img"
                src={slide}
                alt="Your alt text"
              />
              {/* {process.env.REACT_APP_IMAGE_URL + slide} */}
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        {/* <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div> */}
        <div className="absolute bottom-4 left-2/4 !z-20 flex -translate-x-2/4 gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all ${activeIndex === i ? "w-8 bg-black" : "w-4 bg-black/50"
                }`}
              onClick={() => handleNavigationClick(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel
