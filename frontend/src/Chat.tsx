import React, { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim()) {
      const newUserMessage: Message = { role: 'user', content: input };
      setMessages([...messages, newUserMessage]);
      setInput('');

      try {
        const response = await fetch('/generate_mermaid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: input }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const mermaidCode = data.mermaid_code;

        const newAssistantMessage: Message = { role: 'assistant', content: `\`\`\`mermaid\n${mermaidCode}\n\`\`\`` };
        setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);

      } catch (error) {
        console.error("Error generating mermaid code:", error);
        const errorMessage: Message = { role: 'assistant', content: `Error generating flowchart: ${error instanceof Error ? error.message : String(error)}` };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-area" style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter your prompt..."
          style={{ flexGrow: 1 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;