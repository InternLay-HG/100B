import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface INote {
  id: number
  userId: number
  createdAt: Date
  updatedAt: Date
  title: string
  year: string
  subject: string
  branch: string
  upvotes: number
  downvotes: number
  isReported: boolean
}

const Notes = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [year, setYear] = useState<string>('Year');
  const [branch, setBranch] = useState<string>('Branch');
  const [subject, setSubject] = useState<string>('Subject');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getAllNotes = async () => {
      try {
        const response = await axiosPrivate.get(`/api/v1/notes`);
        setNotes(response.data.notes)
      } catch (error: any) {
        console.log(error);
        if (error.response.data.message)
          toast.error(error.response.data.message);
        else
          toast.error('Failed to fetch notes');
      }
    }
    getAllNotes();
  }, [axiosPrivate])

  console.log(notes);

  const filteredNotes = useMemo(() => {
    let filtered = notes;

    if (year !== 'Year') filtered = filtered.filter((note) => note.year === year);
    if (branch !== 'Branch') filtered = filtered.filter((note) => note.branch === branch);
    if (subject !== 'Subject') filtered = filtered.filter((note) => note.subject === subject);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((note) => note.title.toLowerCase().includes(query));
    }

    return filtered;
  }, [notes, branch, subject, year, searchQuery]);

  return (
    <div className="min-h-screen w-screen">
      <div className="mx-auto px-4 w-full">
        <div className="flex w-full sticky top-0 z-50 pt-8 pb-5 bg-white">
          <p className="text-2xl font-bold text-orange-500">Agora</p>
          <div className="flex ml-auto">
            <Input
              type="text"
              placeholder="Search"
              className="w-[300px] mx-10 bg-white/40 text-black placeholder-black hover:placeholder-white outline-none focus-within:outline-none focus:outline-none border-orange-500/30 hover:text-white hover:bg-orange-500/60 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="gap-4 flex">
              <div>
                <Select
                  value={year}
                  onValueChange={setYear}
                >
                  <SelectTrigger className="bg-white/40 border-orange-500/30 hover:text-white hover:bg-orange-500/60">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 border-orange-500/30 text-black">
                    <SelectItem value="Year">Year</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={branch}
                  onValueChange={setBranch}
                >
                  <SelectTrigger className="bg-white/40 border-orange-500/30 hover:text-white hover:bg-orange-500/60">
                    <SelectValue placeholder="Branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 border-orange-500/30 text-black">
                    <SelectItem value="Branch">Branch</SelectItem>
                    <SelectItem value="CSE DS&AI">CSE DS&AI</SelectItem>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="ECE IOT">ECE IOT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={subject}
                  onValueChange={setSubject}
                >
                  <SelectTrigger className="bg-white/40 border-orange-500/30 hover:text-white hover:bg-orange-500/60">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 border-orange-500/30 text-black">
                    <SelectItem value="Subject">Subject</SelectItem>
                    <SelectItem value="Analog">Analog</SelectItem>
                    <SelectItem value="Python Programming">Python Programming</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="HS">HS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-5 mx-8 mt-10 overflow-y-auto">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <Card key={note.id} className="bg-white/40 mb-5 border-orange-500 hover:bg-white/60 transition-all duration-500 backdrop-blur-lg flex flex-col">
                  <CardHeader className="pb-2 space-y-1">
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
              <div className="col-span-full flex flex-col row-span-full justify-center items-center py-16">
                <p className="text-black text-center px-4 py-8 rounded-lg border border-orange-500 bg-orange-500/40 backdrop-blur-sm mb-5">
                  No notes found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notes