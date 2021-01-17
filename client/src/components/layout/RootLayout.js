import React from 'react';
import AppRouter from '../AppRouter';
import Footer from './Footer';
import Header from './Header';

const RootLayout = () => {
    return (
        <div className="root-layout">
            <Header/>
            <AppRouter/>
            <Footer/>
        </div>
    );
}
 
export default RootLayout;