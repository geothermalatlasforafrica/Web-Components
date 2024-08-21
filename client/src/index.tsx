import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import App from './App';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {About} from './routes/about';
import {MapComponent} from './routes/map';
import {Data} from './routes/data';
import {Home} from "./routes/home";


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route index element={<Home/>}/>
                    <Route path="/map" element={<MapComponent/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/data" element={<Data/>}/>
                </Route>
                <Route path='*' element={<p>Not found</p>} />
            </Routes>
        </BrowserRouter>
    </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
