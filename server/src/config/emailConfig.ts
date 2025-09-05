import nodemailer from "nodemailer";
import config from "../config/serverConfig";

const { EMAIL, EMAIL_PASS } = config;

const sender = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: EMAIL,
        pass: EMAIL_PASS
    }
})

export default sender;