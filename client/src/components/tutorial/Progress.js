import React, { useEffect } from 'react';

const Progress = ({stepIndex, max, hasColor}) => {
    const colors = ['#6E7ED3', '#FA8072', '#B85757']
    let curColor;

    if(!hasColor || stepIndex > 3) {
        curColor = colors[0]
    } else if(stepIndex > 1) {
        curColor = colors[1]
    } else {
        curColor = colors[2]
    }

    return (
        <>
        <div className={hasColor? 'progress-bar game-progress-bar' : 'progress-bar'} style={{width: 640 * (stepIndex+1)/max, backgroundColor: curColor}}>
            <div />
        </div>
        </>
    );
};

export default Progress;