import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowDownToLine, Forward } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import INote from "@/models/NoteModel";
import { debounce } from "lodash";

const Notes = () => {
  const axiosPrivate = useAxiosPrivate();

  const [notes, setNotes] = useState<INote[]>([]);
  const [year, setYear] = useState<string>('Year');
  const [branch, setBranch] = useState<string>('Branch');
  const [subject, setSubject] = useState<string>('Subject');
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [noteTitle, setNoteTitle] = useState("");
  const [noteYear, setNoteYear] = useState("");
  const [noteBranch, setNoteBranch] = useState("");
  const [noteSubject, setNoteSubject] = useState("");
  const [noteFile, setNoteFile] = useState<File | null>(null);
  const [createNoteButtonLoading, setCreateNoteButtonLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    const getAllNotes = async () => {
      try {
        const response = await axiosPrivate.get(`/api/v1/filter/notes`, {
          params: {
            pageNo: pageNo,
            branch: branch == "Branch" ? "" : branch,
            year: year == "Year" ? "" : year,
            searchTitle: searchQuery
          }
        });
        setNotes(response.data.notes)
      } catch (error: any) {
        console.log(error);
        if (error.response.data.message)
          toast.error(error.response.data.message);
        else
          toast.error('Failed to fetch notes');
      }
    }
    const debounceGetAllNotes = debounce(getAllNotes, 300);
    debounceGetAllNotes();

    return () => { debounceGetAllNotes.cancel() };
  }, [axiosPrivate, branch, searchQuery, year, pageNo])

  const handleCreateNote = async () => {
    try {
      if (!noteTitle || !noteBranch || !noteYear || !noteFile) {
        toast.error('Fill all the fields');
      } else {
        setCreateNoteButtonLoading(true);
        const formData = new FormData();
        formData.append('file', noteFile);
        formData.append("title", noteTitle);
        formData.append("year", noteYear);
        formData.append("branch", noteBranch);
        formData.append("subject", noteSubject);
        const response = await axiosPrivate.post('/api/v1/upload/note', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        setNoteTitle("");
        setNoteBranch("");
        setNoteYear("");
        setNoteSubject("");
        setNoteFile(null);
        setNotes((prev: any) => [...prev, response.data.response]);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message)
        toast.error(error.response.data.message);
      else
        toast.error('Failed to upload notes');
    } finally {
      setCreateNoteButtonLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-[calc(100%-4rem)] flex flex-col">
      <div className="mx-auto px-4 w-full h-full flex-1 flex flex-col">
        <div className="flex w-full sticky top-0 z-50 pt-8 pb-5 px-10 bg-white">
          <p className="text-2xl font-bold text-orange-500">Agora</p>
          <div className="flex ml-auto">
            <Input
              type="text"
              placeholder="Search"
              className="w-[300px] mx-10 bg-white/40 text-black placeholder-black hover:placeholder-white outline-none focus-within:outline-none focus:outline-none border-orange-500/60 hover:text-white hover:bg-orange-500/60 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="gap-4 flex">
              <div>
                <Select
                  value={year}
                  onValueChange={setYear}
                >
                  <SelectTrigger className="bg-white/40 border-orange-500/60 hover:text-white hover:bg-orange-500/60">
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
                  <SelectTrigger className="bg-white/40 border-orange-500/60 hover:text-white hover:bg-orange-500/60">
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
                  <SelectTrigger className="bg-white/40 border-orange-500/60 hover:text-white hover:bg-orange-500/60">
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
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-orange-500/60 hover:bg-orange-500/60 hover:text-white text-gray-700">Create note</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-orange-500">Create Note</DialogTitle>
                      <DialogDescription>
                        Only pdf and images can be uploaded
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                          placeholder="Note title"
                          className="col-span-4 border-orange-500/60"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                          type="file"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0])
                              setNoteFile(e.target.files[0])
                          }}
                          placeholder="Select file to upload"
                          className="col-span-4 border-orange-500/60 cursor-pointer hover:bg-orange-500/60 hover:text-white"
                        />
                      </div>
                      <Select
                        value={noteYear}
                        onValueChange={setNoteYear}
                      >
                        <SelectTrigger className="bg-white/40 border-orange-500/60 hover:text-white hover:bg-orange-500/60">
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
                      <Select
                        value={noteBranch}
                        onValueChange={setNoteBranch}
                      >
                        <SelectTrigger className="bg-white/40 border-orange-500/60 hover:text-white hover:bg-orange-500/60">
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
                      <Select
                        value={noteSubject}
                        onValueChange={setNoteSubject}
                      >
                        <SelectTrigger className="bg-white/40 border-orange-500/60 hover:text-white hover:bg-orange-500/60">
                          <SelectValue placeholder="Subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 border-orange-500/60 text-black">
                          <SelectItem value="Subject">Subject</SelectItem>
                          <SelectItem value="Analog">Analog</SelectItem>
                          <SelectItem value="Python Programming">Python Programming</SelectItem>
                          <SelectItem value="Electrical">Electrical</SelectItem>
                          <SelectItem value="HS">HS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      {createNoteButtonLoading ? (
                        <Button
                          disabled
                          type="submit"
                          className="border border-orange-500/30 bg-white text-black hover:bg-orange-500/60 hover:text-white"
                        >
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Create
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="border border-orange-500/30 bg-white text-black hover:bg-orange-500/60 hover:text-white"
                          onClick={handleCreateNote}
                        >
                          Create
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-5 mx-8 mt-5 pt-5 overflow-y-auto">
            {notes.length > 0 ? (
              notes.map((note) => (
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
              <div className="col-span-full flex flex-col row-span-full justify-center items-center py-16">
                <p className="text-black text-center px-4 py-8 rounded-lg border border-orange-500 bg-orange-500/40 backdrop-blur-sm mb-5">
                  No notes found
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mb-10 mt-auto">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="hover:bg-orange-400 cursor-pointer"
                  onClick={() => setPageNo((prev) => prev - 1 < 1 ? 1 : prev - 1)}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  className="hover:bg-orange-400 cursor-pointer"
                  onClick={() => setPageNo(1)}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  className="hover:bg-orange-400 cursor-pointer"
                  onClick={() => setPageNo(2)}
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className="hover:bg-orange-400 cursor-pointer"
                  onClick={() => setPageNo((prev) => prev + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div >
  )
}

export default Notes