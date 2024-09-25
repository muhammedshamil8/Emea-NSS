import Images from '@/const/data/ActivityImages'
import { MoveUpRight, ArrowUp } from 'lucide-react'

const EventCard = ({ img, title }) => {
  return (
    <div className='bg-indigo-700 w-full sm:max-w-[200px] max-h-[320px] rounded-2xl relative mx-auto overflow-hidden'>
      <div className='absolute top-3 right-3 z-20 bg-white p-1 rounded-full text-black cursor-pointer'><ArrowUp size={16} className='rotate-45'/></div>
      <img src={img} alt='event' className='w-full h-full object-cover' />
      <div className='absolute bottom-4 left-2 '>
        <h1 className='text-lg font-bold text-white'>{title}</h1>
      </div>
    </div>
  )
}

function MajorEvents() {


  return (
    <>
      <div className='p-4 w-full max-w-[1300px] mx-auto'>
        <div className='text-left mb-6 pl-5'>
          <h1 className='text-2xl  text-indigo-700 font-semibold'>Major Activities</h1>
          <p className='font-normal text-sm'>Highlighting Major Activities by NSS EMEA</p>
        </div>
        <div className="grid  gap-6 " style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <EventCard img={Images[0]} title='NSS Day Celebration' />
          <EventCard img={Images[2]} title='NSS Day Celebration' />
          <EventCard img={Images[3]} title='NSS Day Celebration' />
          <EventCard img={Images[1]} title='NSS Day Celebration' />
        </div>
      </div>
    </>
  )
}

export default MajorEvents
