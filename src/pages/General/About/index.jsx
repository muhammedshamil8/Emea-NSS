import React from 'react'
import { Event1 } from '@/assets/images/Activity'

function About() {
  return (
    <div className='min-h-[100vh] max-w-[1300px] mx-auto py-4'>
      <div className='py-4'>
        <h1 className='text-2xl text-center text-indigo-700 font-semibold'>About NSS</h1>
        <p className='text-lg text-center max-w-[800px] mx-auto '>The National Service Scheme (NSS)</p>
      </div>
      <div className='flex flex-col'>
        <section className='py-4 flex flex-col md:flex-row'>
          <div className='flex-1 flex items-start flex-col p-4'>
            <h1 className='text-2xl text-center text-indigo-700 font-semibold'>Our Vision</h1>
            <p className='text-lg text-left max-w-[800px] mx-auto mt-4'>The National Service Scheme (NSS) has been a part of the Indian ethos and has had immense impact on the development of the student youth through the decades. The very first idea of such a program was mooted by the then Union Education Minister Dr. V.K.R.V. Rao in 1969. It was aimed at developing in the students a sense of participation in nation building as well as inculcating in them such values and norms as would help them to become meaningful citizens of a democratic society.</p>
          </div>
          <div className='flex-1'>
            <img src={Event1} alt='Event 1' className='rounded-xl object-cover h-auto w-auto' />
          </div>
        </section>
        <section className='py-4 flex flex-col-reverse md:flex-row'>
          <div className='flex-1 '>
            <img src={Event1} alt='Event 1' className='rounded-xl object-cover h-auto w-auto' />
          </div>
          <div className='flex-1 flex items-start flex-col p-4'>
            <h1 className='text-2xl text-center text-indigo-700 font-semibold'>Our Mission</h1>
            <p className='text-lg text-left max-w-[800px] mx-auto mt-4'>The National Service Scheme (NSS) has been a part of the Indian ethos and has had immense impact on the development of the student youth through the decades. The very first idea of such a program was mooted by the then Union Education Minister Dr. V.K.R.V. Rao in 1969. It was aimed at developing in the students a sense of participation in nation building as well as inculcating in them such values and norms as would help them to become meaningful citizens of a democratic society</p>
          </div>
        </section>
        <section className='py-4 flex flex-col md:flex-row'>
          <div className='flex-1 flex items-start flex-col p-4'>
            <h1 className='text-2xl text-center text-indigo-700 font-semibold'>Our Approach</h1>
            <p className='text-lg text-left max-w-[800px] mx-auto mt-4'>The National Service Scheme (NSS) has been a part of the Indian ethos and has had immense impact on the development of the student youth through the decades. The very first idea of such a program was mooted by the then Union Education Minister Dr. V.K.R.V. Rao in 1969. It was aimed at developing in the students a sense of participation in nation building as well as inculcating in them such values and norms as would help them to become meaningful citizens of a democratic society.</p>
          </div>
          <div className='flex-1'>
            <img src={Event1} alt='Event 1' className='rounded-xl object-cover h-auto w-auto' />
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
