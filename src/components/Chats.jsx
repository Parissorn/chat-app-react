import React, { useEffect, useState, useContext } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

export const Chats = () => {
    const [chats, setChats] = useState([]);
    const { currUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    // Update this function to handle chat selection
    const handleSelect = (user, chatId) => {
        // Dispatch action to change user and chatId in context
        dispatch({ type: "CHANGE_USER", payload: user, chatId });
    };

    useEffect(() => {
        // คนที่เราคุยด้วยมีใครบ้าง เอามา
        const getChats = () => {
            const unsub = onSnapshot(doc(db, 'userChats', currUser.uid), (doc) => {
                // set เป็น Object
                setChats(doc.data());
            });
            return () => {
                unsub();
            };
        };

        currUser.uid && getChats();

    }, [currUser.uid]);

    return (
        <div>
            {Object.entries(chats)?.sort((a, b) => (b[1].date - a[1].date)).map((chat) => (
                <div key={chat[0]}
                    className="flex items-center justify-start text-sm py-2 px-3 space-x-3 hover:bg-blue-300 cursor-pointer"
                    onClick={() => { handleSelect(chat[1].userInfo, chat[0]) }} // Pass chatId to handleSelect
                >
                    {console.log(chat)}
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Avatar"
                                src={chat[1].userInfo.photoURL}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <p className='font-semibold'>{chat[1].userInfo.displayName}</p>
                        <span className='text-xs text-slate-500'>
                            {
                                chat[1].lastMessage?.text
                                    ? chat[1].lastMessage.text.length > 55
                                        ? chat[1].lastMessage.text.substring(0, 50) + '..'
                                        : chat[1].lastMessage.text
                                    : 'No message yet'
                            }
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
