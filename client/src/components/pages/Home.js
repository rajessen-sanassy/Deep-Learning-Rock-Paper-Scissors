import React from 'react';
import Tutorial from '../tutorial/Tutorial';

const DEV_URL = "http://localhost:5000/stream"

const Home = () => {
    return(
        <div className="home-layout">
            <div className="stream">
                <img src="http://localhost:5000/stream"/>
                <Tutorial/>
            </div>
        </div>
    )
}

export default Home;