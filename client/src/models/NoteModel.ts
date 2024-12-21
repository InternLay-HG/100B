interface INote {
    id: number
    s3Url: string
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

export default INote;