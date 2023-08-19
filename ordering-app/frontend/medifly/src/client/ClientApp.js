import {useState, useEffect} from 'react';
import axios from 'axios';
import ROUTES from '../ROUTES';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {RegisterPage, ActivationPage} from './register';
import CustomerLogin from './login';

axios.defaults.withCredentials = true;

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [needCompletion, setNeedCompletion] = useState(false)
    const [loginChecked, setLoginChecked] = useState(false)

    // checking if we're logged in
    useEffect(() => {
        const url = `${ROUTES.server}/customer/logged-in`;
        axios.get(url, {withCredentials: true}).then((response) => {
            setLoginChecked(true);
            if(response.status === 200){
                setLoggedIn(response.data.loggedIn);
                setNeedCompletion(!response.data.registrationComplete)
            }
        }).catch(() => setLoginChecked(true));
    }, [])

    if(!loginChecked) return <>Loading...</>
    else if(!loggedIn){
        return <Routes>
            <Route path="/register" element={<RegisterPage />}/>
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/" element={<Navigate to="/client/login" />}></Route>
        </Routes>
    } else if(loggedIn && needCompletion){
        return <Routes>
            <Route path="/activate" element={<ActivationPage />} />
            <Route path="/" element = {<Navigate to="/client/activate" />}></Route>
        </Routes>
    } else {
        return(
            <Routes>
                <Route path="/register" element={<RegisterPage />}/>
                <Route path="/login" element={<CustomerLogin />} />
                <Route path="/activate" element={<ActivationPage />} />
            </Routes>
        );
    }
}

export default App;