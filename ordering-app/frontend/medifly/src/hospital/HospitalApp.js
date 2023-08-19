import {useState, useEffect} from 'react';
import axios from 'axios';
import ROUTES from '../ROUTES';
import HospitalLogin from './login';
axios.defaults.withCredentials = true;

// the navbar
const NavBar = () => {
    const style = {
        position: 'sticky',
        top: 0,
        backgroundColor: 'blue',
        display: 'flex'
    }
    const buttonStyle = {
        marginRight: 0,
        marginLeft: 'auto'
    }
    const logOut = () => {
        axios.get(`${ROUTES.server}/logout`).then((response) => {
            window.location.replace('/hospital');
        })
    }
    return <div style={style}><input type="button" style={buttonStyle} value="Logout" onClick={logOut}/></div>
}

const Dashboard = () => {
    
}

const Content = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [loginChecked, setLoginChecked] = useState(false)

    // checking if we're logged in
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

const App = () => {
    return <>
        <NavBar />
        <Content />
    </>
}

export default App;