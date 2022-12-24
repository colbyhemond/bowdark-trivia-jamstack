import { useState } from 'react'
import BowdarkLight from './BowdarkLight'


const SVGCanvas = ({channel}) => {
    const [counter, setCounter] = useState(0)
    const [lights, setLights] = useState([])

    //subscribe to an event to trigger this
    const handleAnimate = () => {
        
        let newCounter = counter + 1
        
        setLights([...lights, {counter: newCounter, visible: true}])
        setCounter(newCounter)
    }

    const handleDisappear = (oldLight) => {
        let index = lights.findIndex(light => light.counter === oldLight.counter)
        // let lightsClone = [...lights]

        let removedItem = lights.splice(index, 1)

        // setLights(lightsClone)
    }

    channel.subscribe('fire-icon', (data) => {
        console.log(data);
        handleAnimate()
    })
    
    return (<>
        {/* <div>
            <button className='btn btn-error' onClick={handleAnimate}>Animate</button>
        </div> */}
        <svg id={`svg-viewbox-${counter}`} viewBox='0 0 100 42' className='absolute pointer-events-none'>
            {lights.map((light) => {
                if (light.visible) {
                    return(<BowdarkLight counter={light.counter} onDisappear={handleDisappear}/>)
                }
            })}
            
        </svg>
    </>)
}

export default SVGCanvas