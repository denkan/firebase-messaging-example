const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

const sendMessageRouter = require('./send-message').sendMessageRouter;


admin.initializeApp();

const apiRouter = express();
apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({ extended: true }));
apiRouter.get('/api', (req, res) => res.json({ date: new Date() }))
apiRouter.use('/api/sendMessage', sendMessageRouter);

exports.api = functions.https.onRequest(apiRouter);
