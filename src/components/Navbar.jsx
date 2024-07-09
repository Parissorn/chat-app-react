import React, { useContext } from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

export const Navbar = () => {

    const { dispatch } = useContext(ChatContext)
    const { currUser } = useContext(AuthContext)

    return (
        <div className="navbar text-white bg-blue-500 py-0">
            <div className="avatar online ml-2 mr-2">
                <div className="w-10 rounded-full">
                    <img
                        alt="Tailwind CSS Navbar component"
                        src={currUser.photoURL} />
                </div>
            </div>
            <div className='navbar-center mr-2'>
                <p className=' font-semibold'>{currUser.displayName}</p>
            </div>
            <div className='navbar-end'>
                <button className=" btn btn-xs bg-primary-content border-none" onClick={() => {
                    signOut(auth)
                    dispatch({ type: "LOGOUT", })
                }}>Logout</button>
            </div>

        </div>
    )
}
