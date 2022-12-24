import { useState, useEffect } from "react"
import { gsap } from 'gsap'

import { CustomEase } from "gsap/dist/CustomEase";

gsap.registerPlugin(CustomEase);



const BowdarkLight = ({counter, onDisappear}) => {
    const [visible, setVisibility] = useState(true)
    const [imageX, setImageX] = useState(Math.floor(Math.random() * 100))
    const [animationX, setAnimationX] = useState(Math.ceil(Math.random() * 5) * (Math.round(Math.random()) ? 1 : -1))

    console.log('hi there');
    console.log(counter);

    const runAnimation = () => {
        gsap.to(`#lightbulb-${counter}`, { 
            duration: 3,
            ease: CustomEase.create("custom", "M0,1,C0,0.85,0.046,0.014,0.148,0.014,0.268,0.014,0.448,0.963,0.456,1,0.464,0.985,0.491,0.873,0.532,0.811,0.587,0.726,0.627,0.765,0.64,0.774,0.716,0.824,0.719,0.981,0.726,0.998,0.788,0.914,0.84,0.936,0.859,0.95,0.878,0.964,0.897,0.985,0.911,0.998,0.922,0.994,0.939,0.984,0.954,0.984,0.969,0.984,1,1,1,1"), 
            y: 82,
            x: animationX, 
            rotation: 1080, 
            transformOrigin:"center center" });
    setTimeout(() => {
        setVisibility(false)
        onDisappear({counter: counter, visible: false})
    }, 7000)
    }

    if (counter === 0) {
        return null
    }

    console.log('test');
    if (visible) {

        setTimeout(() => {
            runAnimation()
        }, 1)

        return (<>
            {/* <svg id={`svg-viewbox-${counter}`} viewBox='0 -60 100 100' className='absolute pointer-events-none'> */}
                <image  id={`lightbulb-${counter}`} x={imageX} y="-50" width="10" height="10" href="/bowdark_logo.svg" />
            {/* </svg> */}
        </>)
    } else {
        return null
    }

    

}

export default BowdarkLight