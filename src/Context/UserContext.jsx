<<<<<<< HEAD
import { createContext, useState } from "react"

export let CounterContext = createContext(0)

function CounterContextProvider(props) {

    const { counter, setCounter } = useState(0)

    return <CounterContext.Provider value={{ counter, setCounter }}>

        {props.children}

    </CounterContext.Provider>
=======
import { createContext, useEffect, useState } from "react";

export let UserContext = createContext();

export default function UserContextProvider(props) {
  const [userLogin, setUserLogin] = useState(null);

    useEffect(() => {
      if (localStorage.getItem("userToken") !== null) {
        setUserLogin(localStorage.getItem("userToken"));
      }
    }, []);

  return (
    <UserContext.Provider value={{ userLogin, setUserLogin }}>
      {props.children}
    </UserContext.Provider>
  );
>>>>>>> 0fae21a (Add user profile code)
}
