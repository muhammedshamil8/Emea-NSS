import React from 'react'

function Footer() {
  return (
    <footer className='bg-blue-950 rounded-t-xl w-full p-6 h-full'>
      <div className=' flex justify-between p-4 text-white'>
        <div className='flex flex-col'>
          <div>
            Logo
          </div>
          <div>
            Icons
          </div>
        </div>
        <div className='flex flex-col'>
          <div>
            Nav links
          </div>
          <div>
           Subscription
          </div>
        </div>
      </div>
      <hr />
    </footer>
  )
}

export default Footer
