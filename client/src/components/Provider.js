import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios'
import { message } from 'antd'
import { useHistory } from 'react-router-dom';

export const CoreContext = createContext()

const DEV_URL = "http://localhost:5000/"

export const CoreProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [showTutorial, setShowTutorial] = useState(true)
    const [move, setMove] = useState("")

    const [playerHistory, setPlayerHistory] = useState([])
    const [aiHistory, setAiHistory] = useState([])

    const history = useHistory();

    useEffect(() => {
        const seenTutorial = localStorage.getItem('seenTutorial')
        if(seenTutorial) setShowTutorial(false)
    }, [])

    useEffect(() => {
        const user = localStorage.getItem('user')
        if(user) setUser(user)
    }, [])

    const getMove = async () => {
        try {
            const result = await axios.get(DEV_URL + 'getMove')
            
            if(result.data !== move && !["none", "loading.."].includes(result.data)) {
                setMove(result.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const id = setInterval(getMove, 1000)
        return () => clearInterval(id)
    }, [getMove])

    const updateHistory = (result) => {
        let tempHistory1 = [...playerHistory]
        let tempHistory2 = [...aiHistory]

        console.log("RESULT", result)

        const winMap = {
            'win': 'W',
            'loss': 'L',
            'tie': 'T',
        }

        if(!result.player_move) return

        tempHistory1.push({
            move: result.player_move,
            outcome: winMap[result.result]
        })

        tempHistory2.push({
            move: result.pc_move,
            outcome: result.result === "win" ? 'L' : 'W'
        })

        console.log(tempHistory1)

        setPlayerHistory(playerHistory => playerHistory.concat({
            move: result.player_move,
            outcome: winMap[result.result]
        }))
        setAiHistory(aiHistory => aiHistory.concat({
            move: result.pc_move,
            outcome: result.result === "win" ? 'L' : 'W'
        }))

        console.log("player:", tempHistory1)
        console.log("ai:", tempHistory2)
    }
    

    return(
        <CoreContext.Provider
            value={{
                user,
                move,

                playerHistory,
                aiHistory,

                showTutorial,
                completeTutorial: () => {
                    localStorage.setItem('seenTutorial', true)
                    setShowTutorial(false)
                    history.push('/game')
                },

                login: async () => {
                    console.log('login')
                    try {
                        const result = await axios.get(
                            DEV_URL + 'login',
                        )

                        let name = result.data

                        if(name === "unknown") {
                            message.error("Unable to login, please try again or signup.")
                        } else {
                            setUser(result.data)
                            localStorage.setItem('user', result.data)
                            message.success("Succesfully logged in as " + result.data)
                        }

                        
                    } catch(error) {
                        console.log(error.message)
                    }
                },

                signup: async(data) => {
                    console.log("signup called")

                    try {
                        let formData = new FormData()
                        formData.append("name", data.name)

                        const result = await axios.post(
                            DEV_URL + 'signup',
                            formData
                        )

                        setUser(data.name)
                        localStorage.setItem('user', data.name)

                        message.success("Succesfully signed in as " + data.name)
                    } catch(error) {
                        console.log(error.message)
                    }
                },

                playMove: async() => {
                    try {
                        const result = await axios.get(
                            DEV_URL + 'playMove',
                        )

                        console.log(result.data)
                        updateHistory(result.data)
                        return result.data
                    } catch(error) {
                        console.log(error.message)
                    }
                }
                
            }}
        >
            {children}
        </CoreContext.Provider>
    )
}