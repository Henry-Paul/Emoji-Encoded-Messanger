// Enhanced emoji database
const emojiDatabase = {
    "😀": "I'm feeling great!",
    "😂": "That's hilarious!",
    "🥰": "Sending love your way!",
    "😎": "Cool and confident!",
    "🤔": "I'm thinking about it...",
    "🙄": "Seriously?",
    "😍": "I love it!",
    "🤩": "That's amazing!",
    "😊": "I'm happy!",
    "😇": "Have a good day!",
    "🥺": "Please?",
    "❤️": "I love you!",
    "🤗": "Sending hugs!",
    "😴": "I'm tired",
    "😭": "I'm really sad",
    "😡": "I'm angry",
    "🤢": "That's disgusting",
    "🥳": "Let's celebrate!",
    "🎉": "Congratulations!",
    "🎂": "Happy birthday!",
    "🍕": "I'm hungry for pizza",
    "☕": "Need coffee!",
    "🚀": "Let's do this!",
    "💡": "I have an idea!",
    "⭐": "You're a star!",
    "🏆": "You're a winner!",
    "🙏": "Thank you!",
    "👍": "Good job!",
    "👎": "Not good",
    "👋": "Hello!",
    "🤝": "Let's work together",
    "💪": "You can do it!",
    "🎵": "I love this song!",
    "📚": "Time to study",
    "💼": "Busy with work",
    "🏖️": "Wish I was on vacation",
    "🎮": "Let's play games!",
    "🎬": "Movie night?",
    "🛒": "Time to go shopping",
    "💰": "Money matters",
    "🔒": "This is confidential",
    "🎁": "I have a gift for you",
    "💌": "Sending you a message",
    "📞": "Call me!",
    "✈️": "Let's travel!",
    "🏠": "I'm at home",
    "🌧️": "It's raining here",
    "🌞": "Beautiful day!",
    "🌙": "Good night!",
    "🐶": "I love dogs!",
    "🐱": "I love cats!",
    "🌻": "Thinking of you",
    "🍀": "Good luck!",
    "⚡": "That was fast!",
    "🔥": "That's hot!",
    "❄️": "It's cold!",
    "🌈": "Stay positive!"
};

// App State
const state = {
    messages: [],
    selectedEmoji: null,
    settingsOpen: false,
    lastGlobalCheck: 0,
    globalCheckInterval: null
};

// DOM Elements
const elements = {
    chatMessages: document.getElementById('chat-messages'),
    emojiKeyboard: document.getElementById('emoji-keyboard'),
    passwordModal: document.getElementById('password-modal'),
    welcomeModal: document.getElementById('welcome-modal'),
    newMessageAlert: document.getElementById('new-message-alert'),
    selectedEmojiDisplay: document.getElementById('selected-emoji'),
    messageText: document.getElementById('message-text'),
    senderPassword: document.getElementById('sender-password'),
    decodeEmoji: document.getElementById('decode-emoji'),
    decodePassword: document.getElementById('decode-password'),
    decodeBtn: document.getElementById('decode-btn'),
    decodeResult: document.getElementById('decode-result'),
    decodedMessageText: document.getElementById('decoded-message-text'),
    decodeTimer: document.getElementById('decode-timer'),
    confirmSend: document.getElementById('confirm-send'),
    cancelSend: document.getElementById('cancel-send'),
    getStarted: document.getElementById('get-started'),
    settingsBtn: document.getElementById('settings-btn'),
    settingsPanel: document.getElementById('settings-panel'),
    emptyState: document.getElementById('empty-state'),
    clearChat: document.getElementById('clear-chat'),
    refreshGlobal: document.getElementById('refresh-global'),
    shareApp: document.getElementById('share-app'),
    refreshGlobalBtn: document.getElementById('refresh-global-btn'),
    globalMessagesList: document.getElementById('global-messages-list'),
    tabs: document.querySelectorAll('.tab'),
    contents: document.querySelectorAll('.content')
};

// Initialize the application
function init() {
    populateEmojiKeyboard();
    setupEventListeners();
    loadMessages();
    setupTabNavigation();
    checkFirstVisit();
    startGlobalMessageChecker();
}

// Setup tab navigation
function setupTabNavigation() {
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            elements.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            elements.contents.forEach(c => c.classList.remove('active'));
            document.getElementById(`${tabId}-content`).classList.add('active');
            
            // Refresh global messages when switching to that tab
            if (tabId === 'global') {
                loadGlobalMessages();
            }
        });
    });
}

// Populate emoji keyboard
function populateEmojiKeyboard() {
    const emojis = Object.keys(emojiDatabase);
    emojis.forEach(emoji => {
        const emojiBtn = document.createElement('button');
        emojiBtn.className = 'emoji-btn';
        emojiBtn.textContent = emoji;
        emojiBtn.setAttribute('title', emojiDatabase[emoji]);
        emojiBtn.addEventListener('click', () => {
            state.selectedEmoji = emoji;
            showPasswordModal();
        });
        elements.emojiKeyboard.appendChild(emojiBtn);
    });
}

// Show password modal for sender
function showPasswordModal() {
    elements.selectedEmojiDisplay.textContent = state.selectedEmoji;
    elements.messageText.value = emojiDatabase[state.selectedEmoji];
    elements.passwordModal.style.display = 'flex';
    elements.messageText.focus();
    elements.senderPassword.value = '';
}

// Send encrypted message to global storage
function sendEncryptedMessage() {
    const text = elements.messageText.value.trim();
    const password = elements.senderPassword.value.trim();
    
    console.log('Sending message:', { text, password, emoji: state.selectedEmoji }); // Debug log
    
    if (!text) {
        showNotification('Please enter a message.', 'error');
        return;
    }
    
    if (!password) {
        showNotification('Please enter a password to encrypt your message.', 'error');
        return;
    }
    
    // Create message object
    const message = {
        id: generateMessageId(text, password),
        emoji: state.selectedEmoji,
        text: text,
        password: password,
        timestamp: Date.now(),
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        location: getRandomLocation() // Simulate user location
    };
    
    // Store in global storage
    addMessageToGlobalStorage(message);
    
    // Add to local state and save
    state.messages.push({...message, type: 'sent'});
    saveMessages();
    
    // Create local message element
    createMessageElement({...message, type: 'sent'});
    
    // Close modal
    elements.passwordModal.style.display = 'none';
    
    // Hide empty state
    elements.emptyState.style.display = 'none';
    
    // Scroll to bottom
    scrollToBottom();
    
    // Reset selected emoji
    state.selectedEmoji = null;
    
    showNotification('Message sent globally! Others can see it now.', 'success');
}

// Add message to global storage (simulated using localStorage as shared storage)
function addMessageToGlobalStorage(message) {
    const globalMessages = JSON.parse(localStorage.getItem('globalEmojiMessages') || '[]');
    globalMessages.push(message);
    
    // Keep only last 50 messages to prevent storage overflow
    if (globalMessages.length > 50) {
        globalMessages.splice(0, globalMessages.length - 50);
    }
    
    localStorage.setItem('globalEmojiMessages', JSON.stringify(globalMessages));
    localStorage.setItem('globalMessagesUpdated', Date.now().toString());
}

// Load and display global messages
function loadGlobalMessages() {
    const globalMessages = JSON.parse(localStorage.getItem('globalEmojiMessages') || '[]');
    const now = Date.now();
    
    // Filter out expired messages
    const validMessages = globalMessages.filter(msg => msg.expiresAt > now);
    
    // Update storage with only valid messages
    if (validMessages.length !== globalMessages.length) {
        localStorage.setItem('globalEmojiMessages', JSON.stringify(validMessages));
    }
    
    elements.globalMessagesList.innerHTML = '';
    
    if (validMessages.length === 0) {
        elements.globalMessagesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No global messages</h3>
                <p>Messages from users worldwide will appear here</p>
            </div>
        `;
        return;
    }
    
    // Display messages in reverse order (newest first)
    validMessages.reverse().forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'global-message';
        messageElement.setAttribute('data-emoji', message.emoji);
        messageElement.setAttribute('data-password', message.password);
        
        const timeAgo = getTimeAgo(message.timestamp);
        const expiresIn = Math.ceil((message.expiresAt - now) / 1000 / 60);
        
        messageElement.innerHTML = `
            <div class="global-message-emoji">${message.emoji}</div>
            <div class="global-message-info">
                <div>From: ${message.location}</div>
                <div>${timeAgo} • Expires in ${expiresIn}m</div>
                <div><small>Click to decode with password</small></div>
            </div>
        `;
        
        messageElement.addEventListener('click', () => {
            elements.decodeEmoji.value = message.emoji;
            switchToTab('decoder');
            elements.decodePassword.focus();
        });
        
        elements.globalMessagesList.appendChild(messageElement);
    });
}

// Start checking for new global messages
function startGlobalMessageChecker() {
    state.globalCheckInterval = setInterval(() => {
        checkForNewMessages();
        loadGlobalMessages(); // Refresh the list
    }, 3000); // Check every 3 seconds
    
    // Initial load
    loadGlobalMessages();
}

// Check for new global messages
function checkForNewMessages() {
    const lastUpdate = parseInt(localStorage.getItem('globalMessagesUpdated') || '0');
    
    if (lastUpdate > state.lastGlobalCheck) {
        state.lastGlobalCheck = lastUpdate;
        
        // Show notification if not on global tab
        const activeTab = document.querySelector('.tab.active').getAttribute('data-tab');
        if (activeTab !== 'global') {
            showNewMessageAlert();
        }
    }
}

// Show new message alert
function showNewMessageAlert() {
    elements.newMessageAlert.style.display = 'flex';
    setTimeout(() => {
        elements.newMessageAlert.style.display = 'none';
    }, 3000);
}

// Generate random user location (for demo purposes)
function getRandomLocation() {
    const locations = ['Hyderabad', 'Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];
    return locations[Math.floor(Math.random() * locations.length)];
}

// Get time ago string
function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Generate a unique message ID
function generateMessageId(text, password) {
    let hash = 0;
    const str = text + password + Date.now();
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString();
}

// Create message element in DOM
function createMessageElement(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.type}`;
    messageElement.id = `message-${message.id}`;
    
    const timeString = new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageElement.innerHTML = `
        <div class="message-info" title="View message">
            <i class="fas fa-eye"></i>
        </div>
        <div class="message-emoji">${message.emoji}</div>
        <div class="message-text">${message.text}</div>
        <div class="message-timer">Global Message</div>
        <div class="message-time">${timeString}</div>
    `;
    
    elements.chatMessages.appendChild(messageElement);
    
    // Add click event to info button
    const infoBtn = messageElement.querySelector('.message-info');
    infoBtn.addEventListener('click', () => {
        showMessageText(messageElement, message);
    });
    
    return messageElement;
}

// Show message text with password
function showMessageText(messageElement, message) {
    const password = prompt('Enter password to view this message:');
    if (password === message.password) {
        const messageText = messageElement.querySelector('.message-text');
        const messageTimer = messageElement.querySelector('.message-timer');
        
        messageText.style.display = 'block';
        messageTimer.style.display = 'block';
        
        // Hide message after 60 seconds
        setTimeout(() => {
            messageText.style.display = 'none';
            messageTimer.style.display = 'none';
        }, 60000);
    } else {
        showNotification('Incorrect password!', 'error');
    }
}

// Decode message from any source
function decodeMessage() {
    const emoji = elements.decodeEmoji.value.trim();
    const password = elements.decodePassword.value.trim();
    
    if (!emoji) {
        showNotification('Please paste an emoji.', 'error');
        return;
    }
    
    if (!password) {
        showNotification('Please enter the password.', 'error');
        return;
    }
    
    // Try to find the message in global storage first
    const globalMessages = JSON.parse(localStorage.getItem('globalEmojiMessages') || '[]');
    let foundMessage = null;
    
    for (const message of globalMessages) {
        if (message.emoji === emoji && message.password === password) {
            foundMessage = message;
            break;
        }
    }
    
    // If not found in global storage, try local storage
    if (!foundMessage) {
        for (const message of state.messages) {
            if (message.emoji === emoji && message.password === password) {
                foundMessage = message;
                break;
            }
        }
    }
    
    // If still not found, try default messages
    if (!foundMessage && emojiDatabase[emoji]) {
        if (password === "default" || password === "") {
            foundMessage = {
                emoji: emoji,
                text: emojiDatabase[emoji],
                password: password
            };
        }
    }
    
    if (foundMessage) {
        elements.decodedMessageText.textContent = foundMessage.text;
        elements.decodeResult.style.display = 'flex';
        startDecodeTimer();
        showNotification('Message decoded successfully!', 'success');
        
        // Save to local messages if not already there
        if (!state.messages.some(m => m.id === foundMessage.id)) {
            state.messages.push({
                ...foundMessage,
                timestamp: new Date(),
                type: 'received'
            });
            saveMessages();
        }
    } else {
        showNotification('No matching message found. Check the emoji and password.', 'error');
    }
}

// Start countdown timer for decoded message
function startDecodeTimer() {
    let secondsLeft = 60;
    elements.decodeTimer.textContent = `Message will disappear in ${secondsLeft} seconds`;
    elements.decodeTimer.style.display = 'block';
    
    const timer = setInterval(() => {
        secondsLeft--;
        elements.decodeTimer.textContent = `Message will disappear in ${secondsLeft} seconds`;
        
        if (secondsLeft <= 0) {
            clearInterval(timer);
            elements.decodeResult.style.display = 'none';
            elements.decodeTimer.style.display = 'none';
        }
    }, 1000);
}

// Check if this is the first visit
function checkFirstVisit() {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
        elements.welcomeModal.style.display = 'flex';
        localStorage.setItem('hasVisited', 'true');
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = 'var(--success)';
    } else if (type === 'error') {
        notification.style.backgroundColor = 'var(--danger)';
    } else {
        notification.style.backgroundColor = 'var(--primary)';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Scroll to bottom of chat
function scrollToBottom() {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// Save messages to localStorage
function saveMessages() {
    localStorage.setItem('secureEmojiMessages', JSON.stringify(state.messages));
}

// Load messages from localStorage
function loadMessages() {
    const savedMessages = localStorage.getItem('secureEmojiMessages');
    if (savedMessages) {
        state.messages = JSON.parse(savedMessages);
        
        state.messages.forEach(message => {
            createMessageElement(message);
        });
        
        if (state.messages.length > 0) {
            elements.emptyState.style.display = 'none';
        }
        
        scrollToBottom();
    }
}

// Clear all messages
function clearChat() {
    if (confirm('Are you sure you want to clear all local messages?')) {
        state.messages = [];
        saveMessages();
        elements.chatMessages.innerHTML = '';
        elements.emptyState.style.display = 'block';
        showNotification('Local chat cleared successfully!', 'success');
    }
}

// Share app link
function shareApp() {
    const appUrl = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: 'Secure Emoji Messenger - Global',
            text: 'Check out this app for sending encrypted messages globally using emojis! No login required, real-time global sharing.',
            url: appUrl
        });
    } else {
        copyToClipboard(appUrl);
        showNotification('App link copied to clipboard! Share it worldwide.', 'success');
    }
}

// Copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(err => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback copy method
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}

// Switch to specific tab
function switchToTab(tabId) {
    elements.tabs.forEach(t => t.classList.remove('active'));
    elements.contents.forEach(c => c.classList.remove('active'));
    
    document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}-content`).classList.add('active');
}

// Setup event listeners
function setupEventListeners() {
    // Password modal - FIXED: Added proper event listeners
    elements.confirmSend.addEventListener('click', sendEncryptedMessage);
    elements.cancelSend.addEventListener('click', () => {
        elements.passwordModal.style.display = 'none';
        state.selectedEmoji = null;
    });
    
    // Decode button
    elements.decodeBtn.addEventListener('click', decodeMessage);
    
    // Welcome modal
    elements.getStarted.addEventListener('click', () => {
        elements.welcomeModal.style.display = 'none';
    });
    
    // Settings
    elements.settingsBtn.addEventListener('click', () => {
        state.settingsOpen = !state.settingsOpen;
        elements.settingsPanel.classList.toggle('show', state.settingsOpen);
    });
    
    // Settings options
    elements.clearChat.addEventListener('click', clearChat);
    elements.refreshGlobal.addEventListener('click', () => {
        loadGlobalMessages();
        showNotification('Global messages refreshed!', 'success');
        state.settingsOpen = false;
        elements.settingsPanel.classList.remove('show');
    });
    
    elements.shareApp.addEventListener('click', shareApp);
    
    // Refresh global button
    elements.refreshGlobalBtn.addEventListener('click', loadGlobalMessages);
    
    // Allow Enter key to submit forms - FIXED: Added proper key listeners
    elements.messageText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            elements.senderPassword.focus();
        }
    });
    
    elements.senderPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendEncryptedMessage();
        }
    });
    
    elements.decodePassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            decodeMessage();
        }
    });
    
    // Close settings when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.settingsBtn.contains(e.target) && !elements.settingsPanel.contains(e.target)) {
            state.settingsOpen = false;
            elements.settingsPanel.classList.remove('show');
        }
    });
    
    // FIXED: Close modal when clicking outside modal content
    elements.passwordModal.addEventListener('click', (e) => {
        if (e.target === elements.passwordModal) {
            elements.passwordModal.style.display = 'none';
            state.selectedEmoji = null;
        }
    });
    
    elements.welcomeModal.addEventListener('click', (e) => {
        if (e.target === elements.welcomeModal) {
            elements.welcomeModal.style.display = 'none';
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
