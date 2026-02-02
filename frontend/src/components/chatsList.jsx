import './chatsList.css';

function ChatsList({ chats }) {
  return (
    <div className="chatsList">
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="chat-item">
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatsList