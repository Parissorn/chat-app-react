import React, { createContext, useEffect, useState } from 'react'
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';


export const AuthContext = createContext(null);

export const AuthContextProvider = (props) => {

    const [currUser, setCurrUser] = useState({})

    //run only once
    useEffect(() => {

        // เอาไว้ listen ว่ามี user sign in,out ใส่ callback เพื่อหา user ปัจจุบัน ถ้าไม่มีค่าจะเป็น null
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrUser(user)
        })

        // Clean up the subscription on unmount
        //ง่ายๆคือถ้าเรามีการใช้ฟังก์ชันที่เป็น listener จะต้องใช้วิธีการ clean up เพื่อป้องกัน memory leaks
        return () => {
            unsub();
        }
    }, [])

    const contextValue = { currUser }

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
};

