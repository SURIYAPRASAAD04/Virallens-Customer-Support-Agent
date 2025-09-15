const Conversation = require('../models/Conversation');


const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      searchTerm,
      dateRange,
      conversationType,
      sortBy = 'newest',
      page = 1,
      limit = 25
    } = req.query;

    
    let filter = { user_id: userId };
    
   
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      filter.createdAt = { $gte: startDate };
    }

  
    if (conversationType && conversationType !== 'all') {
      filter.type = conversationType;
    }

    
    if (searchTerm) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { preview: { $regex: searchTerm, $options: 'i' } },
        { 'messages.content': { $regex: searchTerm, $options: 'i' } }
      ];
    }

    
    let sort = {};
    switch (sortBy) {
      case 'oldest':
        sort.createdAt = 1;
        break;
      case 'duration':
        sort.duration = -1;
        break;
      case 'messages':
        sort.messageCount = -1;
        break;
      case 'newest':
      default:
        sort.createdAt = -1;
        break;
    }

   
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalCount = await Conversation.countDocuments(filter);

    
    const conversations = await Conversation.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-messages') 
      .lean();

    res.json({
      conversations,
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      hasNextPage: skip + conversations.length < totalCount,
      hasPrevPage: parseInt(page) > 1
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};


const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findOne({ 
      conversation_id: conversationId 
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};


const deleteConversations = async (req, res) => {
  try {
    const { conversationIds } = req.body;
    
    if (!conversationIds || !Array.isArray(conversationIds)) {
      return res.status(400).json({ error: 'Invalid conversation IDs' });
    }

    const result = await Conversation.deleteMany({ 
      conversation_id: { $in: conversationIds } 
    });

    res.json({ 
      message: `Deleted ${result.deletedCount} conversations`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting conversations:', error);
    res.status(500).json({ error: 'Failed to delete conversations' });
  }
};


const saveConversation = async (req, res) => {
  try {
    const { conversation_id, user_id, title, preview, messages, type = 'general' } = req.body;

   
    const messageCount = messages.length;
    const duration = messages.length > 0 
      ? (new Date(messages[messages.length - 1].timestamp) - new Date(messages[0].timestamp)) / 1000
      : 0;

    
    const conversation = await Conversation.findOneAndUpdate(
      { conversation_id },
      {
        user_id,
        title,
        preview,
        type,
        messageCount,
        duration,
        messages,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true 
      }
    );

    res.json(conversation);
  } catch (error) {
    console.error('Error saving conversation:', error);
    res.status(500).json({ error: 'Failed to save conversation' });
  }
};

const updateConversationTitle = async (req, res) => {
  try {
    const { conversationId, title } = req.body;
    
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }
    
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { conversation_id: conversationId },
      { 
        title: title.trim(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({
      success: true,
      conversation: {
        conversation_id: conversation.conversation_id,
        title: conversation.title,
        updatedAt: conversation.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating conversation title:', error);
    res.status(500).json({ 
      error: 'Failed to update conversation title',
      details: error.message
    });
  }
};

module.exports = {
  getConversations,
  getConversation,
  deleteConversations,
  saveConversation,
  updateConversationTitle
};