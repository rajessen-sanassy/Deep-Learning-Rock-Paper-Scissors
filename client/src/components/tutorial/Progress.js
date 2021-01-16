import React from 'react';

const Progress = ({stepIndex}) => {
    return (
        <>
        <div className="progress-bar" style={{width: 640 * (stepIndex+1)/7}}>
            <div />
        </div>
        </>
    );
};

export default Progress;