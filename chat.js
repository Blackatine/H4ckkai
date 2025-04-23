// Import configuration
import config from '../../config.js';

// Initialize chat functionality
function initializeChat() {
    // Get all necessary elements
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const sendButton = document.querySelector('.send-button');
    const commandButtons = document.querySelectorAll('.command-button');
    const controlButtons = document.querySelectorAll('.control-button');

    // Add welcome message with animation
    animateWelcomeTitle();
    setTimeout(() => {
        addMessage('assistant', 'Welcome to H4ckKai! How can I assist you with cybersecurity today?');
    }, 2000);

    // Add event listeners for sending messages
    if (sendButton) {
        sendButton.addEventListener('click', handleUserMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserMessage();
            }
        });
    }

    // Add event listeners for command buttons
    commandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const command = button.getAttribute('data-command');
            if (command) {
                chatInput.value = command;
                handleUserMessage();
            }
        });
    });

    // Add event listeners for control buttons
    controlButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            switch (action) {
                case 'CLEAR':
                    clearChat();
                    break;
                case 'EXPORT':
                    exportChat();
                    break;
                case 'THEME':
                    toggleTheme();
                    break;
            }
        });
    });

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(`${savedTheme}-theme`);
    updateThemeIcon(savedTheme);
}

async function handleUserMessage() {
    const chatInput = document.querySelector('.chat-input');
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage('user', message);
    chatInput.value = '';
    chatInput.focus();

    // Show typing indicator
    showTypingIndicator();

    try {
        // Send message to server
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // Remove typing indicator and add response
        removeTypingIndicator();
        addMessage('assistant', data.response);
        scrollToBottom();
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        addMessage('assistant', "I'm having trouble connecting to the server. Please try again later.");
        scrollToBottom();
    }
}

function addMessage(type, text) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;
    
    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'message-timestamp';
    timestampDiv.textContent = new Date().toLocaleTimeString();
    
    messageDiv.appendChild(textDiv);
    messageDiv.appendChild(timestampDiv);
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const chatMessages = document.querySelector('.chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const chatMessages = document.querySelector('.chat-messages');
    const typingIndicator = chatMessages.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function scrollToBottom() {
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearChat() {
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.innerHTML = '';
    // Add welcome message
    addMessage('assistant', 'Welcome to H4ckKai! How can I assist you with cybersecurity today?');
}

function toggleTheme() {
    try {
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        
        // Remove old theme
        document.body.classList.remove(isLight ? 'light-theme' : 'dark-theme');
        // Add new theme
        document.body.classList.add(`${newTheme}-theme`);
        
        // Save to localStorage
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        updateThemeIcon(newTheme);
        
        // Update chat container background
        const chatContainer = document.querySelector('.chatbot-container');
        if (chatContainer) {
            chatContainer.style.background = isLight ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)';
        }

        // Update message colors
        const messages = document.querySelectorAll('.message');
        messages.forEach(msg => {
            if (msg.classList.contains('user-message')) {
                msg.style.background = isLight ? 'rgba(0, 170, 105, 0.1)' : 'rgba(0, 255, 242, 0.1)';
            } else {
                msg.style.background = isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)';
            }
        });
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
}

function updateThemeIcon(theme) {
    const themeButton = document.querySelector('[data-action="THEME"] i');
    if (themeButton) {
        themeButton.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

function exportChat() {
    try {
        const chatMessages = document.querySelector('.chat-messages');
        const messages = Array.from(chatMessages.children)
            .filter(msg => msg.classList.contains('message'))
            .map(msg => {
                const type = msg.classList.contains('user-message') ? 'User' : 'Assistant';
                const text = msg.querySelector('.message-text').textContent;
                const timestamp = msg.querySelector('.message-timestamp').textContent;
                return `[${timestamp}] ${type}: ${text}`;
            })
            .join('\n\n');
        
        const blob = new Blob([messages], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat-history.txt';
        a.title = 'Download Chat History';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'export-success';
        successMsg.textContent = 'Chat history downloaded successfully!';
        chatMessages.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
    } catch (error) {
        console.error('Error exporting chat:', error);
        const errorMsg = document.createElement('div');
        errorMsg.className = 'export-error';
        errorMsg.textContent = 'Failed to download chat history. Please try again.';
        chatMessages.appendChild(errorMsg);
        setTimeout(() => errorMsg.remove(), 3000);
    }
}

function animateWelcomeTitle() {
    const welcomeTitle = document.querySelector('.welcome-title');
    if (!welcomeTitle) return;

    const text = welcomeTitle.textContent;
    welcomeTitle.textContent = '';
    welcomeTitle.classList.add('typing');

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            welcomeTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            welcomeTitle.classList.remove('typing');
            welcomeTitle.classList.add('typed');
        }
    };

    typeWriter();
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeChat);