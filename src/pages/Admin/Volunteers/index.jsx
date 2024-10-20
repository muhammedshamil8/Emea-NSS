import React, { useEffect, useState } from 'react';
import { db } from '@/config/firebase'; // Adjust the path as needed
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

const Volunteer = () => {
  const { toast } = useToast();
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const volunteerCollectionRef = collection(db, 'Users');
        const volunteerData = await getDocs(volunteerCollectionRef);
        setVolunteers(volunteerData.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        console.log(volunteers);
      } catch (error) {
        console.error("Error getting documents: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setVolunteers(volunteers.filter(volunteer => volunteer.id !== id));
      toast({ title: "Volunteer Deleted", description: "The volunteer has been deleted successfully." });
    } catch (error) {
      console.error("Error deleting volunteer: ", error);
      toast({ title: "Delete Failed", description: "There was an error deleting the volunteer." });
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer =>
    volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Volunteer List</h1>

      <div className="mb-4 flex justify-between items-center flex-col gap-4 sm:flex-row-reverse">
        <Button onClick={() => window.location.href = '/admin/add-volunteer'}>Add Volunteer</Button>
        <Input
          type="text"
          placeholder="Search Volunteers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 mr-4"
        />

      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="flex justify-center items-center h-48 col-span-3">
            <Loader className="animate-spin mx-2" /> Loading...
          </div>
        ) : (
          filteredVolunteers.map(volunteer => (
            <div key={volunteer.id} className="border p-4 rounded-lg shadow-md bg-white">
              <h2 className="text-lg font-semibold">{volunteer.name}</h2>
              <p>Email: {volunteer.email}</p>
              <p>Phone: {volunteer.phone_number}</p>
              <p>Role: {volunteer.role}</p>
              <p>Unit: {volunteer.unit}</p>
              <div className="mt-4 flex justify-between">
                <Button onClick={() => window.location.href = `/admin/edit-volunteer/${volunteer.id}`}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(volunteer.id)}>Delete</Button>
              </div>
            </div>
          ))
        )}
        {!loading && filteredVolunteers.length === 0 && <p className="text-center text-gray-500">No volunteers found.</p>}
      </div>
    </section>
  );
};

export default Volunteer;
