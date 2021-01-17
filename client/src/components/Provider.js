import React, { createContext, useEffect, useState } from 'react';
import { message } from 'antd'
import axios from 'axios'

export const CoreContext = createContext()

const DEV_URL = "http://localhost:5000/"

export const CoreProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [showTutorial, setShowTutorial] = useState(true)

    useEffect(() => {
        const seenTutorial = localStorage.getItem('seenTutorial')
        if(seenTutorial) setShowTutorial(false)
    }, [])

    return(
        <CoreContext.Provider
            value={{
                user,

                showTutorial,
                completeTutorial: () => {
                    localStorage.setItem('seenTutorial', true)
                    setShowTutorial(false)
                },

                getMove: () => {
                    try {
                        const result = axios.get(DEV_URL + 'getMove')
                        console.log(result)
                    } catch (error) {
                        console.log(error)
                        message("Unable to get move.")
                    }
                },
            }}
        >
            {children}
        </CoreContext.Provider>
    )
}