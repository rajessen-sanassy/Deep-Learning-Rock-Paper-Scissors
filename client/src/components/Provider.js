import React, { createContext, useEffect, useState } from 'react';

export const CoreContext = createContext()

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
            }}
        >
            {children}
        </CoreContext.Provider>
    )
}