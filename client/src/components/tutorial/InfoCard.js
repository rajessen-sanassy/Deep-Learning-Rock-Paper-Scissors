import React from 'react';
import { Button } from 'antd'


const InfoCard = ({stepIndex, step, nextStep, prevStep, completeTutorial}) => {
    const NewlineText = (props) => {
        const text = props.text;
        return text.split('\n').map(str => <p>{str}</p>);
    }

    return (
        <div className="info-card">
            <p className="info-title">{step.title}</p>
            <NewlineText text={step.description} className="info-description"></NewlineText>

            {(stepIndex > 0) ? <Button style={{marginRight: "12px"}} onClick={prevStep}>Back</Button>: null }
            {(stepIndex < 6) ? 
                <Button type="primary" onClick={nextStep}>Next</Button>
                :
                <Button type="primary" onClick={completeTutorial}>Start</Button>
            }
        </div>
    );
};

export default InfoCard;