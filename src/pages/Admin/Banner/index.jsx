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
  DialogDescription,
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
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Trash2, Eye, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { db, storage } from '@/config/firebase';
import { collection, addDoc, getDocs, deleteDoc, getDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import classNames from "classnames";

const formSchema = z.object({
  banner_img: z
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
  name: z.string().nonempty({ message: "Banner name is required" }),
});

export default function Banner() {
  const { toast } = useToast();
  const [bannerList, setBannerList] = useState([]);
  const [preview, setPreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [parent, enableAnimations] = useAutoAnimate();
  const BannerCollectionRef = collection(db, 'banners');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    try {
      const querySnapshot = await getDocs(BannerCollectionRef);
      const banners = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      setBannerList(banners);
      console.log(banners);
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id, imageUrl) => {
    if (!id) {
      return toast({ title: "Error", description: "Banner ID not found for deletion." });
    }
    try {
      // 1. Delete the banner document from Firestore
      const bannerDoc = doc(db, "banners", id);
      await deleteDoc(bannerDoc);

      // 2. Delete the image from Firebase Storage
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }

      toast({ title: "Banner Deleted", description: "Banner and its image have been deleted successfully." });
      getBanners(); // Refresh the banner list after deletion
    } catch (error) {
      console.error("Error removing document or image: ", error);
      toast({ title: "Error", description: "Failed to delete banner or image." });
    }
  };


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { banner_img: null, name: "" },
  });

  const uploadFile = async (values) => {
    if (!imageUpload) {
      return toast({
        title: "Image Upload Error",
        description: "Please upload an image.",
      });
    }
    const imageRef = ref(storage, `banners/${imageUpload.name}`);
    try {
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);
      await addBanner(values, url);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the image.",
      });
    }
  };

  const addBanner = async (values, url) => {
    const banner = { banner_url: url, name: values.name };
    await addDoc(BannerCollectionRef, banner);
    setBannerList((prev) => [...prev, banner]);
    form.reset();
    setPreview(null);
    setShowForm(false);
    toast({ title: "Banner Added", description: "Banner has been added successfully." });
  };

  const onSubmit = async (values) => {
    await uploadFile(values);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) {
      setPreview(URL.createObjectURL(file));
      form.setValue("banner_img", file);
      setImageUpload(file);
    } else {
      toast({
        title: "Image Size Error",
        description: "Image size exceeds 2MB. Please select a smaller file.",
      });
    }
  };

  const handleDelete = (index) => {
    setBannerList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="p-4 min-h-screen">
      <div className="admin-banner-page max-w-[900px] mx-auto p-10 my-10 bg-white shadow-lg rounded-lg " ref={parent}>
        <div className="flex justify-between items-center my-4 flex-col sm:flex-row">
          <h1 className="text-2xl font-bold mb-4">Manage Banners</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close Form' : 'Add Banner'}
          </Button>
        </div>

        {showForm && (
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" >
              <div className={classNames("border-dashed border-2 border-gray-400 p-8 flex items-center justify-center cursor-pointer w-[80%] sm:w-[60%] mx-auto",
                {
                  "hidden": preview,
                })} onClick={() => document.getElementById('file-input').click()}>
                <span className="text-gray-500 text-lg">+ Upload Banner Image</span>
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
                    <Button onClick={() => setPreview(null)} className="ml-2" variant="destructive">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Banner name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </Form>
        )}

        <div className="banner-list mt-8">
          <h2 className="text-xl font-semibold">Existing Banners</h2>
          <ul>
            {loading ? (
              <div className="flex justify-center items-center h-48" >
                <Loader className="animate-spin mx-2" /> Loading...
              </div>
            ) : (

              bannerList.map((banner, index) => (
                <li key={index} className="flex justify-between items-center border-b py-2">
                  <img src={banner.banner_url} alt="Banner" className="w-32 h-auto rounded" />
                  <p>{banner.name}</p>
                  <div className="flex gap-2 flex-col p-1 sm:flex-row">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Eye size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Banner Preview</DialogTitle>
                          <DialogDescription>
                            <p>{banner.name}</p>
                            <img src={banner.banner_url} alt="Banner" className="w-full" />
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex items-center"
                        >
                          <Trash2 className="" />
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
                              onClick={() => deleteBanner(banner.id, banner.banner_url)}
                            >
                              Confirm Delete
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                </li>
              )))}
            {!loading && bannerList.length === 0 && (
              <li className="text-gray-500 text-sm mt-2 text-center">No banners found.</li>
            )}
          </ul>
        </div >
      </div >
    </section>
  );
}
