import { Request, Response } from "express";
import VoteService from "../services/voteService";
import statusCode from "../utils/statuscode";

const voteService = new VoteService();

const vote = async (req: Request, res: Response) => {
  try {
    const response = await voteService.giveVote(req.body.option, req.user.id, req.body.pollId);
    return res.status(statusCode.SUCCESS).json({
      response
    })
  } catch (error) {
    return res.status(statusCode.INTERNAL_ERROR).json({
      message: "Failed to vote",
      error: error
    })
  }
}

export default {
  vote
}