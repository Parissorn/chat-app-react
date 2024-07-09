import React, { useContext } from 'react';
import { AllMessages } from './AllMessages';
import { Input } from './Input';
import { ChatContext } from '../context/ChatContext';

export const Chat = () => {

    const { data } = useContext(ChatContext);

    return (
        <div className='h-100p flex flex-col justify-between'>

            {/* Navigation */}
            <div className="navbar bg-indigo-200 h-10p">
                <div className="flex-1">
                    <a className="text-lg font-semibold">{data?.user?.displayName}</a>
                </div>
                <div className="flex-none">
                    <button className="btn btn-square btn-ghost">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="inline-block h-5 w-5 stroke-current">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Chat Section */}
            <AllMessages className="h-80p flex-grow overflow-y-auto" />

            {/* Input Section */}
            {data.user && (
                <div className=" justify-self-end">
                    <Input className="w-full" />
                </div>
            )}
        </div>
    );
};
