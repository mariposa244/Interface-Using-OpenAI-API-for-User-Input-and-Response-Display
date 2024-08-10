const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.querySelector('.chat-messages');

let apiKey = 'YOUR_OPENAI_API_KEY_HERE';

chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

sendButton.addEventListener('click', sendMessage);

function sendMessage() {
  const userMessage = chatInput.value.trim();
  if (userMessage) {
    addMessage(userMessage, 'user');
    chatInput.value = '';
    getResponse(userMessage);
  }
}

function addMessage(text, sender) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');

  const messageBox = document.createElement('div');
  messageBox.classList.add('message-box');

  const messageText = document.createElement('p');
  messageText.classList.add('message-text');
  messageText.textContent = text;

  messageBox.appendChild(messageText);
  messageContainer.appendChild(messageBox);

  if (sender === 'user') {
    messageContainer.style.justifyContent = 'flex-end';
  } else {
    messageContainer.style.justifyContent = 'flex-start';
  }

  chatMessages.appendChild(messageContainer);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getResponse(userMessage) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: 2048,
        n: 1,
        stop: null,
        temperature: 0.7
      })
    });

    if (response.ok) {
      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      addMessage(botResponse, 'bot');
    } else {
      console.error('Error:', response.status);
      addMessage('Apologies, there was an error processing your request.', 'bot');
    }
  } catch (error) {
    console.error('Error:', error);
    addMessage('Apologies, there was an error processing your request.', 'bot');
  }
}