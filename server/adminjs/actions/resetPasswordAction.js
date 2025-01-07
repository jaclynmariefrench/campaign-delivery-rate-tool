import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { User } from '../../models/userSchema.js';

const resetPasswordAction = {
  actionType: 'resource',
  handler: async (req, res, context) => {
    console.log("Request Payload:", req.body); // Log the request body
    const { email } = req.body; // Access req.body instead of request.payload
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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

    const info = await transporter.sendMail(mailOptions);
    
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    
    return res.status(200).json({ success: true, message: 'Password reset email sent successfully.' });
  },
};

export default resetPasswordAction;
