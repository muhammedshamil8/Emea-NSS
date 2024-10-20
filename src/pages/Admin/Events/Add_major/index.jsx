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
});

export default function EventForm({ eventId }) {
  const { toast } = useToast();
  const [imageUpload, setImageUpload] = useState(null);
  const EventCollectionRef = collection(db, 'major_events');
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [submitloading, setSubmitLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      thumbnail: null,
      title: "",
      description: "",
      date: new Date(),
      location: "",
    },
  });


  useEffect(() => {
    if (eventId) {
      // Load existing event data for editing
      const fetchEventData = async () => {
        const eventDoc = await doc(db, 'major_events', eventId).get();
        form.reset(eventDoc.data());
        setPreview(eventDoc.data().thumbnail);
        setLoading(false);
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

      const eventData = {
        ...values,
        thumbnail: url,
        created_at: new Date(),
        updated_at: new Date(),
      };


      if (eventId) {
        // Update existing event
        await updateDoc(doc(EventCollectionRef, eventId), eventData);
        toast({ title: "Event Updated", description: "Event has been updated successfully." });
      } else {
        // Create new event and retrieve the document reference
        const newEventDoc = await addDoc(EventCollectionRef, eventData);
        await updateDoc(newEventDoc, { id: newEventDoc.id });
        toast({ title: "Event Created", description: "Event has been created successfully." });
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
    <div className="admin-event-form max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
                    <Input placeholder="Event description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField

              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
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
