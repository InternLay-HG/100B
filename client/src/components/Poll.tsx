import React, { useEffect, useState } from 'react';
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "sonner";
import PollModel from "@/models/PollModel";
import { useSelector } from 'react-redux';

interface PollComponentProps {
  poll: PollModel;
}

const Poll: React.FC<PollComponentProps> = ({ poll }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [localVoteCounts, setLocalVoteCounts] = useState(poll.voteCounts);
  const axiosPrivate = useAxiosPrivate();

  const userId = useSelector((state: any) => state.auth.userData.id);

  useEffect(() => {
    const checkHasVotes = () => {
      poll.votes.map((vote: any) => vote.userId == userId ? setHasVoted(true) : null)
    }
    checkHasVotes();
  }, [userId, poll])

  const handleVote = async (option: string) => {
    if (!hasVoted && !isPollClosed()) {
      try {
        await axiosPrivate.post(`/api/v1/vote`, {
          option: option,
          pollId: poll.id
        });
        setSelectedOption(option);
        setHasVoted(true);
        setLocalVoteCounts(prev => ({
          ...prev,
          [option]: (prev[option] || 0) + 1
        }));
        toast.success("Vote recorded successfully!");
      } catch (error: any) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to record vote");
        }
      }
    }
  };

  const isPollClosed = () => {
    return new Date(poll.closesAt) < new Date();
  };

  const getTotalVotes = () => {
    return Object.values(localVoteCounts).reduce((sum, count) => sum + count, 0);
  };

  const getPercentage = (option: string) => {
    const votes = localVoteCounts[option] || 0;
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div className="w-full max-w-2xl min-w-[300px] mx-auto my-4 rounded-lg bg-white/95 p-6 border border-orange-500/40">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-orange-500">{poll.title}</h2>
        <div className="mt-2 text-sm text-gray-600">
          {poll.branch && <p className="font-medium">Branch: {poll.branch}</p>}
          {poll.year && <p>Year: {poll.year}</p>}
        </div>
      </div>

      <div className="space-y-3">
        {poll.options.map((option) => (
          <button
            key={option}
            onClick={() => handleVote(option)}
            disabled={hasVoted || isPollClosed()}
            className="w-full"
          >
            <div className="relative">
              <div className={`
                p-4 rounded-lg border relative overflow-hidden transition-all duration-300
                ${(hasVoted || isPollClosed()) ? 'cursor-default border-orange-500/40'
                  : 'cursor-pointer border-orange-500/30 hover:border-orange-500/60 hover:bg-orange-500/50'
                }
              `}>
                {(hasVoted || isPollClosed()) && (
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-orange-100"
                    style={{
                      width: `${getPercentage(option)}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                )}
                <div className="relative flex justify-between items-center">
                  <span className="font-medium text-gray-800">{option}</span>
                  {(hasVoted || isPollClosed()) && (
                    <span className="text-sm text-gray-600">
                      {getPercentage(option)}% ({localVoteCounts[option] || 0} votes)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {isPollClosed() ? (
          <p>Poll closed on {formatDateTime(poll.closesAt)}</p>
        ) : (
          <p>Closes on {formatDateTime(poll.closesAt)}</p>
        )}
        <p className="mt-1">Total votes: {getTotalVotes()}</p>
      </div>
    </div>
  );
};

export default Poll;