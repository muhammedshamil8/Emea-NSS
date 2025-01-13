import { Fawar, Adnan, Fasna, Hiba, Amna, Shaniba } from '@/assets/images/Secretery';
import { JasimSir, ShihabudheenSir } from '@/assets/images/NodalOfficer';
import classNames from 'classnames';
import { Instagram, Mail, PhoneCall } from 'lucide-react';

const Secreteries = [
  {
    image: Fawar,
    name: 'Fawar Rahman',
    position: 'NSS Secretary',
    social: {
      phone: '1234567890',
      email: 'a@gmail.com',
      instagram: 'https://www.instagram.com/',
    }
  },
  {
    image: Adnan,
    name: 'Adnan',
    position: 'NSS Secretary',
    social: {
      phone: '1234567890',
      email: 'a@gmail.com',
      instagram: 'https://www.instagram.com/',
    }
  },
  {
    image: Fasna,
    name: 'Fasna',
    position: 'NSS Secretary',
    social: {
      phone: '1234567890',
      email: 'a@gmail.com',
      instagram: 'https://www.instagram.com/',
    }
  },
  {
    image: Hiba,
    name: 'Hiba',
    position: 'NSS Secretary',
    social: {
      phone: '1234567890',
      email: 'a@gmail.com',
      instagram: 'https://www.instagram.com/',
    }
  },
  {
    image: Amna,
    name: 'Amna',
    position: 'NSS Secretary',
    social: {
      phone: '1234567890',
      email: 'a@gmail.com',
      instagram: 'https://www.instagram.com/',
    }
  },
  {
    image: Shaniba,
    name: 'Shaniba',
    position: 'NSS Secretary',
    social: {
      phone: '1234567890',
      email: 'a@gmail.com',
      instagram: 'https://www.instagram.com/',
    }
  },
];

const NodalOfficers = [
  {
    image: JasimSir,
    name: 'Munavar Jazim',
    position: 'program officer',
    social: {
      phone: '1234567890',
      email: 'demo@gmail.com',
      instagram: 'https://www.instagram.com/',
    }
  },
  {
    image: ShihabudheenSir,
    name: 'Shihabudheen',
    position: 'program officer',
    social: {
      phone: '1234567890',
      email: 'a@gmail.com',
      instagram: 'https://www.instagram.com/',
    }
  },

];

const techTeam = [
  {
    image: 'https://i.pravatar.cc/150?img=2',
    name: 'Zamil',
    position: 'Web Developer',
    social: {
      phone: '1234567890',
      email: 'zamil007@gmail.com',
      instagram: 'https://www.instagram.com/',
    }
  },
  {
    image: 'https://i.pravatar.cc/150?img=3',
    name: 'Dayyan ali',
    position: 'Web Designer',
    social: {
      phone: '1234567890',
      email: 'dayyanali@gmail.com',
      instagram: 'https://www.instagram.com/',
    }
  },
];

const ContactCard = ({ officer, size }) => {
  // console.log(size)
  return (
    <div className='w-fit rounded-xl bg-white shadow p-2'>
      <div className={classNames('bg-slate-200 rounded-full overflow-hidden m-4  flex items-center justify-center pt-4',
        {
          'w-[70px] sm:w-24 h-[70px] sm:h-24': size === 'big',
          'w-[50px] sm:w-[70px] h-[50px] sm:h-[70px]': size === 'small',
        }
      )}>
        {officer.image && <img src={officer.image} alt={officer.name} className='h-auto w-auto' />}
      </div>
      <h1 className='text-center text-[12px] font-semibold text-purple-800'>{officer.name}</h1>
      <p className='text-center text-[8px]'>{officer.position}</p>
      <div className='flex justify-center gap-2 my-2'>
        <a href={`tel:${officer.social.phone}`} className=''>
        <PhoneCall className='w-2 h-2'/>
        </a>
        <a href={`mailto:${officer.social.email}`} className=''>
          <Mail className='w-2 h-2'/>
        </a>
        <a href={officer.social.instagram} className=''>
          <Instagram className='w-2 h-2'/>
        </a>
      </div>
    </div >
  )
};

function Contact() {

  return (
    <div id='contact' className='bg-[#CABBE2]/20  py-8 w-full my-10 mb-0 pb-16'>
      <div className='mb-6'>
        <h1 className='text-4xl text-center text-[#332C6F] font-bold'>Contact Us.</h1>
        <p className='text-center font-normal text-sm'>Get in touch with us</p>
      </div>
      <div className='flex gap-4 justify-center  text-black my-4 flex-wrap'>
        {NodalOfficers.map((officer, index) => (
          <ContactCard key={index} officer={officer} size={'big'} />
        ))}
      </div>
      <div className='flex gap-4 justify-center  text-black flex-wrap'>
        {Secreteries.map((officer, index) => (
          <ContactCard key={index} officer={officer} size={'small'} />
        ))}
      </div>
      <div className='max-w-[1300px] mx-auto'>

      </div>
    </div>
  )
}

export default Contact
