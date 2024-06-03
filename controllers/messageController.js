const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('author').lean();
    res.render('index', { user: req.user, messages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.newMessageGet = (req, res) => {
  res.render('new-message');
};

exports.newMessagePost = async (req, res) => {
  try {
    const { title, text } = req.body;
    const message = new Message({ title, text, author: req.user._id });
    await message.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.upvoteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).send('Message not found');
    }
    if (!message.upvotedBy.includes(req.user._id) && !message.downvotedBy.includes(req.user._id)) {
      message.upvotes += 1;
      message.upvotedBy.push(req.user._id);
      await message.save();
    }
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.downvoteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).send('Message not found');
    }
    if (!message.downvotedBy.includes(req.user._id) && !message.upvotedBy.includes(req.user._id)) {
      message.downvotes += 1;
      message.downvotedBy.push(req.user._id);
      await message.save();
    }
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
