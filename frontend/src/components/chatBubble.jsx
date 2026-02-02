import './chatBubble.css';

function ChatBubble({ msg, currentUser = 'alice' }) {
  const isRight = msg.sender_name === currentUser;
  // debugMessage(msg, currentUser);

  return (
    <li className="message-item">
      <div className={`message-bubble ${isRight ? 'right' : 'left'}`}>
        <span className="sender">{msg.sender_name}</span> →{' '}
        <span className="receiver">{msg.receiver_name}</span>

        <p>{msg.message_text}</p>

        <span className="status">{msg.status}</span>
      </div>
    </li>
  );
}

function debugMessage(msg, currentUser) {
  const isLeft = msg.sender_name.toLowerCase() === currentUser.toLowerCase();

  console.log('ChatBubble render:');
  console.log('  currentUser:', currentUser);
  console.log('  sender_name:', msg.sender_name);
  console.log('  receiver_name:', msg.receiver_name);
  console.log('  message_text:', msg.message_text);
  console.log('  status:', msg.status);
  console.log('  isLeft:', isLeft);

  return isLeft;
}

export default ChatBubble;