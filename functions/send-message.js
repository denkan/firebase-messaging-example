const admin = require('firebase-admin');
const express = require('express');

const sendMessageRouter = express();

sendMessageRouter.post('/', async (req, res) => {
    const token = req.body && req.body.token;
    const title = req.body && req.body.title;
    const body = req.body && req.body.body;
    const delay = req.body && req.body.delay || 0;

    try {
        await new Promise(resolve => setTimeout(resolve, (delay * 1000)));
        const messageId = await admin.messaging().send({
            token,
            notification: { title, body }
        });
        console.log(messageId);
        return res.json({ messageId });
    } catch(error) {
        return res.json({ error });
    }
});

exports.sendMessageRouter = sendMessageRouter;