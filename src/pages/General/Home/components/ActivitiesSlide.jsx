import EmblaCarousel from './carousal/OpacityEmblaCarousal'
import '../../../../assets/styles/slide.css'
import ImageIDs from '../../../../const/data/ActivityImages'
import { Navigate } from 'react-router-dom';

const OPTIONS = { loop: true };

function Activitie() {
  return (
    <div className='mx-auto max-w-[1200px] '>
      <div className='text-center mb-6'>
        <h1 className='text-2xl text-center text-indigo-700 font-semibold'>Recent Activities</h1>
        <p className='font-normal text-sm'>Highlighting Major Activities by NSS EMEA</p>
      </div>
      <EmblaCarousel slides={ImageIDs} options={OPTIONS} />
      <div className='w-full text-center'>
        <a href='/activities' className=' text-sm cursor-pointer font-semibold'>
          View all Activities
        </a>
      </div>

    </div>
  )
}

export default Activitie
