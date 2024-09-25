import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOutletContext } from 'react-router-dom';

const Profile = () => {
  const { myData } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const profilePicture = "https://i.pravatar.cc/150?img=2";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <img
          src={profilePicture}
          alt={`${name}'s profile`}
          className="w-32 h-32 rounded-full border-4 border-gray-200 mr-6"
        />
        <div>
          <h1 className="text-3xl font-bold">{myData?.name}</h1>
          <p className="text-gray-600">Email: {myData?.email}</p>
          <p className="text-gray-600">Phone: {myData?.phone_number}</p>
          <p className="text-gray-600">Role: {myData?.role}</p>
          <p className="text-gray-600">Unit: {myData?.unit}</p>
          <p className="text-gray-600">Roll No: {myData?.roll_no}</p>
          <p className="text-gray-600">Joined: {myData?.joinedYear}</p>
          <p className="text-gray-600">Last Updated: </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">Events Attended: 10</p> {/* Replace with actual data */}
          <p className="text-lg font-semibold">Total Events: 15</p> {/* Replace with actual data */}
          <p className="text-lg font-semibold">Attendance Percentage: 66.7%</p> {/* Replace with actual data */}
        </CardContent>
      </Card>

    </div>
  );
};

export default Profile;
