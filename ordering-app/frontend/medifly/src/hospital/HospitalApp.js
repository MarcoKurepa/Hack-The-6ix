import {useState, useEffect} from 'react';
import axios from 'axios';
import ROUTES from '../ROUTES';
import HospitalLogin from './login';
axios.defaults.withCredentials = true;

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [loginChecked, setLoginChecked] = useState(false)
    useEffect(() => {
        const url = `${ROUTES.server}/hospital/logged-in`;
        axios.get(url, {withCredentials: true}).then((response) => {
            setLoginChecked(true);
            if(response.status === 200){
                setLoggedIn(response.data.loggedIn);
            }
        }).catch(() => setLoginChecked(true));
    }, [])
    if(!loginChecked) return <>Loading...</>
    else if(!loggedIn) {
        return <HospitalLogin />
    } else {
        return <>Logged in</>
    }
}

export default App;