import React, { useContext, useState } from 'react';
import { CoreContext } from '../Provider';
import InfoCard from './InfoCard';
import Progress from './Progress';

const Tutorial = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const { user, showTutorial, completeTutorial } = useContext(CoreContext)

    const steps = [
        {
            title: "Calibration",
            description: "During the following steps you will be prompted with the various moves.\nPerform the following actions in the designated box."
        },
        {
            title: "Rock",
            description: `Please form a vertical fist for the rock.\nRecall of that rock crushes scissors and lizard.`,
        },
        {
            title: "Paper",
            description: "Please form a vertical open palm with fingers together for the paper.\nRecall that paper covers rock and disproves spock.",
        },
        {
            title: "Scissors",
            description: "Please form a horizontal peace-sign, knuckles facing outward, for scissors.\nRecall that scissors cuts paper and decapitates lizard."
        },
        {
            title: "Lizard",
            description: "Please horizontally join fingers at the thumb to for lizard.\nRecall that lizard poisons spock and eats paper."
        },
        {
            title: "Spock",
            description: "Please form a vertical open palm with distance between middle and ring fingers for spock.\nRecall that spock smashes scissors and vaporizes rock.",
        },
        {
            title: "Calibration Complete",
            description: "Thank you for calibrating. You are now ready to start playing!"
        }
    ]

    const nextStep = () => {
        setStepIndex(Math.min(stepIndex+1, steps.length-1));
    }

    const prevStep = () => {
        setStepIndex(Math.max(stepIndex-1, 0));
    }

    if(!showTutorial || !user) return <div/>
    
    return (
        <div className="tutorial">
            <Progress stepIndex={stepIndex} max={7}/>
            <InfoCard
                stepIndex={stepIndex}
                step={steps[stepIndex]}
                nextStep={nextStep}
                prevStep={prevStep}
                completeTutorial={completeTutorial}
            />
        </div>
    );
};

export default Tutorial;