import React from 'react'

const officers = [
  {
    name: 'Munavar Jazim',
    position: 'program officer',
    social: {
      phone: '1234567890',
      email: 'demo@gmail.com',
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
    }
  },
  {
    name: 'Shihabudheen',
    position: 'program officer',
    social: {
      phone: '1234567890',
      email: 'a@gmail.com',
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
    }
  },
  {
    name: 'NSS Secretary',
    position: 'NSS Secretary',
    social: {
      phone: '1234567890',
      email: 'a@gmail.com',
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
    }
  },
  {
    name: 'NSS Secretary',
    position: 'NSS Secretary',
    social: {
      phone: '1234567890',
      email: 'a@gmail.com',
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
    }
  },
  {
    name: 'NSS Secretary',
    position: 'NSS Secretary',
    social: {
      phone: '1234567890',
      email: 'a@gmail.com',
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
    }
  },
  {
    name: 'NSS Secretary',
    position: 'NSS Secretary',
    social: {
      phone: '1234567890',
      email: 'a@gmail.com',
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
    }
  },
];


function Contact() {

  return (
    <div id='contact' className='bg-slate-200  py-4 w-full my-10'>
      <div className='mb-6'>
        <h1 className='text-2xl text-center text-indigo-700 font-semibold'>Contact Us.</h1>
        <p className='text-center font-normal text-sm'>Get in touch with us</p>
      </div>
      <ul className='flex  justify-center flex-col text-black'>
        {officers.map((officer, index) => (
          <li key={index} className={`flex gap-4 justify-center w-full py-3 ${(index + 1) % 2 !== 0 ? 'bg-gray-400' : ''}`}>
            <h2 className='text-lg text-center text-indigo-700 font-semibold'>{officer.name}</h2>
            (<p className='text-center font-normal text-sm'>{officer.position}</p>)

            <div>
              <a href={`tel:${officer.social.phone}`} className='text-center font-normal text-sm'>{officer.social.phone}</a>
            </div>
          </li>
        ))}
      </ul>
      <div className='max-w-[1200px] mx-auto'>

      </div>
    </div>
  )
}

export default Contact
