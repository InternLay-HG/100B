import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Ifilters {
    year?: string
    branch?: string
    title?: {}
}

class PollService {
    async create(data: any, userId: number) {
        try {
            if (data.options.length > 4)
                throw new Error('Max 4 options allowed');
            let response;
            if (!data.closesAt) {
                const closesAt = new Date();
                closesAt.setHours(closesAt.getHours() + 24);
                response = await prisma.poll.create({
                    data: { ...data, userId, closesAt },
                    include: { votes: true }
                })
            } else {
                response = await prisma.poll.create({
                    data: { ...data, userId },
                    include: { votes: true }
                })
            }
            const poll =  await this.getPoll(String(response.id));
            return poll;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async remove(pollId: string, userId: number) {
        try {
            const pollIdInt = parseInt(pollId);
            const poll = await prisma.poll.findUnique({
                where: { id: pollIdInt },
            });
            if (!poll)
                throw new Error("Poll not found");
            if (poll.userId != userId)
                throw new Error("Unauthorized action");
            await prisma.poll.delete({
                where: { id: pollIdInt },
            });
            return true;
        } catch (error) {
            console.error('Something went wrong in the service layer');
            throw error;
        }
    }

    async closePoll(pollId: string) {
        try {
            const closesAt = new Date();
            await prisma.poll.update({
                where: {
                    id: parseInt(pollId)
                },
                data: {
                    closesAt
                }
            })
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async extendPoll(pollId: string, closesAt: Date) {
        try {
            await prisma.poll.update({
                where: {
                    id: parseInt(pollId)
                },
                data: {
                    closesAt
                }
            })
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async getPoll(pollId: string) {
        try {
            const poll = await prisma.poll.findFirst({
                where: {
                    id: parseInt(pollId)
                },
                include: { votes: true }
            });

            if (!poll) return null;

            const voteCounts = poll.options.reduce((acc: { [key: string]: number }, option: string) => {
                acc[option] = 0;
                return acc;
            }, {});

            poll.votes.forEach((vote: any) => {
                if (voteCounts[vote.option] !== undefined) {
                    voteCounts[vote.option]++;
                }
            });

            return {
                ...poll,
                voteCounts,
                votes: poll.votes || []
            };
        } catch (error) {
            console.log('Something went wrong in the service layer', error);
            throw error;
        }
    }

    async getPolls(pageNo: string, ascending: string) {
        if (!ascending) ascending = 'false';
        const polls = await prisma.poll.findMany({
            skip: (parseInt(pageNo) - 1) * 4,
            take: 10,
            include: { votes: true },
        });
        return polls.map((poll) => ({
            ...poll,
            voteCounts: poll.votes.reduce((acc: { [key: string]: number }, vote) => {
                acc[vote.option] = (acc[vote.option] || 0) + 1;
                return acc;
            }, {}),
            votes: poll.votes.map((vote) => ({
                id: vote.id,
                option: vote.option,
                userId: vote.userId
            })),
        }));
    }

    async getPollsByFilters(pageNo: string, ascending: string, searchTitle?: string, year?: string, branch?: string) {
        try {
            if (!ascending) ascending = 'false';
            const filters: Ifilters = {
                title: { contains: searchTitle, mode: 'insensitive' },
            };
            if (year) filters.year = year;
            if (branch) filters.branch = branch;
            const polls = await prisma.poll.findMany({
                skip: (parseInt(pageNo) - 1) * 8,
                take: 8,
                where: filters,
                orderBy: {
                    createdAt: ascending == 'true' ? 'asc' : 'desc'
                },
                include: { votes: true }
            })
            return polls.map((poll) => ({
                ...poll,
                voteCounts: poll.votes.reduce((acc: { [key: string]: number }, vote) => {
                    acc[vote.option] = (acc[vote.option] || 0) + 1;
                    return acc;
                }, {}),
                votes: poll.votes.map((vote) => ({
                    id: vote.id,
                    option: vote.option,
                    userId: vote.userId
                })),
            }));
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }
}

export default PollService;