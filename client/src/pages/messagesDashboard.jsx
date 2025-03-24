import Messages from '@/components/messages'
import useContact from '@/hooks/contact/useMessages';
import React from 'react'
import { useSelector } from 'react-redux';

function MessagesDashboard() {
  const { userInfo } = useSelector(state => state.auth);
  const { sendMessage, messages, isLoading } = useContact(userInfo?.userId);
  console.log(messages);

  return (
    <div className='mt-25'>
      <Messages conversations={messages} />
    </div>
  )
}

export default MessagesDashboard