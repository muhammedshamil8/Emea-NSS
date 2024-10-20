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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from '@/config/firebase';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, getDoc } from 'firebase/firestore';
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
import classNames from "classnames";
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
  attended_volunteers: z.array(z.string()).optional(),
  secret_code: z.string(),
});

export default function EventForm({ }) {
  const eventId = useParams().id;
  const { toast } = useToast();
  const [imageUpload, setImageUpload] = useState(null);
  const EventCollectionRef = collection(db, 'events');
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [secretCode, setSecretCode] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [Options, setOptions] = useState([]);
  const [isAllowed, setIsAllowed] = useState(false)
  const volunteerCollectionRef = collection(db, 'Users');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [secret_code, setSecret_code] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      thumbnail: null,
      title: "",
      description: "",
      date: new Date(),
      location: "",
      attended_volunteers: [],
      secret_code: secretCode
    },
  });

  useEffect(() => {
    const fetchVolunteers = async () => {
      const volunteerCollectionRef = collection(db, 'Users');
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
          setSecret_code(eventData.secret_code);
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


  const saveEvent = async (values, url) => {
    setSubmitLoading(true);
    try {
      console.log('Form Values:', values);

      if (values.secret_code !== secret_code) {
        return toast({
          title: "Secret Code Error",
          description: "Invalid secret code. Please enter the correct code.",
        });
      }
      const eventData = {
        attended_volunteers: values.attended_volunteers,
        updated_at: new Date(),
      };

      let eventDocId;
      let existingAssignedVolunteers = [];
      let existingAttendedVolunteers = [];

      if (!eventId) {
        return toast({
          title: "Event Creation Error",
          description: "Event creation is not allowed.",
        });
      }
      // Fetch existing event to get current volunteers
      try {
        const eventDoc = doc(EventCollectionRef, eventId);
        const eventSnapshot = await getDoc(eventDoc);
        const existingEventData = eventSnapshot.data();

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



      // Identify newly attended volunteers
      const newAttendedVolunteers = values.attended_volunteers.filter(
        volunteerId => !existingAttendedVolunteers.includes(volunteerId)
      );


      // Identify volunteers to be removed from attended_volunteers
      const removedAttendedVolunteers = existingAttendedVolunteers.filter(
        volunteerId => !values.attended_volunteers.includes(volunteerId)
      );


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
    <div className="p-8 min-h-screen">
    <div className="admin-event-form max-w-[900px] my-10 mx-auto p-10 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{eventId ? "Edit Event" : "Create Event"}</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className={classNames('border-dashed border-2 border-gray-400 p-8 flex items-center justify-center cursor-pointer',
                { hidden: !isAllowed }
              )} onClick={() => document.getElementById('file-input').click()}>
                <span className="text-gray-500 text-lg">+ Upload Thumbnail Image</span>
              </div>
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
                    <Button onClick={() => setPreview(null)} className={classNames('ml-2', { 'hidden': !isAllowed })} variant="destructive">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea className="max-h-[150px] min-h-[140px]" disabled={!isAllowed} placeholder="Event description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={!isAllowed} placeholder="Event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="grid grid-cols-2 gap-4">

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
                            disabled={!isAllowed}
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
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input disabled={!isAllowed} placeholder="Event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assigned_volunteers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendees</FormLabel>
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
              name="secret_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={submitLoading}>{submitLoading ? (
              <Loader className="animate-spin" />
            ) : (
              eventId ? "Update Event" : "Create Event"
            )}</Button>
          </form>
        </Form>
      )
      }
    </div >
    </div>
  );
}
