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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from '@/config/firebase';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, arrayUnion, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { format } from "date-fns"
import { Calendar as CalendarIcon, Loader } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/extension/multi-select";
import { Trash2, Eye } from "lucide-react";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  thumbnail: z
    .any()
    .nullable()
    .refine((file) => file && file.size < 2 * 1024 * 1024, {
      message: "File size must be less than 2MB",
    })
    .refine((file) => {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      return file && validTypes.includes(file.type);
    }, {
      message: "Only PNG, JPEG, or JPG files are allowed",
    }),
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  date: z.date({
    message: "Date is required",
  }),
  location: z.string().nonempty({ message: "Location is required" }),
  assigned_volunteers: z.array(z.string()).optional(),
  attended_volunteers: z.array(z.string()).optional(),
  secret_code: z.string(),
  volunteer_edit_attendance: z.boolean().optional(),
});

export default function EventForm({ }) {
  const eventId = useParams().id;
  const { toast } = useToast();
  const [imageUpload, setImageUpload] = useState(null);
  const EventCollectionRef = collection(db, 'events');
  const volunteerCollectionRef = collection(db, 'Users');
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [secretCode, setSecretCode] = useState(generateSecretCode());
  const [volunteers, setVolunteers] = useState([]);
  const [Options, setOptions] = useState([]);
  const [submitloading, setSubmitLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      thumbnail: null,
      title: "",
      description: "",
      date: new Date(),
      location: "",
      assigned_volunteers: [],
      attended_volunteers: [],
      volunteer_edit_attendance: true,
      secret_code: secretCode
    },
  });

  useEffect(() => {
    const fetchVolunteers = async () => {
      const volunteerQuery = query(volunteerCollectionRef, where("role", "==", "volunteer"));
      const volunteerData = await getDocs(volunteerQuery);
      setVolunteers(volunteerData.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      console.log(volunteers);
    };
    fetchVolunteers();
  }, []);

  useEffect(() => {
    setOptions(volunteers.map((memb) => ({
      value: memb?.id,
      label: memb?.name,
    })));
  }, [volunteers]);

  useEffect(() => {
    if (eventId) {
      // Load existing event data for editing
      const fetchEventData = async () => {
        const eventDocRef = doc(EventCollectionRef, eventId);
        const eventDocSnap = await getDoc(eventDocRef); // Fetch the document data

        if (eventDocSnap.exists()) {
          const eventData = eventDocSnap.data(); // Extract the data
          console.log('Event Data:', eventData);
          form.setValue("title", eventData.title);
          form.setValue("description", eventData.description);
          form.setValue("date", eventData.date.toDate());
          form.setValue("location", eventData.location);
          form.setValue("assigned_volunteers", eventData.assigned_volunteers);
          form.setValue("attended_volunteers", eventData.attended_volunteers);
          form.setValue("volunteer_edit_attendance", eventData.volunteer_edit_attendance);
          form.setValue("secret_code", eventData.secret_code);

          setPreview(eventData.thumbnail);
          setLoading(false);
        } else {
          console.log("No such document!");
        }
      };

      fetchEventData();
    } else {
      setLoading(false);
    }
  }, [eventId, form]);

  const uploadFile = async (values) => {
    if (!imageUpload) {
      return toast({
        title: "Image Upload Error",
        description: "Please upload an image.",
      });
    }
    const imageRef = ref(storage, `events/${imageUpload.name}`);
    try {
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);
      setPreview(url);
      await saveEvent(values, url);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the image.",
      });
    }
  };

  // Function to generate a secret code
  function generateSecretCode() {
    return Math.random().toString(36).substring(2, 7).toUpperCase(); // Generates a random alphanumeric string
  }

  const handleGenerateCode = () => {
    const newCode = generateSecretCode();
    setSecretCode(newCode);
    form.setValue("secret_code", newCode); // Update the form with the new code
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(secretCode).then(() => {
      toast({
        title: "Code Copied",
        description: "The secret code has been copied to your clipboard.",
      });
    });
  };

  const saveEvent = async (values, url) => {
    setSubmitLoading(true);
    try {
      console.log('Form Values:', values);

      const eventData = {
        ...values,
        thumbnail: url,
        attendance_marked: false,
        volunteer_edit_event: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      let eventDocId;
      let existingAssignedVolunteers = [];
      let existingAttendedVolunteers = [];

      if (eventId) {
        // Fetch existing event to get current volunteers
        try {
          const eventDoc = doc(EventCollectionRef, eventId);
          const eventSnapshot = await getDoc(eventDoc);
          const existingEventData = eventSnapshot.data();

          existingAssignedVolunteers = existingEventData?.assigned_volunteers || [];
          existingAttendedVolunteers = existingEventData?.attended_volunteers || [];
        } catch (error) {
          console.error("Error fetching existing event data:", error);
          toast({ title: "Error", description: "Failed to fetch existing event data." });
          return;
        }

        // Update existing event
        await updateDoc(doc(EventCollectionRef, eventId), eventData);
        eventDocId = eventId;
        toast({ title: "Event Updated", description: "Event has been updated successfully." });
      } else {
        // Create new event and retrieve the document reference
        const newEventDoc = await addDoc(EventCollectionRef, eventData);
        await updateDoc(newEventDoc, { id: newEventDoc.id });
        eventDocId = newEventDoc.id;
        toast({ title: "Event Created", description: "Event has been created successfully." });
      }

      // Identify newly assigned volunteers
      const newAssignedVolunteers = values.assigned_volunteers.filter(
        volunteerId => !existingAssignedVolunteers.includes(volunteerId)
      );

      // Identify newly attended volunteers
      const newAttendedVolunteers = values.attended_volunteers.filter(
        volunteerId => !existingAttendedVolunteers.includes(volunteerId)
      );

      // Identify volunteers to be removed from assigned_volunteers
      const removedAssignedVolunteers = existingAssignedVolunteers.filter(
        volunteerId => !values.assigned_volunteers.includes(volunteerId)
      );

      // Identify volunteers to be removed from attended_volunteers
      const removedAttendedVolunteers = existingAttendedVolunteers.filter(
        volunteerId => !values.attended_volunteers.includes(volunteerId)
      );

      // Update newly assigned volunteers (events_managed)
      if (newAssignedVolunteers.length > 0) {
        try {
          for (let volunteerId of newAssignedVolunteers) {
            const volunteerDoc = doc(volunteerCollectionRef, volunteerId);
            await updateDoc(volunteerDoc, {
              events_managed: arrayUnion(eventDocId),
            });
          }
        } catch (error) {
          console.error("Error updating assigned volunteers:", error);
          toast({ title: "Error", description: "Failed to update assigned volunteers." });
        }
      }

      // Remove event from volunteers who are no longer assigned (events_managed)
      if (removedAssignedVolunteers.length > 0) {
        try {
          for (let volunteerId of removedAssignedVolunteers) {
            const volunteerDoc = doc(volunteerCollectionRef, volunteerId);
            await updateDoc(volunteerDoc, {
              events_managed: arrayRemove(eventDocId),
            });
          }
        } catch (error) {
          console.error("Error removing volunteers from assigned list:", error);
          toast({ title: "Error", description: "Failed to remove unassigned volunteers." });
        }
      }

      // Update newly attended volunteers (events_attended)
      if (newAttendedVolunteers.length > 0) {
        try {
          for (let volunteerId of newAttendedVolunteers) {
            const volunteerDoc = doc(volunteerCollectionRef, volunteerId);
            await updateDoc(volunteerDoc, {
              events_attended: arrayUnion(eventDocId),
            });
          }
        } catch (error) {
          console.error("Error updating attended volunteers:", error);
          toast({ title: "Error", description: "Failed to update attended volunteers." });
        }
      }

      // Remove event from volunteers who no longer attended (events_attended)
      if (removedAttendedVolunteers.length > 0) {
        try {
          for (let volunteerId of removedAttendedVolunteers) {
            const volunteerDoc = doc(volunteerCollectionRef, volunteerId);
            await updateDoc(volunteerDoc, {
              events_attended: arrayRemove(eventDocId),
            });
          }
        } catch (error) {
          console.error("Error removing volunteers from attended list:", error);
          toast({ title: "Error", description: "Failed to remove unattended volunteers." });
        }
      }

      // Reset form and clear image preview
      form.reset();
      setImageUpload(null);
      setPreview(null);

    } catch (error) {
      console.error("Error saving event:", error);
      toast({ title: "Error", description: "Failed to save the event. Please try again." });
    } finally {
      setSubmitLoading(false);
    }
  };


  const onSubmit = async (values) => {
    try {
      await uploadFile(values);
    } catch (error) {
      console.error('Submission Error:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting the form.",
      });
    }
  };


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) {
      setPreview(URL.createObjectURL(file));
      form.setValue("thumbnail", file);
      setImageUpload(file);
    } else {
      toast({
        title: "Image Size Error",
        description: "Image size exceeds 2MB. Please select a smaller file.",
      });
    }
  };

  return (
    <section className="p-4 min-h-screen">
    <div className="admin-event-form max-w-2xl mx-auto p-10 my-10 bg-white shadow-lg rounded-lg ">
      <h1 className="text-2xl font-bold mb-4">{eventId ? "Edit Event" : "Create Event"}</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!preview && (
              <div className="border-dashed border-2 border-gray-400 p-8 flex items-center justify-center cursor-pointer" onClick={() => document.getElementById('file-input').click()}>
                <span className="text-gray-500 text-lg">+ Upload Thumbnail Image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageChange}
              id="file-input"
              className="hidden"
            />
            {preview && (
              <div className="flex items-center mt-2 flex-col justify-center gap-2">
                <img src={preview} alt="Preview" className="max-w-[120px] max-h-[120px] border p-2 rounded-xl" />
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Eye size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Image Preview</DialogTitle>
                        <DialogDescription>
                          <img src={preview} alt="Preview" className="w-full" />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={() => setPreview(null)} className="ml-2" variant="destructive">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="max-h-[150px] min-h-[140px]" placeholder="Event description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField

                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date("2020-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="Event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assigned_volunteers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Volunteers</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value} // Pass the current values from the form state
                        onValuesChange={(selectedValues) => field.onChange(selectedValues)} // Update form state when values change
                        loop={false}
                      >
                        <MultiSelectorTrigger options={Options}>
                          <MultiSelectorInput placeholder="Select Volunteers names" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {loading ? (
                              <MultiSelectorItem>
                                <div className='text-sm flex w-full items-center justify-between'>
                                  <div className='flex flex-col'>
                                    <span>
                                      Loading...
                                    </span>
                                  </div>
                                </div>
                              </MultiSelectorItem>
                            ) : (volunteers && volunteers.map((memb) => (
                              <MultiSelectorItem key={memb.id} value={memb.id}>
                                <div className='text-sm flex w-full items-center justify-between'>
                                  <div className='flex flex-col'>
                                    <span>
                                      {memb?.name}
                                    </span>
                                    <span className='text-[10px]'>
                                      {memb?.department}
                                    </span>
                                  </div>
                                  <span className='text-[12px] px-2'>
                                    ({memb?.nss_roll_no})
                                  </span>
                                </div>
                              </MultiSelectorItem>
                            )))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>
                    {/* <FormDescription>Select the events you have coordinated for.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attended_volunteers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attended Volunteers</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value} // Pass the current values from the form state
                        onValuesChange={(selectedValues) => field.onChange(selectedValues)} // Update form state when values change
                        loop={false}
                      >
                        <MultiSelectorTrigger options={Options}>
                          <MultiSelectorInput placeholder="Select Volunteers names" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {loading ? (
                              <MultiSelectorItem>
                                <div className='text-sm flex w-full items-center justify-between'>
                                  <div className='flex flex-col'>
                                    <span>
                                      Loading...
                                    </span>
                                  </div>
                                </div>
                              </MultiSelectorItem>
                            ) : (volunteers && volunteers.map((memb) => (
                              <MultiSelectorItem key={memb.id} value={memb.id}>
                                <div className='text-sm flex w-full items-center justify-between'>
                                  <div className='flex flex-col'>
                                    <span>
                                      {memb?.name}
                                    </span>
                                    <span className='text-[10px]'>
                                      {memb?.department}
                                    </span>
                                  </div>
                                  <span className='text-[12px] px-2'>
                                    ({memb?.nss_roll_no})
                                  </span>
                                </div>
                              </MultiSelectorItem>
                            )))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>
                    {/* <FormDescription>Select the events you have coordinated for.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem >
                <FormLabel>Attendance Marking</FormLabel>
                <FormField
                  control={form.control}
                  name="volunteer_edit_attendance"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-start space-x-3 rounded-md border p-4 py-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Allow assigned volunteers to edit attendance
                        </FormLabel>
                        <FormDescription>
                          If enabled, volunteers can mark their attendance for the event.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </FormItem>

              <FormField
                control={form.control}
                name="secret_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Code</FormLabel>
                    <FormControl>
                      <Input disabled={true} {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                    <div className="flex space-x-2 mt-2">
                      <Button type="button" onClick={handleCopyCode}>Copy</Button>
                      <Button type="button" onClick={handleGenerateCode}>Refresh</Button>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitloading}>
              {submitloading ? (<Loader className=" animate-spin" />) : (eventId ? "Update Event" : "Create Event")}
              { }
            </Button>
          </form>
        </Form>
      )
      }
    </div >
    </section>
  );
}
