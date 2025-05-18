import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET methods
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const organizationId = req.query.organizationId as string;

    // Check if organizationId is provided
    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: 'organizationId is required',
      });
    }

    // Return empty data
    return res.status(200).json({
      success: true,
      data: {
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error('Error in users API:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
