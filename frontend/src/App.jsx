import { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      console.log('Fetching messages from API...');

      try {
        const res = await fetch(`/api/getMessages`);
        console.log('Raw response object:', res);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="app-container">
      <h2>Chat Messages</h2>
      <ul className="messages-list">
        {messages.map(msg => (
          <li key={msg.message_id} className="message-item">
            <div
              className={`message-bubble ${msg.sender_name === 'Alice' ? 'left' : 'right'
                }`}
            >
              <span className="sender">{msg.sender_name}</span> →{' '}
              <span className="receiver">{msg.receiver_name}</span>
              <p>{msg.message_text}</p>
              <span className="status">{msg.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
