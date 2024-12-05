import React, {useEffect} from "react";
import './styles/main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/header";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export const ApiUrl = process.env.NODE_ENV === "production" ? "/api":""

function App() {
    useEffect(() => {
        document.body.classList.add(
            'd-flex',
            'flex-column',
            'min-vh-100'
        )
    })
    console.log()
  return (
    <>
        <Header />
        <ToastContainer />
    </>
  );
}

export default App;
