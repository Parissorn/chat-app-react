import React from 'react'
import { Navbar } from '../components/Navbar'
import { Searchbar } from './Searchbar'
import { Chats } from './Chats'


export const Sidebar = () => {
    return (
        <div>
            <Navbar />
            <Searchbar />
            <Chats />
        </div>
    )
}
