import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { User } from '../../models/userSchema.js';

const resetPasswordAction = {
  actionType: 'resource',
  handler: async (request, response, context) => {
    const { email } = request.payload;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    // Token generation logic
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Email setup and sending
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
      to: user.email,
      from: testAccount.user,
      subject: 'Password Reset',
      text: `Please click on the following link to reset your password: http://localhost:3000/reset/${token}`,
    };

    await transporter.sendMail(mailOptions);
    
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    
    return { message: 'Password reset email sent successfully.' };
  },
};

export default resetPasswordAction;
