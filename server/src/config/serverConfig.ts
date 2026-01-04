import dotenv from "dotenv";

dotenv.config();

export default {
    PORT: process.env.PORT,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    EMAIL: process.env.EMAIL,
    EMAIL_PASS: process.env.EMAIL_PASS
}