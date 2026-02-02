import { useEffect, useState } from 'react';
import './App.css';
import ChatContainer from './components/chatContainer';
import ChatsList from './components/chatsList';


const placeholderChats = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
  { id: 4, name: 'David' },
];


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
    <div className="chat-wrapper">
      <ChatsList
        chats={placeholderChats}
      />

      <ChatContainer
        messages={messages}
        currentUser="alice"
      />
    </div>
  );
}
