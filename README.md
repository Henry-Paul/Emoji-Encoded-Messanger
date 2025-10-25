# 🔒 Secure Emoji Messenger

A global, no-login-required web application for sending encrypted messages using emojis. Anyone from anywhere in the world can encode and decode messages using the same web app link.

## 🌍 Global Access Features

- **No Registration Required**: Use immediately without any sign-up
- **Global Message Sharing**: Encode messages that can be decoded by anyone with the app link
- **5-Minute Storage**: All messages are automatically deleted after 5 minutes
- **Cross-Platform**: Works on all devices and browsers
- **Offline Capable**: Install as PWA for offline use

## 🚀 How to Use

### Encoding a Message:
1. Go to the **Encoder** tab
2. Select an emoji from the keyboard
3. Enter your secret message
4. Set a password
5. Copy the emoji and share it with anyone
6. Share the password separately (through different channel)

### Decoding a Message:
1. Go to the **Decoder** tab  
2. Paste the received emoji
3. Enter the password provided by the sender
4. Click "Decode Message" to view the hidden text

## 🔐 Security Features

- Password-protected message encryption
- Messages automatically expire after 5 minutes
- No personal data stored or collected
- Client-side encryption only

## 📱 Installation

### Web Browser:
Simply visit the GitHub Pages URL on any device

### Mobile App:
- **iOS**: Tap Share → "Add to Home Screen"
- **Android**: Use "Add to Home Screen" in browser menu
- **All Devices**: Use the "Install App" button in the Guide tab

## 🌐 Global Access

This app uses simulated global storage through localStorage with automatic cleanup. Anyone with the web app link can:
- Encode messages with emojis
- Decode messages with the correct password  
- Access messages within 5 minutes of creation

## 🛠️ Technology

- Pure HTML, CSS, JavaScript
- Progressive Web App (PWA) capabilities
- localStorage for temporary message storage
- Responsive design for all devices

## 📄 License

MIT License - Feel free to use and modify
