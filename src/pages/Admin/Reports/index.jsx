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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Trash2, Eye  ,Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { db } from "@/config/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import dayjs from 'dayjs';
import { Textarea } from "@/components/ui/textarea";


const formSchema = z.object({
  doc_link: z.string().url("Must be a valid URL"),
  name: z.string().nonempty({ message: "Report name is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
});

export default function Reports() {
  const { toast } = useToast();
  const [reportList, setReportList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [parent] = useAutoAnimate();
  const reportsCollectionRef = collection(db, "reports");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
    try {
      const querySnapshot = await getDocs(reportsCollectionRef);
      const reports = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(reports); // Log the reports to inspect their structure
      setReportList(reports);
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  };


  const deleteReport = async (id) => {
    if (!id) {
      return toast({ title: "Error", description: "Report ID not found for deletion." });
    }
    try {
      const reportDoc = doc(db, "reports", id);
      await deleteDoc(reportDoc);
      toast({ title: "Report Deleted", description: "Report has been deleted successfully." });
      getReports();
    } catch (error) {
      console.error("Error removing document: ", error);
      toast({ title: "Error", description: "Failed to delete report." });
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { doc_link: "", name: "", description: "" },
  });

  const onSubmit = async (values) => {
    await addReport(values);
  };

  const addReport = async (values) => {
    const report = {
      ...values,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
    await addDoc(reportsCollectionRef, report);
    setReportList((prev) => [...prev, report]);
    form.reset();
    setShowForm(false);
    toast({ title: "Report Added", description: "Report has been added successfully." });
  };

  return (
    <section className="p-4 min-h-screen">
    <div className="admin-reports-page max-w-[900px] mx-auto p-10 my-10 bg-white shadow-lg rounded-lg" ref={parent}>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold mb-4">Manage Reports</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'Add Report'}
        </Button>
      </div>

      {showForm && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="doc_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Google Drive link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Report name" {...field} />
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
                    <Textarea className="max-h-[150px] min-h-[140px]" placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>
      )}

      <div className="report-list mt-8">
        <h2 className="text-xl font-semibold">Existing Reports</h2>
        <ul>

          {loading ?
            (<div className="flex justify-center items-center h-48">
              <Loader className="animate-spin mx-2" /> Loading...
            </div>
            ) : (
              reportList.map((report, index) => (
                <li key={index} className="flex justify-between items-center border-b py-2">
                  <div>
                    <strong>{report.name}</strong>
                    <p>{report.description}</p>
                    <p className="text-gray-500 text-sm">
                      {report.created_at instanceof Timestamp
                        ? dayjs(report.created_at.toDate()).format("MMMM D, YYYY h:mm A")
                        : typeof report.created_at === 'string' // Check if it's a string or a date string
                          ? dayjs(report.created_at).format("MMMM D, YYYY h:mm A")
                          : "Unknown Date"}
                    </p>

                  </div>
                  <div>
                    <a
                      href={report.doc_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Open PDF
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Eye size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Report Preview</DialogTitle>
                          <a href={report.doc_link} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                            View Document
                          </a>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="flex items-center justify-center">
                          <Trash2 className="" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will delete the report permanently.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteReport(report.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))
            )}
          {!loading && reportList.length === 0 && (
            <li className="text-gray-500 text-sm mt-2">No reports found.</li>)}
        </ul>
      </div>
    </div>
    </section>
  );
}
