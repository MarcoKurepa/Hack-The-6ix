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
    const [info, setInfo] = useState(undefined)

    useEffect(() => {
        const url = `${ROUTES.server}/hospital/info`
        axios.get(url, {withCredentials: true}).then((response) => {
            if(response.status === 200){
                setInfo(response.data)
            }
        })
    }, [])

    const toElem = (el) => {
        const lat_dist = 111 * (el.latitude - info.latitude)
        const long_dist = 111 * (el.longitude - info.longitude) * Math.cos(info.latitude * Math.PI / 180)
        return <>
            <h3>Request to {el.username}: {el.medication}</h3>
            <p>{Math.abs(lat_dist.toFixed(2))} km {lat_dist > 0 ? "North" : "South"}, {Math.abs(long_dist.toFixed(2))} km {long_dist > 0 ? "East" : "West"}</p>
        </>
    }

    if(!info) return <>Loading...</>
    else {
        return <>
            <h1>Welcome {info.name}</h1>
            {info.requests.map((el, ind) => <div key={ind}>{toElem(el)}</div>)}
        </>
    }
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
        return <Dashboard />
    }
}

const App = () => {
    return <>
        <NavBar />
        <Content />
    </>
}

export default App;