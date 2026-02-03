import ChatBubble from './chatBubble';
import './chatContainer.css';

function ChatContainer({ messages, currentUser, topic }) {
  return (
    <div className="chat-container">
      <h2>{topic ? topic : 'No Chat Selected'}</h2>

      <ul className="messages-list">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.message_id}
            msg={msg}
            currentUser={currentUser}
          />
        ))}
      </ul>
    </div>
  );
}

export default ChatContainer;