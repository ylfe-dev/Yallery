import Yallery from '../src/'
import "./App.scss"
import { useState } from 'react';
import images from './portfolio.js';

const options = {
    layout: [
        {breakpoint: 0,  columns: 1, gap: {x:10, y:10}},
        {breakpoint: 600,  columns: [1, 1], gap: {x:10, y:10}},
        //{breakpoint: 800,  columns: [1, 1, 1], gap:{x:10, y:10}},
        {breakpoint: 800,  rows: 300, gap:{x:10, y:10}},
        {breakpoint: 1200, columns: [1, 1, 1, 1], gap: {x:10, y:10}},
        {breakpoint: 1500, columns: 5, gap: 15},
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
            {state ? <> <Yallery options={options} images={images.wilder} /> </> : null }
        </>
    )
}

               // <img src={url[10]} alt="big webp" width="600" />

