import React from 'react';
import { Fawar, Adnan, Fasna, Hiba, Amna, Shaniba } from '@/assets/images/Secretery';
import { JasimSir, ShihabudheenSir } from '@/assets/images/NodalOfficer';
import classNames from 'classnames';
import { Instagram, Mail, PhoneCall } from 'lucide-react';

// Card Component
function Card({ title, count, icon }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 max-w-[500px]">
      <div className="p-3 rounded-full bg-blue-100">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-600 text-lg font-semibold">{title}</h3>
        <p className="text-3xl font-bold">{count}</p>
      </div>
    </div>
  );
}

// Data for team members
const Secretaries = [
  { image: Fawar, name: 'Fawar Rahman', position: 'NSS Secretary', social: { phone: '1234567890', email: 'a@gmail.com', instagram: 'https://www.instagram.com/' } },
  { image: Adnan, name: 'Adnan', position: 'NSS Secretary', social: { phone: '1234567890', email: 'a@gmail.com', instagram: 'https://www.instagram.com/' } },
  { image: Fasna, name: 'Fasna', position: 'NSS Secretary', social: { phone: '1234567890', email: 'a@gmail.com', instagram: 'https://www.instagram.com/' } },
  { image: Hiba, name: 'Hiba', position: 'NSS Secretary', social: { phone: '1234567890', email: 'a@gmail.com', instagram: 'https://www.instagram.com/' } },
  { image: Amna, name: 'Amna', position: 'NSS Secretary', social: { phone: '1234567890', email: 'a@gmail.com', instagram: 'https://www.instagram.com/' } },
  { image: Shaniba, name: 'Shaniba', position: 'NSS Secretary', social: { phone: '1234567890', email: 'a@gmail.com', instagram: 'https://www.instagram.com/' } },
];

const NodalOfficers = [
  { image: JasimSir, name: 'Munavar Jazim', position: 'Program Officer', social: { phone: '1234567890', email: 'demo@gmail.com', instagram: 'https://www.instagram.com/' } },
  { image: ShihabudheenSir, name: 'Shihabudheen', position: 'Program Officer', social: { phone: '1234567890', email: 'a@gmail.com', instagram: 'https://www.instagram.com/' } },
];

const techTeam = [
  { image: 'https://i.pravatar.cc/150?img=2', name: 'Zamil', position: 'Web Developer', social: { phone: '1234567890', email: 'zamil007@gmail.com', instagram: 'https://www.instagram.com/' } },
  { image: 'https://i.pravatar.cc/150?img=3', name: 'Dayyan Ali', position: 'Web Designer', social: { phone: '1234567890', email: 'dayyanali@gmail.com', instagram: 'https://www.instagram.com/' } },
];

// Profile Card Component
function ProfileCard({ member }) {
  return (
   
    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 max-w-[500px] ">
      <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mb-3 border-2 border-blue-300" />
      <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
      <p className="text-gray-600">{member.position}</p>
      <div className="mt-2 flex space-x-3">
        <a href={`tel:${member.social.phone}`} className={classNames("text-blue-500 hover:text-blue-700 transition-colors duration-200")} aria-label="Phone">
          <PhoneCall size={24} />
        </a>
        <a href={`mailto:${member.social.email}`} className={classNames("text-blue-500 hover:text-blue-700 transition-colors duration-200")} aria-label="Email">
          <Mail size={24} />
        </a>
        <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className={classNames("text-blue-500 hover:text-blue-700 transition-colors duration-200")} aria-label="Instagram">
          <Instagram size={24} />
        </a>
      </div>
    </div>
   
  );
}

// Main Component
function Dashboard() {
  return (
    <div className="min-h-screen  p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card 
          title="Volunteers" 
          count={120} 
          icon={<i className="fas fa-users text-blue-600 text-2xl"></i>} 
        />
        <Card 
          title="Events" 
          count={35} 
          icon={<i className="fas fa-calendar-alt text-green-600 text-2xl"></i>} 
        />
        <Card 
          title="Reports" 
          count={75} 
          icon={<i className="fas fa-file-alt text-yellow-600 text-2xl"></i>} 
        />
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">NSS Secretaries</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {Secretaries.map((member, index) => (
          <ProfileCard key={index} member={member} />
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nodal Officers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {NodalOfficers.map((member, index) => (
          <ProfileCard key={index} member={member} />
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tech Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {techTeam.map((member, index) => (
          <ProfileCard key={index} member={member} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
