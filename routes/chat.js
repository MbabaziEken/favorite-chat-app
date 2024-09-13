const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/upload-voice', upload.single('voiceNote'), async (req, res) => {
    const message = new Message({
        sender: req.user._id,
        receiver: req.body.receiverId,
        content: `/uploads/${req.file.filename}`,
        type: 'voice'
    });
    await message.save();
    res.redirect('/chat');
});

router.get('/', async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/auth/login');
    const messages = await Message.find().populate('sender receiver');
    res.render('chat', { messages });
});

router.post('/message', async (req, res) => {
    const { content, type, receiverId } = req.body;
    const message = new Message({
        sender: req.user._id,
        receiver: receiverId,
        content,
        type
    });
    await message.save();
    res.redirect('/chat');
});

router.post('/upload-avatar', async (req, res) => {
    if (req.file) {
        await User.findByIdAndUpdate(req.user._id, { avatar: req.file.filename });
    }
    res.redirect('/chat');
});

router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    if (req.file) {
        await User.findByIdAndUpdate(req.user._id, { avatar: `/avatars/${req.file.filename}` });
    }
    res.redirect('/chat');
});


module.exports = router;
