import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Poll from "@/components/Poll";
import IPoll from "@/models/PollModel";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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
import { debounce } from "lodash";

const Polls = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [year, setYear] = useState("Year");
  const [branch, setBranch] = useState("Branch");
  const [polls, setPolls] = useState<IPoll[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [pollTitle, setPollTitle] = useState("");
  const [pollYear, setPollYear] = useState("");
  const [pollBranch, setPollBranch] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [optionCount, setOptionCount] = useState(2);
  const [pageNo, setPageNo] = useState(1);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getAllPoles = async () => {
      try {
        const response = await axiosPrivate.get('/api/v1/filter/polls', {
          params: {
            pageNo: pageNo,
            branch: branch === "Branch" ? "" : branch,
            year: year === "Year" ? "" : year,
            searchTitle: searchQuery
          }
        });
        setPolls(response.data.polls);
      } catch (error: any) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to fetch polls");
        }
      }
    };

    const debouncedGetAllPoles = debounce(getAllPoles, 300);
    debouncedGetAllPoles();
    
    return () => { debouncedGetAllPoles.cancel() };
  }, [axiosPrivate, pageNo, branch, year, searchQuery]);

  useEffect(() => {
    const clearInputs = () => {
      setPollTitle("");
      setPollYear("");
      setPollBranch("");
      setOptions(["", "", "", ""]);
      setOptionCount(2);
    }
    clearInputs();
  }, [isDialogOpen])

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (optionCount < 4) {
      setOptionCount(optionCount + 1);
    }
  };

  const handleRemoveOption = () => {
    if (optionCount > 2) {
      setOptionCount(optionCount - 1);
      const newOptions = [...options];
      newOptions[optionCount - 1] = "";
      setOptions(newOptions);
    }
  };

  const handleCreatePoll = async () => {
    const filteredOptions = options.slice(0, optionCount).filter(opt => opt.trim() !== "");

    if (filteredOptions.length < 2) {
      toast.error("At least 2 options are required");
      return;
    }

    if (filteredOptions.length !== optionCount) {
      toast.error("All added options must have values");
      return;
    }

    try {
      const response = await axiosPrivate.post('/api/v1/poll', {
        title: pollTitle.trim(),
        year: pollYear === "Year" ? null : pollYear,
        branch: pollBranch === "Branch" ? null : pollBranch,
        options: filteredOptions,
        closesAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
      console.log(response.data.response);
      setPolls(prev => prev ? [response.data.response, ...prev] : [response.data.response]);
      setPollTitle("");
      setPollYear("");
      setPollBranch("");
      setOptions(["", "", "", ""]);
      setOptionCount(2);
      setIsDialogOpen(false);

      toast.success("Poll created successfully!");
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create poll");
      }
    }
  };

  return (
    <div className="min-h-screen w-[calc(100%-4rem)] flex flex-col">
      <div className="mx-auto px-4 w-full bg-white sticky top-0 z-50  flex flex-col">
        <div className="flex w-full pt-8 pb-5 px-10">
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
            </div>
            <div className="ml-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-orange-500/60 hover:bg-orange-500/60 hover:text-white text-gray-700"
                  >
                    Create Poll
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-orange-500">Create Poll</DialogTitle>
                    <DialogDescription>
                      Maximum of 4 options are allowed
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Input
                        placeholder="Poll Title"
                        value={pollTitle}
                        onChange={(e) => setPollTitle(e.target.value)}
                        className="border-orange-500/30 focus:border-orange-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={pollYear} onValueChange={setPollYear}>
                        <SelectTrigger className="border-orange-500/30 placeholder-text-gray">
                          <SelectValue placeholder="Year (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Year">Year</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={pollBranch} onValueChange={setPollBranch}>
                        <SelectTrigger className="border-orange-500/30">
                          <SelectValue placeholder="Branch (optional)" className="placeholder-gray-500" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Branch">Branch</SelectItem>
                          <SelectItem value="CSE DS&AI">CSE DS&AI</SelectItem>
                          <SelectItem value="CSE">CSE</SelectItem>
                          <SelectItem value="ECE">ECE</SelectItem>
                          <SelectItem value="ECE IOT">ECE IOT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      {Array.from({ length: optionCount }).map((_, index) => (
                        <Input
                          key={index}
                          placeholder={`Option ${index + 1}`}
                          value={options[index]}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="border-orange-500/30 focus:border-orange-500"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveOption}
                        disabled={optionCount <= 2}
                        className="border-orange-500/30 hover:bg-orange-500/60 hover:text-white"
                      >
                        Remove Option
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddOption}
                        disabled={optionCount >= 4}
                        className="border-orange-500/30 hover:bg-orange-500/60 hover:text-white"
                      >
                        Add Option
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={handleCreatePoll}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Create Poll
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-x-10 gap-y-5 mx-8 py-5 overflow-y-auto">
        {polls?.length > 0 ? (polls.map((poll) => (
          <Poll key={poll.id} poll={poll} />
        ))) : (
          <div className="col-span-full flex flex-col py-16 row-span-full justify-center items-center">
            <p className="text-black text-center px-4 py-8 rounded-lg border border-orange-500 bg-orange-500/40 backdrop-blur-sm mb-5">
              No Polls found
            </p>
          </div>
        )}
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
  );
}

export default Polls;