import React from 'react';
import Home from '../pages/Home';
import Footer from './Footer';
import Header from './Header';

const RootLayout = () => {
    return (
        <div className="root-layout">
            <Header/>
                <Home/>
            <Footer/>
        </div>
    );
}
 
export default RootLayout;