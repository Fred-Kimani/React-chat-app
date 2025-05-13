// GroupChatWrapper.tsx
import { useParams } from 'react-router-dom';
import GroupChat from './groupChat';

const GroupChatWrapper = () => {
  const { roomId } = useParams();

  if (!roomId) return <p>Invalid room</p>;

  return <GroupChat roomId={roomId} />;
};

export default GroupChatWrapper;
