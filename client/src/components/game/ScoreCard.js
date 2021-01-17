import React from 'react';
import PropTypes from 'prop-types';

const ScoreCard = ({right, name, score}) => {
    let cardClass;
    right ? cardClass = 'score-card right' : cardClass = 'score-card'

    return (
        <div className={cardClass}>
            <p className="name">{name}</p>
            <p className="score">{score}</p>
        </div>
    );
};

export default ScoreCard;