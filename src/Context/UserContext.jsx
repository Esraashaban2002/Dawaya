import { createContext, useState } from "react"

export let CounterContext = createContext(0)

function CounterContextProvider(props) {

    const { counter, setCounter } = useState(0)

    return <CounterContext.Provider value={{ counter, setCounter }}>

        {props.children}

    </CounterContext.Provider>
}
