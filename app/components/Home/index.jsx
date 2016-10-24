import React from 'react'
import logo from 'assets/react-logo-2.png'
import s from './styles.scss'

export default function Home() {
    return (
        <div className={s.Home}>
            <h1>Home</h1>
            <div>
                <h3>React logo: </h3>
                <img src={logo} alt="React" />
            </div>
        </div>
    )
}
