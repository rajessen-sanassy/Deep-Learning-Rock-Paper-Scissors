import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'antd'
import { CoreContext } from '../Provider';


const InfoCard = ({stepIndex, step, nextStep, prevStep, completeTutorial}) => {
    const { move } = useContext(CoreContext)
    const [lockStep, setLockStep] = useState(false)

    useEffect(() => {
        setLockStep(false)
    }, [step])

    const NewlineText = (props) => {
        const text = props.text;
        return text.split('\n').map(str => <p>{str}</p>);
    }

    const shouldDisable = () => {
        if(lockStep) return false

        if(stepIndex === 0) return false
        if(move === step.title.toLowerCase()) {
            setLockStep(true)
            return false
        }

        return true
    }

    return (
        <div className="info-card">
            <p className="info-title">{step.title}</p>
            <NewlineText text={step.description} className="info-description"></NewlineText>

            {(stepIndex > 0) ? <Button style={{marginRight: "12px"}} onClick={prevStep}>Back</Button>: null }
            {(stepIndex < 6) ? 
                <Button type="primary" disabled={shouldDisable()} onClick={nextStep}>Next</Button>
                :
                <Button type="primary" onClick={completeTutorial}>Start</Button>
            }
        </div>
    );
};

export default InfoCard;