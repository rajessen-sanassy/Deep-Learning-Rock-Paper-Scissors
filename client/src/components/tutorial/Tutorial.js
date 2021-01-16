import React, { useContext, useState } from 'react';
import { CoreContext } from '../Provider';
import InfoCard from './InfoCard';
import Progress from './Progress';

const Tutorial = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const { showTutorial, completeTutorial } = useContext(CoreContext)

    const steps = [
        {
            title: "Calibration",
            description: "During the following steps you will be prompted with the various moves.\nPerform the following actions as instructed, using the example images as a guide."
        },
        {
            title: "Rock",
            description: `Hi lukewarm,\nHelp us teach our monkeys how your paper looks!\nPlease raise a paper symbol to the camera until the border lights green :)`,
        },
        {
            title: "Paper",
            description: "....",
        },
        {
            title: "Scissors",
            description: "....",
        },
        {
            title: "Lizard",
            description: "....",
        },
        {
            title: "Spock",
            description: "....",
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

    if(!showTutorial) return <div/>
    
    return (
        <div className="tutorial">
            <Progress stepIndex={stepIndex}/>
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