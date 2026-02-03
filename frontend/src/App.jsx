import { useEffect, useState } from 'react';
import './App.css';
import ChatContainer from './components/chatContainer';
import ChatsList from './components/chatsList';

export default function App() {
  const [recipients, setRecipients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState(null);

  async function handleSelectRecipient(recipient) {
    try {
      setTopic(recipient.name);
      const res = await fetch(`/api/getMessages?recipient=${recipient.id}`);
      const data = await res.json();
      console.log('Parsed message data', data);
      setMessages(data.messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages([]);
    }
  }

  useEffect(() => {
    async function fetchRecipients() {
      console.log('Fetching messages from API...');

      try {
        const res = await fetch(`/api/getRecipients`);
        console.log('Raw response object:', res);
        const data = await res.json();
        console.log('Parsed response data:', data.recipients);
        setRecipients(data.recipients);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipients();
  }, []);

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="chat-wrapper">
      <ChatsList
        recipients={recipients}
        onSelectRecipient={handleSelectRecipient}
      />

      <ChatContainer
        messages={messages}
        currentUser="You"
        topic={topic}
      />
    </div>
  );
}
