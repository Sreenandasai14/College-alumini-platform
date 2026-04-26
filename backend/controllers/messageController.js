import Message from "../models/Message.js";
import Connection from "../models/Connection.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({ message: "Sender, receiver, and message text are required" });
    }

    // Check if connection exists and is accepted
    const connection = await Connection.findOne({
      $or: [
        { student: sender, alumni: receiver, status: "accepted" },
        { student: receiver, alumni: sender, status: "accepted" },
      ],
    });

    if (!connection) {
      return res.status(403).json({ message: "You can only message with accepted connections" });
    }

    const newMessage = new Message({
      sender,
      receiver,
      message,
    });

    await newMessage.save();
    const populatedMessage = await newMessage.populate("sender", "firstName lastName email");

    res.status(201).json({ message: "Message sent", data: populatedMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const userId = req.userId;
    const { otherId } = req.params;

    const connection = await Connection.findOne({
      $or: [
        { student: userId, alumni: otherId, status: "accepted" },
        { student: otherId, alumni: userId, status: "accepted" },
      ],
    });

    if (!connection) {
      return res.status(403).json({ message: "You can only access conversations with accepted connections" });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId },
      ],
    })
      .populate("sender", "firstName lastName")
      .populate("receiver", "firstName lastName")
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const userId = req.userId;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "firstName lastName")
      .populate("receiver", "firstName lastName")
      .sort({ createdAt: -1 });

    // Group messages by conversation
    const conversations = {};
    messages.forEach((msg) => {
      const senderId = msg.sender._id.toString();
      const receiverId = msg.receiver._id.toString();
      const conversationId = senderId === userId ? receiverId : senderId;
      if (!conversations[conversationId]) {
        conversations[conversationId] = [];
      }
      conversations[conversationId].push(msg);
    });

    // Get latest message per conversation
    const latestMessages = Object.keys(conversations).map((key) => {
      const conv = conversations[key];
      return {
        conversationId: key,
        otherUser:
          conv[0].sender._id.toString() === userId ? conv[0].receiver : conv[0].sender,
        lastMessage: conv[conv.length - 1].message,
        lastMessageTime: conv[conv.length - 1].createdAt,
        unread: false,
      };
    });

    res.json({ conversations: latestMessages, allMessages: messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
