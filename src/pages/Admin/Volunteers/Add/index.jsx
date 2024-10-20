import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { db } from '@/config/firebase';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

// Define the schema for the volunteer form
const formSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone_number: z.string().nonempty({ message: "Phone number is required" }),
  department: z.string().nonempty({ message: "Department is required" }),
  admission_number: z.string().nonempty({ message: "Admission number is required" }),
  dob: z.string().nonempty({ message: "Date of birth is required" }),
  unit: z.string().nonempty({ message: "Unit is required" }),
  roll_no: z.string().nonempty({ message: "Roll number is required" }),
  events_managed: z.array(z.string()).optional(),
  events_attended: z.array(z.string()).optional(),
});

const departmentOptions = [
  { value: "BA Economics", label: "BA Eco" },
  { value: "BA English", label: "BA Eng" },
  { value: "BA WAS", label: "BA WAS" },
  { value: "BBA", label: "BBA" },
  { value: "BSc Biotech", label: "BSc Biotech" },
  { value: "BSc Biochem", label: "BSc Biochem" },
  { value: "BSc Computer Science", label: "BSc CS" },
  { value: "BSc Maths and Physics", label: "BSc Maths and Physics" },
  { value: "BSc Microbiology", label: "BSc Micro" },
  { value: "B.Com CA", label: "B.Com CA" },
  { value: "B.Com Co-op", label: "B.Com Co-op" },
  { value: "BVoc Islamic finance", label: "BVoc IF" },
  { value: "BVoc Logistics", label: "BVoc Logi" },
  { value: "BVoc Prof", label: "BVoc Prof" },
];

const years = [
  { label: '2022', value: '2022' },
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
];

export default function VolunteerForm({ userId }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const UserCollectionRef = collection(db, 'users');
  const apiUrl = import.meta.env.VITE_SERVER_API_URL;
  const authContext = useAuth();
  const { user, role: userRole, handleSignOut } = authContext || {};
  const [searchQuery, setSearchQuery] = useState('');


  // console.log('User:', user);  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      department: "",
      admission_number: "",
      dob: new Date(),
      unit: "",
      roll_no: "",
      events_managed: [],
      events_attended: []
    },
  });

  useEffect(() => {
    if (userId) {
      // Load existing user data for editing
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          form.reset(userDoc.data());
        } else {
          toast({ title: "User not found", description: "No user data found for this ID." });
        }
        setLoading(false);
      };
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [userId, form, toast]);

  const onSubmit = async (values) => {
    console.log('Form values:', values);
    const formatDate = (dateString) => {
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    };
    const uppercaseAdmissionNumber = values.admission_number.toUpperCase();
    const formattedDate = formatDate(values.dob);
    const data = {
      name: values.name,
      email: values.email,
      phone_number: values.phone_number,
      department: values.department,
      admission_number: uppercaseAdmissionNumber,
      date_of_birth: formattedDate,
      nss_unit: values.unit,
      nss_roll_no: values.roll_no,
    }
    try {
      if (userId) {
        // Update existing user
        const response = await fetch(`${apiUrl}/volunteer/update/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(data),
        });
        if (response.status === 409) {
          const data = await response.json();
          toast({ title: "Conflict", description: data.message });
        } else if (response.ok) {
          const data = await response.json();
          toast({ title: "User Created", description: "User has been created successfully." });
        } else if (!response.ok) {
          const data = await response.json();
          // console.error('Error saving user data:', data);
          toast({ title: "Error", description: data.message });
        }
        else {
          const data = await response.json();
          console.error('Error saving user data:', data);
          toast({ title: "Error", description: "There was an error saving the user data." });
        }
        // console.log(response);
      } else {
        // Create new user
        const response = await fetch(`${apiUrl}/volunteer/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(data),
        });
        if (response.status === 409) {
          const data = await response.json();
          toast({ title: "Conflict", description: data.message });
        } else if (response.ok) {
          const data = await response.json();
          toast({ title: "User Created", description: "User has been created successfully." });
        } else if (!response.ok) {
          const data = await response.json();
          // console.error('Error saving user data:', data);
          toast({ title: "Error", description: data.message });
        } else {
          toast({ title: "Error", description: "There was an error saving the user data." });
        }
        // console.log(response);
      }

      form.reset();
    } catch (error) {
      console.error('Error saving user data:', error);
      toast({ title: "Error", description: "There was an error saving the user data." });
    }
  };

  const filteredDepartments = departmentOptions.filter(dept =>
    dept.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="p-4 min-h-screen">
      <div className="admin-volunteer-form max-w-[900px] mx-auto p-6 bg-white shadow-lg rounded-lg ">
        <h1 className="text-2xl font-bold mb-4">{userId ? "Edit Volunteer" : "Create Volunteer"}</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Volunteer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="admission_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admission Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Admission Number" className="uppercase"  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Volunteer email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Volunteer phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <FormField
                  control={form.control}
                  name="Year_Joined"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Joined</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the year joined" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year.value} value={year.value}>
                              {year.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>
                                {/* Search Input */}
                                <input
                                  type="search"
                                  placeholder="Search departments"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="w-[90%] mx-auto py-2 outline-none" // Add your styling here
                                  clear={'true'}
                                />
                              </SelectLabel>

                              {/* Filtered Department Options */}
                              {filteredDepartments.map((dept, index) => (
                                <SelectItem key={index} value={dept.value}>
                                  {dept.value}
                                </SelectItem>
                              ))}
                              {filteredDepartments.length === 0 && (
                                <SelectItem disabled key={111}>
                                  No departments found
                                </SelectItem>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" placeholder="Date of birth"  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the Unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="104">Unit 104</SelectItem>
                          <SelectItem value="105">Unit 105</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="roll_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Roll number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">{userId ? "Update Volunteer" : "Create Volunteer"}</Button>
            </form>
          </Form>
        )}
      </div>
    </section>
  );
}
