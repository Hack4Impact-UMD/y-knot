import React, { useState } from 'react';
import styles from './NavigationBar.module.css';
import yKnotLogo from '../../assets/yknot-logo.png';

const NavigationBar = (): JSX.Element => {

    const [activeLink, setActiveLink] = useState('home');

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setActiveLink(e.currentTarget.id);
        console.log(e.currentTarget.id)
    };

    return (
        <nav className = {styles.navigationBar}>
            <div className={styles.titleContainer}>
                <img className={styles.yKnotLogo} src={yKnotLogo} alt="y-knot logo" />
                <h2 className={styles.adminHeader}>Admin</h2>
            </div>
            <hr className={styles.breakLine}></hr>
            <div className={styles.linkOptionsContainer}>
                <div className={activeLink === 'home' ? styles.highlightOn : styles.highlightOff} >                
                    <a className={styles.linkOptions} href="#" id='home' onClick={handleClick} >Home</a>
                </div>
                <div className={activeLink === 'about' ? styles.highlightOn : ''} >                
                    <a className={styles.linkOptions} href="#" id='about' onClick={handleClick}>About</a>
                </div>
                <div className={activeLink === 'services' ? styles.highlightOn : ''} >                
                    <a className={styles.linkOptions} href="#" id='services' onClick={handleClick}>Services</a>
                </div>
                <div className={activeLink === 'contact' ? styles.highlightOn : ''} >                
                    <a className={styles.linkOptions} href="#" id='contact' onClick={handleClick}>Contact</a>
                </div>
            </div>
        </nav>

    )
}

export default NavigationBar