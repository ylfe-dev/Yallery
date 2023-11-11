import {Yallery} from '../src/'
import "./App.scss"
import { useState } from 'react';
import image_list from './portfolio.js';

const options = {
    layout: [
        {breakpoint: 600,  columns: [1, 1], gap: {x:10, y:10}},
        {breakpoint: 900,  rows: 300, gap:10},
        {breakpoint: 1200, columns: [1, 1, 1, 1], gap: {x:10, y:10}},
        {breakpoint: 1800, columns: 5, gap: 15},
        {breakpoint: 2200, rows: 400}
    ],
 }


export function App() {
    const [state, setState] = useState(true);
   
    const clickHandler = () =>{
        setState(!state);
    }

    return (
        <>
            <button onClick={clickHandler}>Toggle</button>
            <p>{state? "on" : "off"}</p>
            {state ? <> <Yallery options={options} images={image_list} /> </> : null }
        </>
    )
}

               // <img src={url[10]} alt="big webp" width="600" />

