import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume";
import { Request, Response } from "express";
import { Resend } from "resend";
import mongoose from "mongoose";

interface CustomRequest extends Request {
  userId?: string;
}
const resend = new Resend(process.env.RESEND_API_KEY);
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
  return token;
};
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (mobile && mobile.length !== 10) {
      return res.status(400).json({ message: "Mobile number must be 10 digits" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (mobile) {
      const existingMobile = await User.findOne({ mobile });
      if (existingMobile) {
        return res.status(400).json({ message: "Mobile number already registered" });
      }
    }
    const newUser = await User.create({
      name,
      email,
      mobile,
      password,
    });

    const token = generateToken(newUser._id.toString());
    newUser.password = undefined as any;

    return res.status(201).json({ message: "User created successfully", token, user: newUser });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString());
    user.password = undefined as any;

    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
export const getUserById = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }
    const user = await User.findById(userId).select(
      'name email mobile role plan planExpiresAt planRenewable unlockedTemplates downloadCount downloadLimit lastDownloadReset personalInfoLocked personalInfoEditCount firstDownloadedResumeId linkedinOptimizationCount linkedinPaid atsScore linkedinScore createdAt updatedAt'
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = undefined as any;
    return res.status(200).json({ user });
  } catch (error: any) {
    console.error("❌ Get user by ID error:", error);
    return res.status(400).json({ message: error.message });
  }
};


export const getUserResumes = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;
    console.log("🔍 userId from token:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const resumes = await Resume.find({
      userId: new mongoose.Types.ObjectId(userId),
      $or: [
        { adminCreated: { $ne: true } },
        { adminCreated: true, status: 'published' }
      ]
    })
      .select('title template updatedAt createdAt status adminCreated adminUploadedPdf personal_info professional_summary skills experience education projects additional_info accent_color public hasBeenDownloaded')
      .sort({ updatedAt: -1 });


    console.log("✅ Matched resumes:", resumes.length);

    return res.status(200).json({ resumes });
  } catch (error: any) {
    console.error("❌ getUserResumes error:", error.message);
    return res.status(400).json({ message: error.message });
  }
};
export const updateProfile = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { name, email, mobile } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    if (mobile && mobile.length !== 10) {
      return res.status(400).json({ message: "Mobile number must be 10 digits" });
    }

    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use by another account" });
    }

    if (mobile) {
      const existingMobile = await User.findOne({
        mobile,
        _id: { $ne: userId }
      });

      if (existingMobile) {
        return res.status(400).json({ message: "Mobile number already in use by another account" });
      }
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, mobile },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    updatedUser.password = undefined as any;

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const changePassword = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const isMatch = await bcrypt.compare(currentPassword, user.password || "");
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error: any) {
    console.error("Change password error:", error);
    return res.status(400).json({ message: error.message });
  }
};
export const deleteAccount = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }


    await Resume.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error: any) {
    console.error("Delete account error:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await resend.emails.send({
      from: "CareerBlueprint <info@careerblueprint.co.in>",
      to: email,
      subject: "Password Reset OTP - CareerBlueprint",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2c2a63; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi ${user.name},</p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password. Use the following OTP to verify your identity:
            </p>
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <h1 style="color: #2c2a63; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              This OTP will expire in <strong>10 minutes</strong>.
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If you didn't request this, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2026 CareerBlueprint. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({
      message: "OTP sent successfully to your email",
      email: email,
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    if (!user.otpExpire || user.otpExpire < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    return res.status(200).json({
      message: "OTP verified successfully",
      email: email,
    });
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Failed to verify OTP. Please try again." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otpExpire || user.otpExpire < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }


    user.password = newPassword;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Failed to reset password. Please try again." });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await resend.emails.send({
      from: "CareerBlueprint <info@careerblueprint.co.in>",
      to: email,
      subject: "Password Reset OTP - CareerBlueprint",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2c2a63; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi ${user.name},</p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password. Use the following OTP to verify your identity:
            </p>
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <h1 style="color: #2c2a63; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              This OTP will expire in <strong>10 minutes</strong>.
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If you didn't request this, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2026 CareerBlueprint. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({
      message: "New OTP sent successfully to your email",
    });
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ message: "Failed to resend OTP. Please try again." });
  }
};

export const updateMobile = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { mobile } = req.body;

    if (!mobile || mobile.length !== 10) {
      return res.status(400).json({ message: "Valid 10-digit mobile number required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { mobile },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Mobile number updated successfully",
      user
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const sendContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;


    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }


    console.log("ADMIN MAIL TO:", "info.careersblueprint@gmail.com");

    await resend.emails.send({
      from: "CareerBlueprint <info@careerblueprint.co.in>",
      to: "info.careersblueprint@gmail.com",
      replyTo: email,
      subject: `New Contact: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 30px 30px 20px 30px; border-bottom: 2px solid #2c2a63;">
                      <h1 style="margin: 0; color: #2c2a63; font-size: 24px; font-weight: 600;">
                        New Contact Message
                      </h1>
                      <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">
                        Received on ${new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px;">
                      
                      <!-- From Section -->
                      <div style="margin-bottom: 25px;">
                        <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">From</p>
                        <p style="margin: 0 0 5px 0; font-size: 18px; color: #111827; font-weight: 600;">${name}</p>
                        <p style="margin: 0; font-size: 15px;">
                          <a href="mailto:${email}" style="color: #2c2a63; text-decoration: none;">${email}</a>
                        </p>
                      </div>

                      <!-- Subject Section -->
                      <div style="margin-bottom: 25px;">
                        <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subject</p>
                        <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 500;">${subject}</p>
                      </div>

                      <!-- Message Section -->
                      <div style="margin-bottom: 30px;">
                        <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
                          <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                      </div>

                      <!-- Reply Button -->
                      <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 15px 0; font-size: 14px; color: #6b7280;">
                          Click below to reply directly to ${name}
                        </p>
                        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" 
                           style="display: inline-block; 
                                  background-color: #2c2a63; 
                                  color: #ffffff; 
                                  padding: 12px 32px; 
                                  text-decoration: none; 
                                  border-radius: 6px; 
                                  font-weight: 600; 
                                  font-size: 15px;">
                          Reply to ${name.split(' ')[0]}
                        </a>
                      </div>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                      <p style="margin: 0; font-size: 13px; color: #6b7280;">
                        CareerBlueprint Contact Form
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });


    await resend.emails.send({
      from: "CareerBlueprint <info@careerblueprint.co.in>",
      to: email,
      subject: "We received your message!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; border-bottom: 2px solid #2c2a63;">
                      <h1 style="margin: 0 0 10px 0; color: #2c2a63; font-size: 28px; font-weight: 600;">
                        Thank You!
                      </h1>
                      <p style="margin: 0; color: #6b7280; font-size: 15px;">
                        We've received your message
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      
                      <p style="margin: 0 0 20px 0; font-size: 16px; color: #111827;">
                        Hi <strong>${name}</strong>,
                      </p>

                      <p style="margin: 0 0 25px 0; font-size: 15px; color: #374151; line-height: 1.7;">
                        Thank you for contacting CareerBlueprint. Your message has been successfully delivered to our team, 
                        and we will respond within 24-48 hours.
                      </p>

                      <!-- Message Summary -->
                      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 25px 0;">
                        <p style="margin: 0 0 12px 0; font-size: 12px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                          Your Message Summary
                        </p>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #111827;">
                          <strong>Subject:</strong> ${subject}
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                          <strong>Message:</strong><br>
                          ${message.length > 120 ? message.substring(0, 120) + '...' : message}
                        </p>
                      </div>

                      <!-- Contact Info -->
                      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 20px; margin: 25px 0;">
                        <p style="margin: 0 0 12px 0; font-size: 14px; color: #166534; font-weight: 600;">
                          Need urgent help?
                        </p>
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #166534;">
                          Email: <a href="mailto:info.careersblueprint@gmail.com" style="color: #2c2a63; text-decoration: none; font-weight: 600;">info.careersblueprint@gmail.com</a>
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #166534;">
                          Phone: <a href="tel:+918124494755" style="color: #2c2a63; text-decoration: none; font-weight: 600;">+91 81244 94755</a>
                        </p>
                      </div>

                      <p style="margin: 25px 0 0 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
                        Best regards,<br>
                        <strong style="color: #2c2a63;">The CareerBlueprint Team</strong>
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #2c2a63; padding: 25px 30px; text-align: center;">
                      <p style="margin: 0 0 8px 0; font-size: 16px; color: #ffffff; font-weight: 600;">
                        CareerBlueprint
                      </p>
                      <p style="margin: 0 0 5px 0; font-size: 13px; color: rgba(255, 255, 255, 0.9);">
                        Chennai, Tamil Nadu, India
                      </p>
                      <p style="margin: 0; font-size: 13px;">
                        <a href="https://www.careerblueprint.co.in" style="color: #EDC9AF; text-decoration: none;">www.careerblueprint.co.in</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return res.status(200).json({
      message: "Message sent successfully! We'll get back to you soon.",
    });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      message: "Failed to send message. Please try again or email us at info.careersblueprint@gmail.com"
    });
  }
};

export const sendPaymentSuccessEmail = async (
  userEmail: string,
  userName: string,
  paymentDetails: {
    amount: number;
    plan: string;
    transactionId: string;
    paymentDate: Date;
    type: 'single-template' | 'pro-plan' | 'linkedin-optimization';
    templateName?: string;
  }
) => {
  try {
    const planBenefits = {
      'Trial': ['7 days access', '1 resume download', 'Basic templates'],
      'Basic': ['1 month access', '1 resume download', 'All templates', 'Email support'],
      'Advanced': ['3 months access', '3 resume downloads', 'All templates', 'Priority support', '3 personal info edits'],
      'Professional': ['1 year access', '5 resume downloads', 'All templates', 'Premium support', '5 personal info edits']
    };

    const benefits = planBenefits[paymentDetails.plan as keyof typeof planBenefits] || ['Full access to premium features'];

    await resend.emails.send({
      from: "CareerBlueprint <info@careerblueprint.co.in>",
      to: userEmail,
      subject: `Payment Successful - Welcome to ${paymentDetails.plan}! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                  
                  <!-- Success Header with Confetti -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #2c2a63 0%, #1f1d4a 100%); padding: 40px 30px; text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
                      <h1 style="margin: 0 0 10px 0; color: #EDC9AF; font-size: 32px; font-weight: 700;">
                        Payment Successful!
                      </h1>
                      <p style="margin: 0; color: rgba(237, 201, 175, 0.9); font-size: 16px;">
                        Welcome to ${paymentDetails.plan}
                      </p>
                    </td>
                  </tr>

                  <!-- Greeting -->
                  <tr>
                    <td style="padding: 30px 30px 20px 30px;">
                      <p style="margin: 0 0 20px 0; font-size: 18px; color: #111827;">
                        Hi <strong style="color: #2c2a63;">${userName}</strong>,
                      </p>
                      <p style="margin: 0 0 25px 0; font-size: 15px; color: #374151; line-height: 1.7;">
                        ${paymentDetails.type === 'single-template'
          ? `Thank you for unlocking <strong>${paymentDetails.templateName}</strong>! Your payment has been processed successfully.`
          : `Thank you for upgrading to <strong>${paymentDetails.plan}</strong>! Your payment has been processed successfully and your account has been upgraded.`
        }
                      </p>
                    </td>
                  </tr>

                  <!-- Payment Details -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <div style="background: linear-gradient(135deg, rgba(44, 42, 99, 0.05) 0%, rgba(237, 201, 175, 0.1) 100%); border: 2px solid #EDC9AF; border-radius: 10px; padding: 25px;">
                        <p style="margin: 0 0 20px 0; font-size: 14px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                          Payment Details
                        </p>
                        
                        <table width="100%" cellpadding="8" cellspacing="0">
                          <tr>
                            <td style="font-size: 14px; color: #6b7280; padding: 8px 0;">Amount Paid:</td>
                            <td style="font-size: 24px; color: #2c2a63; font-weight: 700; text-align: right; padding: 8px 0;">₹${paymentDetails.amount}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-top: 1px solid #e5e7eb;">Plan:</td>
                            <td style="font-size: 16px; color: #2c2a63; font-weight: 600; text-align: right; padding: 8px 0; border-top: 1px solid #e5e7eb;">${paymentDetails.plan}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-top: 1px solid #e5e7eb;">Transaction ID:</td>
                            <td style="font-size: 13px; color: #6b7280; font-family: 'Courier New', monospace; text-align: right; padding: 8px 0; border-top: 1px solid #e5e7eb;">${paymentDetails.transactionId}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-top: 1px solid #e5e7eb;">Date:</td>
                            <td style="font-size: 14px; color: #6b7280; text-align: right; padding: 8px 0; border-top: 1px solid #e5e7eb;">${new Date(paymentDetails.paymentDate).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>

                  <!-- Benefits Section -->
                  ${paymentDetails.type === 'pro-plan' ? `
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <div style="background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 10px; padding: 25px;">
                        <p style="margin: 0 0 18px 0; font-size: 16px; color: #166534; font-weight: 600;">
                          What's Included in Your Plan:
                        </p>
                        ${benefits.map(benefit => `
                          <div style="display: flex; align-items: start; margin-bottom: 12px;">
                            <span style="color: #22c55e; font-size: 18px; margin-right: 10px; flex-shrink: 0;">✓</span>
                            <span style="font-size: 14px; color: #166534; line-height: 1.5;">${benefit}</span>
                          </div>
                        `).join('')}
                      </div>
                    </td>
                  </tr>
                  ` : ''}

                  <!-- CTA Button -->
                  <tr>
                    <td style="padding: 0 30px 40px 30px; text-align: center;">
                      <p style="margin: 0 0 20px 0; font-size: 15px; color: #6b7280;">
                        Ready to create your perfect resume?
                      </p>
                      <a href="https://careersblueprint.netlify.app/" 
                         style="display: inline-block; 
                                background: linear-gradient(135deg, #2c2a63 0%, #1f1d4a 100%); 
                                color: #EDC9AF; 
                                padding: 14px 36px; 
                                text-decoration: none; 
                                border-radius: 8px; 
                                font-weight: 600; 
                                font-size: 16px;
                                box-shadow: 0 4px 12px rgba(44, 42, 99, 0.3);">
                        Go to Home →
                      </a>
                    </td>
                  </tr>

                  <!-- Support Info -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
                        <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">
                          Need help? We're here for you!
                        </p>
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #2c2a63;">
                          <strong>Email:</strong> <a href="mailto:info.careersblueprint@gmail.com" style="color: #2c2a63; text-decoration: none;">info.careersblueprint@gmail.com</a>
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #2c2a63;">
                          <strong>Phone:</strong> <a href="tel:+918124494755" style="color: #2c2a63; text-decoration: none;">+91 81244 94755</a>
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #2c2a63; padding: 25px 30px; text-align: center;">
                      <p style="margin: 0 0 8px 0; font-size: 16px; color: #EDC9AF; font-weight: 600;">
                        CareerBlueprint
                      </p>
                      <p style="margin: 0 0 5px 0; font-size: 13px; color: rgba(237, 201, 175, 0.8);">
                        Building Your Career, One Resume at a Time
                      </p>
                      <p style="margin: 0; font-size: 13px;">
                        <a href="https://careersblueprint.netlify.app/" style="color: #EDC9AF; text-decoration: none;">careersblueprint.netlify.app</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log(`✅ Payment success email sent to ${userEmail}`);
    return true;
  } catch (error: any) {
    console.error("❌ Failed to send payment success email:", error);
    return false;
  }
};

export const updateScores = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId;
    const { atsScore, linkedinScore } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const updateFields: Record<string, number> = {};

    if (atsScore !== undefined && !isNaN(Number(atsScore))) {
      updateFields.atsScore = Number(atsScore);
    }
    if (linkedinScore !== undefined && !isNaN(Number(linkedinScore))) {
      updateFields.linkedinScore = Number(linkedinScore);
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid scores provided" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Scores updated successfully",
      atsScore: (user as any).atsScore ?? null,
      linkedinScore: (user as any).linkedinScore ?? null,
    });
  } catch (error) {
    console.error("❌ updateScores error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};