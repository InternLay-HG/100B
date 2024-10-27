import dotenv from "dotenv";

dotenv.config();

export default {
    PORT: process.env.PORT,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
}