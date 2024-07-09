import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { doc, updateDoc, arrayUnion, Timestamp, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../firebase';
import { v4 as uuid } from 'uuid';

export const Input = () => {

    const [text, setText] = useState('');
    const [img, setImg] = useState(null);

    const { currUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async () => {

        // Do nothing if both text and img are empty
        if (!text && !img) return;

        let imgURL = null;

        if (img) {
            // Firebase upload an image

            // setting ref fot upload
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, img);

            imgURL = await new Promise((resolve, reject) => {

                //upload
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => {
                        console.log(error);
                        reject(error);
                    },

                    //get imageURL
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    }
                );
            });
        }

        // setting message structure
        const newMessage = {
            id: uuid(),
            text: text || '', // Ensure text is always a string
            img: imgURL || null,
            senderId: currUser.uid,
            date: Timestamp.now(),
        };

        // Update chat messages
        await updateDoc(doc(db, 'chats', data.chatId), {
            messages: arrayUnion(newMessage),
        });

        // Update last message for both users
        const lastMessage = text ? text : img ? 'Image' : '';

        await updateDoc(doc(db, 'userChats', currUser.uid), {
            [`${data.chatId}.lastMessage`]: {
                text: lastMessage,
            },
            [`${data.chatId}.date`]: serverTimestamp(),
        });

        await updateDoc(doc(db, 'userChats', data.user.uid), {
            [`${data.chatId}.lastMessage`]: {
                text: lastMessage,
            },
            [`${data.chatId}.date`]: serverTimestamp(),
        });

        setText('');
        setImg(null);
    };

    return (
        <footer className="flex flex-wrap md:flex-row justify-between items-center bg-neutral text-neutral-content space-x-2 p-4">
            <input
                type="text"
                placeholder="Type a message"
                className="input input-bordered input-sm md:w-xs focus:outline-none rounded-none bg-transparent"
                onChange={(e) => { setText(e.target.value) }}
                value={text}
            />
            <div className='flex space-x-5 items-center'>
                <label htmlFor="file" className="btn btn-xs md:btn-sm">
                    {img ? img.name.substring(0, 5) + '..' : 'Add Image'}
                </label>
                <input
                    type="file"
                    name="file"
                    id="file"
                    className="hidden"
                    onChange={(e) => { setImg(e.target.files[0]) }}
                />
                <button className="btn btn-xs md:btn-sm" onClick={handleSend}>Send</button>
            </div>
        </footer>
    );
};
