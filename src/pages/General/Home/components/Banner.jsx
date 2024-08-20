import '../../../../assets/styles/banner.css'
import EmblaCarousel from './carousal/AutoEmblaCarousal'
import BannerIMG from '../../../../const/data/Banner'

function Banner() {
    const OPTIONS = { loop: true }


  return (
    <>
       <EmblaCarousel slides={BannerIMG} options={OPTIONS} />
    </>
  )
}

export default Banner