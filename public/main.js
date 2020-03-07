// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();

// Add the public key generated from the console here.
messaging.usePublicVapidKey("BHIZKnG5z1CYJMYh08qTI8rrP3yeClVStSp16OB8LQhhVdIsbZUBFRT0EBSnJF59YermlZVK253S0NEUvNOdugU");


// UI elements
const tokenButton = document.querySelector('#token-button');
const tokenBox = document.querySelector('#token-box');
const hasTokenBlock = document.querySelector('#has-token-block');
const messageForm = document.querySelector('#message-form');
const inAppMessagesList = document.querySelector('#in-app-messages-list');
const inAppMessages = [];

tokenButton.addEventListener('click', getAndListenForToken);
messageForm.addEventListener('submit', sendMessage);


function getAndListenForToken() {
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken().then((currentToken) => {
        if (currentToken) {
            sendTokenToServer(currentToken);
            updateUIForPushEnabled(currentToken);
        } else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
            // Show permission UI.
            updateUIForPushPermissionRequired();
            setTokenSentToServer(false);
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        showToken('Error retrieving Instance ID token. ', err);
        setTokenSentToServer(false);
    });

    // Callback fired if Instance ID token is updated.
    messaging.onTokenRefresh(() => {
        messaging.getToken().then((refreshedToken) => {
            console.log('Token refreshed.');
            // Indicate that the new Instance ID token has not yet been sent to the
            // app server.
            setTokenSentToServer(false);
            // Send Instance ID token to app server.
            sendTokenToServer(refreshedToken);
            // ...
        }).catch((err) => {
            console.log('Unable to retrieve refreshed token ', err);
            showToken('Unable to retrieve refreshed token ', err);
        });
    });
}

function sendTokenToServer(token) {
    console.log('sendTokenToServer', token);
}
function setTokenSentToServer(sent) {
    console.log('setTokenSentToServer', sent)
}
function updateUIForPushEnabled(token) {
    tokenBox.textContent = token;
    tokenButton.disabled = true;
    hasTokenBlock.className = '';
}
function updateUIForPushPermissionRequired() {
    alert('You need to allow push notifications, dummy');
}
function showToken(msg, err) {
    // console.log('showToken', msg, err);
}
function refreshInAppMessages() {
    inAppMessagesList.innerHTML = inAppMessages.map(m =>
        `<pre class="alert alert-primary"><code>${JSON.stringify(m, null, 2)}</code></pre>`
    ).join('');
}

async function sendMessage(e) {
    e.preventDefault();

    const data = new URLSearchParams();
    for(const pair of new FormData(messageForm)){
        data.append(pair[0], pair[1]);
    }
    data.append('token', tokenBox.textContent);

    const result = await fetch('/api/sendMessage', {
        method: 'post',
        body: data,
    });
    console.log('send request result', result);
}

// Listen for messages in web app
messaging.onMessage(function (payload) {
    console.log('Message received. ', payload);
    inAppMessages.push(payload);
    refreshInAppMessages();
});

// auto get token
if(Notification && Notification.permission === 'granted') {
    getAndListenForToken();
}