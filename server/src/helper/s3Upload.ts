import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import config from "../config/serverConfig";
import { v4 as uuid } from "uuid";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = config;

const s3Client = new S3Client({
    region: "ap-southeast-2",
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
    },
});

const uploadFile = async (file: any) => {
    const fileContent = await file.buffer;

    const uploadParams = {
        Bucket: AWS_BUCKET_NAME!,
        Key: `${uuid()}-${file.originalname}`,
        Body: fileContent,
    };

    try {
        const upload = new Upload({
            client: s3Client,
            params: uploadParams,
        });
        const data = await upload.done();
        return data?.Location;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

export default uploadFile;
