
export interface Option {
    id: number;
    text: string;
    votes: number;
  }
  

  export interface Poll {
    id: number;
    question: string;
    options: Option[];
    isClosed: boolean;
    createdAt: string; 
    endDate?: string; 
    author?: string; 
  }
  
  
  export interface CreatePollPayload {
    question: string;
    options: string[]; 
    endDate?: string;
  }
  
 
  export interface UpdatePollPayload { 
    pollId: number;
    endDate?: string; 
    isClosed?: boolean; 
  }

  export interface ExtendPollPayload {
    pollId: number;
    endDate: string;
  }
  
  export interface ClosePollPayload {
    pollId: number;
    isClosed: boolean;
  }
  
  
  
  export interface VotePayload {
    pollId: number;
    optionId: number;
  }
  
  
  export interface PollState {
    polls: Poll[];
    loading: boolean;
    error: string | null;
    searchResults: Poll[]; 
  }
  
  export interface Result {
    id: number;
    text: string;
    votes: number;
  }
  