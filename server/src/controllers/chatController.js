const { sendMessage } = require('../utils/openRouter');
const Conversation = require('../models/Conversation');

const handleChatMessage = async (req, res) => {
  try {
    const { message, conversationHistory, conversationId, userId, title = 'New Conversation' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const aiResponse = await sendMessage(message, conversationHistory);
    
   
    const newConversationId = conversationId || `conv-${Date.now()}`;
    const preview = message.substring(0, 100) + (message.length > 100 ? '...' : '');
    
    const updatedMessages = [
      ...conversationHistory,
      {
        content: message,
        isUser: true,
        timestamp: new Date()
      },
      {
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      }
    ];

  
    const conversation = await Conversation.findOneAndUpdate(
      { conversation_id: newConversationId },
      {
        user_id: userId,
        title: title,
        preview: preview,
        messages: updatedMessages,
        messageCount: updatedMessages.length,
        duration: updatedMessages.length > 0 
          ? (new Date(updatedMessages[updatedMessages.length - 1].timestamp) - new Date(updatedMessages[0].timestamp)) / 1000
          : 0,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true 
      }
    );

    res.json({ 
      response: aiResponse,
      conversationId: newConversationId,
      title: conversation.title
    });
  } catch (error) {
    console.error('Chat controller error:', error.message);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to process your message. Please try again.'
    });
  }
};

const handleRegenerateMessage = async (req, res) => {
  try {
    const { messageId, conversationId, currentMessage } = req.body;
    
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }

  
    const conversation = await Conversation.findOne({ conversation_id: conversationId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

  
    const messages = conversation.messages;
    const aiMessageIndex = messages.findIndex(msg => 
      msg._id?.toString() === messageId || msg.id === messageId
    );
    
    if (aiMessageIndex === -1 || aiMessageIndex === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    
    const userMessage = messages[aiMessageIndex - 1];
    if (!userMessage.isUser) {
      return res.status(400).json({ error: 'Previous message is not from user' });
    }

   
    const conversationHistory = messages.slice(0, aiMessageIndex - 1);
    
   
    const regeneratedResponse = await sendMessage(userMessage.content, conversationHistory);
    
   
    messages[aiMessageIndex].content = regeneratedResponse;
    messages[aiMessageIndex].timestamp = new Date();
    messages[aiMessageIndex].regenerated = true;
    
    await conversation.save();

    res.json({
      regeneratedMessage: regeneratedResponse,
      messageId: messages[aiMessageIndex]._id || messages[aiMessageIndex].id,
      success: true
    });
  } catch (error) {
    console.error('Error regenerating message:', error);
    res.status(500).json({ 
      error: 'Failed to regenerate response',
      details: error.message
    });
  }
};

module.exports = { handleChatMessage, handleRegenerateMessage };