import React from 'react';
import chart from "../../assets/chart.png"

import {Row, Col, Button} from 'antd'
import { useHistory } from 'react-router-dom';

const About = () => {
    const history = useHistory();
    
    return (
        <div className="about-page">
            <Row gutter={48} style={{alignItems: 'center'}}>
                <Col span={12}>
                    <h1>About</h1>
                    <p>Rock, Paper, Scissors, Lizard, Spock is a game of chance by Sam Kass and Karen Bryla which adds "Spock" and "Lizard" to the famous game of Rock, Paper, Scissors. The game was used to settle many disputes on the popular show The Big Bang Thoery</p>
                    <Button
                        size="large"
                        type="primary"
                        style={{marginTop: '12px'}}
                        onClick={() => history.push('/game')}
                    >
                        Start Playing
                    </Button>
                </Col>

                

                <Col span={12}>
                    <img src={chart}/>
                </Col>
            
            </Row>
        </div>
    );
}
 
export default About;