import nodemailer from "nodemailer";
import config from "../config";
import axios from "axios";

const API_KEY = config.sms.infobipKey;
const BASE_URL = `${config.sms.infobipBaseUrl}/sms/2/text/advanced`;

export const sendSMS = async (to: string, message: string) => {
  const config = {
    headers: {
      Authorization: `App ${API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const data = JSON.stringify({
    messages: [
      {
        destinations: [{ messageId: Date.now().toString(), to }],
        text: message,
        from: "InfoSMS",
      },
    ],
  });

  try {
    const response = await axios.post(BASE_URL, data, config);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.error(JSON.stringify(error));
  }
};

// sendSMS("2348064668635", "Hello, world!");
