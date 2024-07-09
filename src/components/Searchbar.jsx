import React, { useContext, useState } from 'react'
import { doc, collection, query, where, getDoc, getDocs, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext'

export const Searchbar = () => {

    const { currUser } = useContext(AuthContext);

    const [err, setErr] = useState(false);
    //user ที่เราค้นหา
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');

    //เงื่อนไขในการเริ่ม search เมื่อ Enter
    const handleStartingSearch = (event) => {
        (event.code === 'Enter' && handleSearch())
    };

    // เริ่ม search
    const handleSearch = async () => {
        // สร้าง Object ในการค้นหา 
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("displayName", "==", username));

        try {
            // เอาข้อมูล user มา
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setErr(true);
                setUser(null);
            } else {
                querySnapshot.forEach((doc) => {
                    setUser(doc.data());
                });
                setErr(false);
            }
        } catch (error) {
            setErr(true);
            console.error("Error fetching documents: ", error);
        }
    };

    const handleSelect = async () => {

        // check whether the group (chats in Firestore Database) exists
        // combinedId คือ id ของ chat ระหว่าง 2 user
        const combinedId = user.uid > currUser.uid
            ? user.uid + currUser.uid
            : currUser.uid + user.uid

        try {
            const res = await getDoc(doc(db, 'chats', combinedId))

            //if not exist then create one
            if (!res.exists()) {
                //create a chat in chat collection
                await setDoc(doc(db, 'chats', combinedId), { messages: [] })

                // update user chats ให้กับ currUser
                await updateDoc(doc(db, 'userChats', currUser.uid), {
                    //user ที่ currUser คุยด้วย
                    [combinedId + '.userInfo']: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combinedId + '.date']: serverTimestamp()
                })

                // update user chats ให้กับ user 
                await updateDoc(doc(db, 'userChats', user.uid), {
                    //currUser ที่ user คุยด้วย
                    [combinedId + '.userInfo']: {
                        uid: currUser.uid,
                        displayName: currUser.displayName,
                        photoURL: currUser.photoURL
                    },
                    [combinedId + '.date']: serverTimestamp()
                })
            }
        } catch (error) {
            console.log(error)
        }

        setUser(null)
        setUsername('')

    };

    return (
        <div>
            <input
                type="text"
                placeholder="Find a user"
                className="input input-bordered input-sm w-full max-w-xs focus:outline-none rounded-none bg-transparent border-x-0 border-t-0"
                onChange={(event) => { setUsername(event.target.value) }}
                onKeyDown={handleStartingSearch}
                value={username}
            />
            {err && <div className='text-center py-2 tracking-wider'>No results..</div>}
            {user &&
                <div
                    className="flex items-center justify-start text-sm py-2 px-3 space-x-3 hover:bg-blue-300 cursor-pointer border-b-[0.5px] border-slate-400"
                    onClick={handleSelect}>
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src={user.photoURL} />
                        </div>
                    </div>
                    <p className='font-semibold'>{user.displayName}</p>
                </div>
            }
        </div>
    )
}
