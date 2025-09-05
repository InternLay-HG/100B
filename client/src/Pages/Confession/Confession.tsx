import { useEffect, useState } from "react";
import { CirclePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import IConfession from "@/models/ConfessionModel";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import ConfessionCard from "@/components/Confession";

const Confession = () => {
  const [confessions, setConfessions] = useState<IConfession[]>([]);
  const [loading, setLoading] = useState(false);
  const [confessionTitle, setConfessionTitle] = useState("");
  const [confessionDetails, setConfessionDetails] = useState("");
  const [confessButtonLoading, setConfessButtonLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getAllConfessions = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get('/api/v1/confessions');
        setConfessions(response.data.response);
      } catch (error: any) {
        if (error.response.message)
          toast.error(error.response.message);
        else
          toast.error("Failed to fetch confessions");
      } finally {
        setLoading(false);
      }
    }
    getAllConfessions();
  }, [axiosPrivate])

  const handleConfessionCreation = async () => {
    try {
      if (!confessionTitle || !confessionDetails) {
        toast.error("Fill out all fields");
        return;
      }
      setConfessButtonLoading(true);
      const response = await axiosPrivate.post('/api/v1/confession', {
        title: confessionTitle,
        content: confessionDetails
      })
      setConfessions((prev) => [...prev, response.data.response]);
      setConfessionTitle("");
      setConfessionDetails("");
    } catch (error: any) {
      if (error.response.message)
        toast.error(error.response.message);
      else
        toast.error("Failed to create confession");
    } finally {
      setConfessButtonLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-[calc(100%-4rem)] flex flex-col">
      <div className="mx-auto px-4 w-full bg-white sticky top-0 z-50  flex flex-col">
        <div className="flex w-full pt-8 pb-5 px-10">
          <p className="text-2xl font-bold text-orange-500">Agora</p>
          <Dialog>
            <DialogTrigger asChild>
              <div className="ml-auto p-2 rounded-full hover:bg-orange-400 cursor-pointer">
                <CirclePlus className="h-7 w-7" />
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-orange-400">Confess your sins</DialogTitle>
                <DialogDescription>
                  You identity will remain anonymous and cannot be seen by anyone.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    value={confessionTitle}
                    onChange={(e) => setConfessionTitle(e.target.value)}
                    placeholder="title"
                    className="col-span-5"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    value={confessionDetails}
                    onChange={(e) => setConfessionDetails(e.target.value)}
                    placeholder="confession"
                    className="col-span-5"
                  />
                </div>
              </div>
              <DialogFooter>
                {confessButtonLoading ? (
                  <Button
                    type="submit"
                    disabled
                    className=" bg-orange-500 text-white"
                  >
                    <Loader2 className="animate-spin" />
                    Post
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    onClick={handleConfessionCreation}
                    className="border border-orange-400 bg-white text-black hover:bg-orange-400 hover:text-white cursor-pointer"
                  >
                    Post
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mx-10">
          {confessions.length > 0 ? (
            confessions.map((confession) => (
              <div key={confession.id}>
                <ConfessionCard confession={confession} />
              </div>
            ))
          ) : (
            <div className="h-full w-full py-16 flex justify-center">
              <div className="py-8 px-10 w-fit h-fit ml-auto border border-orange-500 rounded-md bg-orange-400/50">
                No confession found
              </div>
            </div>
          )}
        </div>
      </div>
    </div >
  )
}

export default Confession;