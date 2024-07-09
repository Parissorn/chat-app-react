import React, { useContext, useEffect, useState } from 'react';
import { Message } from './Message';
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const AllMessages = () => {
    const { data } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Ensure we have a valid chatId before fetching messages
        if (data.chatId) {
            const unsub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
                doc.exists() && setMessages(doc.data().messages);
            });

            return () => {
                unsub();
            };
        }
    }, [data.chatId]);

    return (

        <div className='flex flex-col justify-start overflow-y-auto p-2 h-full'>
            {data && messages.map((m) => (
                <Message key={m.id} message={m} />
            ))}
        </div>
    );
};
