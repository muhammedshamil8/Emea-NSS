import EmblaCarousel from './carousal/OpacityEmblaCarousal'
import '@/assets/styles/slide.css'
import Images from '@/const/data/ActivityImages'

const OPTIONS = { loop: true };

function Activitie() {
  return (
    <div className='mx-auto max-w-[1300px] '>
      <div className='text-center mb-6'>
        <h1 className='text-2xl text-center text-indigo-700 font-semibold'>Recent Activities</h1>
        <p className='font-normal text-sm'>Highlighting Major Activities by NSS EMEA</p>
      </div>
      <EmblaCarousel slides={Images} options={OPTIONS} />
      <div className='w-full text-center'>
        <a href='/activities' className=' text-sm cursor-pointer font-semibold'>
          View all Activities
        </a>
      </div>

    </div>
  )
}

export default Activitie
