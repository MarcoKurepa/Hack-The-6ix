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

    const populateData = () => {
        const url = `${ROUTES.server}/hospital/info`
        axios.get(url, {withCredentials: true}).then((response) => {
            if(response.status === 200){
                setInfo(response.data)
            }
        })
    }
    useEffect(populateData, [])
    const updateRequest = (id, status) => {
        axios.post(`${ROUTES.server}/hospital/update_status`, {
            id: id,
            status: status
        }, {withCredentials: true}).then((res) => {
            if(res.status === 200 && res.data.message === "success"){
                populateData()
            }
        })
    }

    const toElem = (req) => {
        const lat_dist = 111 * (req.latitude - info.latitude)
        const long_dist = 111 * (req.longitude - info.longitude) * Math.cos(info.latitude * Math.PI / 180)
        const nex = {
            Pending: ["Approved", "Rejected"],
            Approved: ["Completed"], 
            Rejected: [],
            Completed: []
        }
        
        const options = nex[req.status].map((el) => <input type="button" value={el} onClick={() => updateRequest(req.id, el)} />)
        return <>
            <h3>Request to {req.username}: {req.medication}</h3>
            <p>{Math.abs(lat_dist.toFixed(2))} km {lat_dist > 0 ? "North" : "South"}, {Math.abs(long_dist.toFixed(2))} km {long_dist > 0 ? "East" : "West"}</p>
            <p>Currently {req.status}</p>
            {options}
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