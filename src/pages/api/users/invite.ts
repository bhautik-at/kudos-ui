import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid email addresses array is required',
      });
    }

    // Validate emails (simple validation)
    const validEmails = emails.filter(
      email => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );

    if (validEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid email addresses provided',
      });
    }

    // In a real implementation, we would:
    // 1. Check if users already exist
    // 2. Send invitation emails
    // 3. Create placeholder user accounts

    // For mock purposes, just return the count of invited users
    return res.status(200).json({
      success: true,
      data: {
        invitedCount: validEmails.length,
      },
    });
  } catch (error) {
    console.error('Error in user invitation API:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
