import React from 'react';

import rock from '../../assets/rock.png'
import paper from '../../assets/paper.png'
import scissors from '../../assets/scissors.png'
import lizard from '../../assets/lizard.png'
import spock from '../../assets/spock.png'


const MoveHistory = ({right, moves}) => {
    let cardClass;
    right ? cardClass = 'move-history right' : cardClass = 'move-history'

    const imageMap = {
        'R': rock,
        'P': paper,
        'S': scissors,
        'L': lizard,
        'K': spock,
    }

    const newMoves = () => {
        // [1, 2, 3, 4, 5, 6, 7] last 5 moves
        let newMoves = []
        
        for(let i=moves.length-1; i>=Math.max(moves.length-5, 0); i--) {
            newMoves.push(moves[i])
        }

        return newMoves;
    }

    return (
        <div className={cardClass}>
            {
               newMoves().map((move, index) => (
                    <img 
                        className="move-icon"
                        src={imageMap[move.move]}
                        alt="new"
                        key={index}
                    />
               ))
            }
        </div>
    );
};

export default MoveHistory;