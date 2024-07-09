import React from 'react'
import { Sidebar } from '../components/Sidebar'
import { Chat } from '../components/Chat'

export const Home = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-content p-0 ">
            <div className="w-full max-w-4xl scale-75 md:scale-100 h-[550px] bg-base-200 rounded-lg shadow flex overflow-hidden border-[0.5px] border-white">
                <div className="flex-[3_0%] bg-blue-200">
                    <Sidebar />
                </div>
                <div className="flex-[7_0%] bg-indigo-100">
                    <Chat />
                </div>
            </div>
        </div >
    )
}
