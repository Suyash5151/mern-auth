import { transporter, sender } from "./nodemailerConfig.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";
import {PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email, // Just a plain string, not an array
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    });

    console.log("Email sent successfully", info.messageId);
  } catch (error) {
    console.error(`Error sending message`, error);
    throw new Error(`Error sending message: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try{
    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email, // Just a plain string, not an array
      subject: "Welcome",
      html: WELCOME_EMAIL_TEMPLATE.replace("{userName}", name),
    });
  }

    catch (error) {
    console.error(`Error sending message`, error);
    throw new Error(`Error sending message: ${error}`);
  }

  };


  export const sendPasswordResetEmail = async (email,link)=>{
    try{
      const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email, // Just a plain string, not an array
      subject: "Welcome",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", link),
    });
  
    }
    catch(error){
      console.error(`Error sending message`, error);
      throw new Error(`Error sending message: ${error}`);

    }
  };








