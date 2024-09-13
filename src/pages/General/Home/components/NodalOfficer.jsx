import React from 'react'
import NodalOfficerIMG from '../../../../assets/images/NodalOfficer/munavar_jazim.png'

function NodalOfficer() {
  return (
    <div className='relative max-w-[1200px] mx-auto'>
      <div className='bg-slate-200 max-w-[800px] mx-auto flex gap-4 rounded-3xl p-4 '>
        <div className='w-1/2'>
          <img src={NodalOfficerIMG} alt='Nodal Officer' className='absolute -top-[50px] max-w-[300px]'/>
        </div>
        <div className='flex flex-col items-start justify-center w-1/2 space-y-3'>
          <h2 className='text-2xl'>In-Charge</h2>
          <h2 className='font-semibold text-2xl'>Munavar Jasim</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur. Pharetra condimentum cras purus viverra. Porttitor semper egestas augue cras facilisi at felis. Risus elementum venenatis condimentum sit nisl enim quis tristique. Scelerisque diam pretium a velit diam dignissim eget nisl non.
            Nulla tellus elit eu et proin faucibus. Enim amet orci ipsum posuere mi vitae ipsum ut. 
          </p>
        </div>
      </div>
    </div>
  )
}

export default NodalOfficer
