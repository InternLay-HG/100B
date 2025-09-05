import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import IConfession from "@/models/ConfessionModel";
import INote from "@/models/NoteModel";
import ConfessionCard from "@/components/Confession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownToLine, Forward } from "lucide-react";

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const { userData } = useSelector((state: any) => state.auth);

  const [latestConfessions, setLatestConfessions] = useState<IConfession[]>([]);
  const [latestNotes, setLatestNotes] = useState<INote[]>([]);

  useEffect(() => {
    const getLatestConfessions = async () => {
      try {
        const response = await axiosPrivate.get('/api/v1/confessions?limit=4');
        setLatestConfessions(response.data.response);
      } catch (error: any) {
        toast.error("Failed to fetch new confessions");
      }
    };

    const getLatestNotes = async () => {
      try {
        const response = await axiosPrivate.get('/api/v1/filter/notes?limit=4');
        setLatestNotes(response.data.notes);
      } catch (error: any) {
        toast.error("Failed to fetch new notes");
      }
    };

    getLatestConfessions();
    getLatestNotes();
  }, [axiosPrivate]);

  return (
    <div className="min-h-screen w-[calc(100%-4rem)] flex flex-col">
      <div className="mx-auto px-4 w-full bg-white">
        <div className="flex w-full pt-8 pb-5 px-10">
          <p className="text-2xl font-bold text-orange-500">Agora</p>
        </div>
        <div className="px-10">
          <h1 className="text-3xl font-bold text-gray-800">Hey, {userData?.username || 'User'}!</h1>
          <p className="text-gray-500 mt-2">Welcome back to Agora. Here's what's new.</p>
        </div>

        <div className="px-10 mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">New Confessions</h2>
            <Link to="/confessions" className="text-orange-500 hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {latestConfessions.length > 0 ? (
              latestConfessions.map((confession) => (
                <div key={confession.id}>
                  <ConfessionCard confession={confession} />
                </div>
              ))
            ) : (
              <div className="h-full w-full py-8 flex justify-center items-center col-span-full">
                <div className="py-4 px-6 w-fit h-fit border border-orange-500 rounded-md bg-orange-400/50">
                  No new confessions
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-10 mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">New Notes</h2>
            <Link to="/notes" className="text-orange-500 hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-5 mt-4">
            {latestNotes.length > 0 ? (
              latestNotes.map((note) => (
                <Card
                  key={note.id}
                  className="bg-white/40 mb-5 border-orange-500 hover:bg-orange-500/10 hover:-translate-y-1 cursor-pointer transition-all duration-500 backdrop-blur-lg flex flex-col"
                >
                  <CardHeader className="pb-2 space-y-1">
                    <div className="flex">
                      <div className="flex flex-col space-y-1">
                        <CardTitle className="text-sm font-bold text-black line-clamp-2">
                          {note.title}
                        </CardTitle>
                        <div className="flex items-center space-x-1">
                          <span className="relative inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full
                          before:absolute before:inset-0 before:bg-gradient-to-r before:from-orange-500/10 before:to-orange-800/10 before:rounded-full
                          border border-orange-500/30 hover:border-orange-500/50 transition-colors duration-300">
                            <span className="relative z-10 bg-gradient-to-r from-orange-200 to-orange-400 bg-clip-text text-black">
                              {note.subject}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="flex ml-auto">
                        <div
                          className="p-2 rounded-full mr-2 hover:bg-orange-500 h-fit"
                          onClick={() => {
                            navigator.clipboard.writeText(note.s3Url)
                            toast.success("Link copied to clipboard")
                          }}
                        >
                          <Forward className="h-5 w-5" />
                        </div>
                        <div
                          className="p-2 rounded-full hover:bg-orange-500 h-fit"
                          onClick={() => window.open(note.s3Url, '_blank')}
                        >
                          <ArrowDownToLine className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1 pb-2 flex-grow">
                    <div className="relative h-[160px] w-full overflow-hidden rounded-lg">
                      <img
                        src="/public/pdf.png"
                        alt={note.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-xs text-black font-medium flex items-center space-x-1">
                      <span className="inline-block w-1 h-1 bg-orange-400 rounded-full"></span>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="h-full w-full py-8 flex justify-center items-center col-span-full">
              <div className="py-4 px-6 w-fit h-fit border border-orange-500 rounded-md bg-orange-400/50">
                  No new notes
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;