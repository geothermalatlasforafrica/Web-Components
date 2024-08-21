import './App.css';
import './scss/custom.css'
import {Outlet} from "react-router-dom";
import React, {useState} from "react";
import Navbar from "./components/navbar";
import Toaster from "./components/toaster";
import {ToastInformation} from "./custom-types/toast-information";


function App() {
    const [toasts, setToasts] = useState<ToastInformation[]>([]);
    function addToast(toast: ToastInformation) {
        setToasts(toasts => [...toasts, toast])
    }

    function removeToast(toastUuid: string) {
        setToasts(toasts.filter(t => t.uuid !== toastUuid));
    }

    return (
        <div className="container-fluid d-flex flex-column vh-100">
            <Toaster toasts={toasts} onRemoveToast={removeToast}/>
            <Navbar />
            <Outlet />
        </div>
    );
}

export default App;
