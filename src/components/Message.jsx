import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

export const Message = ({ message }) => {

    const { currUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }, [message])

    return (
        <div ref={ref} className={`chat ${message.senderId === currUser.uid ? 'chat-end' : 'chat-start'}`} >

            {/* Avatar Section */}
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img
                        alt="Tailwind CSS chat bubble component"
                        src={
                            message.senderId === currUser.uid ? currUser.photoURL : data.user.photoURL
                        }
                    />
                </div>
            </div>

            {/* User Name Section */}
            <div className="chat-header">
                {message.senderId === currUser.uid ? currUser.displayName : data.user.displayName}
                <time className="text-xs opacity-50"></time>
            </div>

            {/* Conversation Section */}
            {message.text && <div className="chat-bubble"> {message.text}</div>}
            {message.img && <img className=" chat-bubble p-0 w-1/3 rounded-lg mt-2 cursor-pointer" src={message.img} alt="Image" />}

        </div >
    );
};