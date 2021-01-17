import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'antd'

import { CoreContext } from '../Provider';
import ScoreCard from "../game/ScoreCard"
import { useHistory } from 'react-router-dom';
import Progress from '../tutorial/Progress';
import MoveHistory from '../game/MoveHistory';


const Game = () => {
    const { playMove, playerHistory, aiHistory } = useContext(CoreContext)
    const { user } = useContext(CoreContext)
    const [userScore, setUserScore] = useState(0);
    const [pcScore, setPcScore] = useState(0);
    const [timer, setTimer] = useState(0)
    const [started, setStarted] = useState(false)
    const [id, setId] = useState(null)
    const history = useHistory();

    useEffect(() => {
        if(started) {
            const timerID = setInterval(() => {
                const newTimer = (timer + 1) % 6
                if (newTimer === 5) play()
                setTimer(newTimer)
            }, 1000)

            return () => clearInterval(timerID)
        }
    }, [timer, started]);

    const play = async() => {
        const result = await playMove();
        setStarted(false)
        
        if (result.result === "loss") {
            console.log('Loss')
            setPcScore(pcScore + 1)
        } else if (result.result === "win") {
            console.log('Win')
            setUserScore(userScore + 1)
        } else {
            console.log('Tie')
        }

        setTimeout(() => {
            setStarted(true)
        }, 2000)
    }

    const start = async() => {
        if (!started) {
            setStarted(true)
        } else {
            setStarted(false)
        }
    }

    useEffect(() => {
        if(!user) history.push('/')

        // return clearInterval(id)
    }, [user])

    const gameMessage = () => {  
        const moveMap = {
            'R': 'rock',
            'P': 'paper',
            'S': 'scissors',
            'L': 'lizard',
            'K': 'spock',
        }

        const win_dict = {
            'rock' : {'scissors': 'crushes', 'lizard': 'crushes'},
            'paper': {'rock': 'covers', 'spock': 'disproves'} ,
            'scissors': {'paper': 'cuts', 'lizard': 'decapitates'},
            'lizard': {'spock': 'poisons', 'paper': 'eats'},
            'spock': {'rock': 'vaporizes', 'scissors': 'smashes'}
        }

        if(playerHistory.length == 0) return
        if(aiHistory.length == 0) return

        console.log(playerHistory[playerHistory.length-1])

        let move1 = moveMap[playerHistory[playerHistory.length-1].move]
        let move2 = moveMap[aiHistory[aiHistory.length-1].move]

        if(!move1 || !move2) return

        if(move1 === move2) {
            return `You played ${move1}, AI played ${move2}. You both tied.`
        } else {
            let action = win_dict[move1][move2]

            if(action) {
                // player won
                return `You played ${move1}, AI played ${move2}. ${move1.charAt(0).toUpperCase() + move1.slice(1)} ${action} ${move2}. You win!`
            } else {
                // player lost
                action = win_dict[move2][move1]
                return `You played ${move1}, AI played ${move2}. ${move2.charAt(0).toUpperCase() + move2.slice(1)} ${action} ${move1}. You lost!`
            }
        }
    }

    // Have a sentence with result (you played x, ai played y. x crushes y, you win)
    /*
    
    */
    return (
        <div className='game-layout'>
           <div className="stream">
                <img src="http://localhost:5000/stream"/>
                <ScoreCard right={true} name={user ? user : ''} score={userScore}/>
                <ScoreCard started={started} right={false} name={"AI"} score={pcScore}/>
                <MoveHistory right={true} moves={playerHistory}/>
                <MoveHistory moves={aiHistory}/>
                <Button className="game-btn" size="large" type="primary" onClick={start}>{started ? "Stop" : "Start"}</Button>
                <Progress hasColor={true} stepIndex={4 - timer} max={5}/>
                <p className="result">{gameMessage()}</p>
            </div>
        </div>
    );
};

export default Game;