import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOutletContext } from 'react-router-dom';

const Profile = () => {
  const { myData } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const profilePicture = "https://i.pravatar.cc/150?img=2";

  // Simulate data loading
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);  // Simulate API call delay
  }, []);

  if (loading) {
    return (
      <div className="p-8 min-h-screen">
      <div className="flex justify-center items-center py-20">
        <p className="text-xl font-semibold text-gray-600">Loading profile...</p>
      </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
    <div className="flex justify-center items-center  bg-gray-50 py-10">
      <div className="w-full max-w-6xl p-8 bg-white shadow-2xl rounded-lg flex space-x-8">
        
        {/* Left Column */}
        <div className="w-1/3">
          <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="flex items-center justify-center p-6 bg-gray-100">
              <img
                src={profilePicture}
                alt={`${myData?.name}'s profile`}
                className="w-40 h-40 rounded-full border-4 border-gray-300 shadow-md"
              />
            </CardHeader>
            <CardContent className="text-center p-6">
              <h1 className="text-4xl font-bold text-gray-800">{myData?.name}</h1>
              <p className="text-gray-500 mt-2">{myData?.role}</p>
              {/* <Button className="mt-6 w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                Edit Profile
              </Button> */}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="w-2/3 space-y-8">
          {/* Profile Information */}
          <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-700">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-600">
              <p><span className="font-semibold">Email:</span> {myData?.email}</p>
              <p><span className="font-semibold">Phone:</span> {myData?.phone_number}</p>
              <p><span className="font-semibold">Unit:</span> {myData?.unit}</p>
              <p><span className="font-semibold">Roll No:</span> {myData?.roll_no}</p>
              <p><span className="font-semibold">Joined:</span> {myData?.joinedYear}</p>
              <p><span className="font-semibold">Last Updated:</span> {new Date().toLocaleDateString()}</p>
            </CardContent>
          </Card>

          {/* Attendance Overview */}
          <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-700">Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-600">
              <p><span className="font-semibold">Events Attended:</span> 10</p>
              <p><span className="font-semibold">Total Events:</span> 15</p>
              <p><span className="font-semibold">Attendance Percentage:</span> 66.7%</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;
