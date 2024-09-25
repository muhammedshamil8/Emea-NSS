import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/config/firebase";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, Loader, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dayjs from "dayjs";

function Event() {
  const [events, setEvents] = useState([]);
  const [majorEvents, setMajorEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const eventCollectionRef = collection(db, "events");
  const majorEventCollectionRef = collection(db, "major_events");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    getEvents();
    getMajorEvents();
  }, []);

  const getEvents = async () => {
    try {
      const data = await getDocs(eventCollectionRef);
      setEvents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    } catch (error) {
      console.error("Error getting documents: ", error);
      setError("Failed to load events. Please try again.");
      setLoading(false);
    }
  };

  const getMajorEvents = async () => {
    try {
      const data = await getDocs(majorEventCollectionRef);
      setMajorEvents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      // setPreview(majorEvents[0]?.fields.thumbnail);
      setLoading(false);
    } catch (error) {
      console.error("Error getting documents: ", error);
      setError("Failed to load events. Please try again.");
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
      setEvents((prev) => prev.filter((event) => event.id !== id));
      toast({
        title: "Event Deleted",
        description: "The event has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast({
        title: "Deletion Error",
        description: "Failed to delete the event. Please try again.",
        variant: 'destructive'
      });
    }
  };

  const handleMajorDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "major_events", id));
      setMajorEvents((prev) => prev.filter((event) => event.id !== id));
      toast({
        title: "Major Event Deleted",
        description: "The major event has been successfully deleted.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast({
        title: "Deletion Error",
        description: "Failed to delete the major event. Please try again.",
        variant: 'destructive'
      });
    }
  };

  if (error) {
    return <p className="text-red-500 text-center my-4">{error}</p>;
  }

  function eventDate(date) {
    return new Date(date?.seconds * 1000);
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-2 justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button onClick={() => navigate("/admin/events/major/add")} className="bg-blue-600 hover:bg-blue-500">
            <Plus className="mr-2" /> Add Major Event
          </Button>
          <Button onClick={() => navigate("/admin/events/add")} className="bg-blue-600 hover:bg-blue-500">
            <Plus className="mr-2" /> Add Event
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader className="animate-spin mx-2" /> Loading...
        </div>
      ) :
        (
          <>
            <h2 className="text-xl font-semibold mb-4">Major Events</h2>
            <div className="flex gap-4 overflow-auto mb-8">
              {majorEvents.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 shadow-md bg-white"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center  justify-between w-full gap-2">
                      <label>Event Image</label>
                      {/* <img src={event.thumbnail} alt="Preview" className="max-w-[120px] max-h-[120px] border p-2 rounded-xl" /> */}
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
                                <img src={event.thumbnail} alt="Preview" className="w-full" />
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <p className="text-gray-600 mb-4">{event.location}</p>
                  <p className="text-gray-600 mb-4">
                    {dayjs(eventDate(event.date)).format('MMMM D, YYYY')} - {dayjs(eventDate(event.date)).format('dddd')}
                  </p>
                  <p className="text-gray-600 mb-4">{event.secret_code}</p>
                  <p className="text-gray-600 mb-4">{event.volunteer_edit_event}</p>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/admin/events/major/edit/${event.id}`)}
                    >
                      <Edit className="mr-2" /> Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex items-center"
                        >
                          <Trash2 className="mr-2" /> Delete
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Deleting this event will remove all related data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel asChild>
                            <Button variant="outline">Cancel</Button>
                          </AlertDialogCancel>

                          <AlertDialogAction asChild>
                            <Button
                              variant="destructive"
                              onClick={() => handleMajorDelete(event.id)}
                            >
                              Confirm Delete
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 shadow-md bg-white"
                >
                  <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <p className="text-gray-600 mb-4">{event.location}</p>
                  <p className="text-gray-600 mb-4">
                    {dayjs(eventDate(event.date)).format('MMMM D, YYYY')} - {dayjs(eventDate(event.date)).format('dddd')}
                  </p>
                  <p className="text-gray-600 mb-4">{event.secret_code}</p>
                  <p className="text-gray-600 mb-4">{event.volunteer_edit_event}</p>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                    >
                      <Edit className="mr-2" /> Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex items-center"
                        >
                          <Trash2 className="mr-2" /> Delete
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Deleting this event will remove all related data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel asChild>
                            <Button variant="outline">Cancel</Button>
                          </AlertDialogCancel>

                          <AlertDialogAction asChild>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(event.id)}
                            >
                              Confirm Delete
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      {events.length === 0 && !loading && (
        <p className="text-gray-500 text-center">No events available. Please add an event.</p>
      )}
    </div>
  );
}

export default Event;
