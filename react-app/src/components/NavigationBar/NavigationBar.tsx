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
                <div className={activeLink === 'home' ? styles.highlightOn : ''} >                
                    <a className={styles.linkOptions} href="#" id='home' onClick={handleClick} >Home</a>
                </div>
                <div className={activeLink === 'teachers' ? styles.highlightOn : ''} >                
                    <a className={styles.linkOptions} href="#" id='teachers' onClick={handleClick}>Teachers</a>
                </div>
                <div className={activeLink === 'students' ? styles.highlightOn : ''} >                
                    <a className={styles.linkOptions} href="#" id='students' onClick={handleClick}>Students</a>
                </div>
                <div className={activeLink === 'settings' ? styles.highlightOn : ''} >                
                    <a className={styles.linkOptions} href="#" id='settings' onClick={handleClick}>Settings</a>
                </div>
                <div className={activeLink === 'logOut' ? styles.highlightOn : ''} >                
                    <a className={styles.linkOptions} href="#" id='logOut' onClick={handleClick}>Log Out</a>
                </div>
            </div>
        </nav>

    )
}

export default NavigationBar