import { useRef, useEffect } from 'react'

export default function useResizeObserver(callback, frequency = 0) {
	const elementRef = useRef(null);

	const timerRef = useRef(undefined);
    const dataRef = useRef(undefined)

    function onResize(data) {
       // console.log(data)
        if (dataRef.current === undefined){
            dataRef.current = data;
            callResize();
        } else {
            dataRef.current = data;
            if (frequency && timerRef.current === null)
                timerRef.current = setTimeout(callResize, 1000/frequency);
            else if (!frequency)
                callResize();
        }
    }

    function callResize(){
        callback(dataRef.current);
        timerRef.current = null;
    }

	useEffect(()=>{
        console.log("Init observer");
	    const observer = new ResizeObserver(([entry]) => onResize(entry.contentRect))
	    elementRef.current && observer.observe(elementRef.current);
	    return () => {
            console.log("disconnect observer")
            observer.disconnect();
        }
	  },[]);

	return elementRef;
}
