import './chatsList.css';

function ChatsList({ recipients, onSelectRecipient }) {
  console.log('Recipients obtained at ChatsList: ', recipients);
  return (
    <div className="chatsList">
      <ul>
        {recipients.map((recipient) => (
          <li key={recipient.id} className="chat-item">
            <button
              className="recipient-button"
              onClick={() => onSelectRecipient(recipient)}
            >
              {recipient.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatsList