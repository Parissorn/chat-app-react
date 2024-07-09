import React, { createContext, useContext, useReducer, } from 'react'
import { AuthContext } from './AuthContext'

export const ChatContext = createContext(null);

export const ChatContextProvider = (props) => {

    const { currUser } = useContext(AuthContext)

    //state ที่จะใช้ reducer จัดการ 
    // เป็นตัวบ่งบอก ว่าเราแชทกับใครอยู่
    const INITIAL_STATE = {
        chatId: "null",
        user: {},
    };
    // function reducer
    const chatReducer = (state, action) => {
        switch (action.type) {
            // ในเคสที่เปลี่ยน user
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId: action.payload.uid > currUser.uid
                        ? action.payload.uid + currUser.uid
                        : currUser.uid + action.payload.uid
                }
            case "LOGOUT":
                return {
                    chatId: "null",
                    user: {},
                }

            default: return state
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    const contextValue = { data: state, dispatch };

    return (
        <ChatContext.Provider value={contextValue}>
            {props.children}
        </ChatContext.Provider>
    )
};

