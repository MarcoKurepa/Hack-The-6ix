import {useState, useEffect} from 'react';
import axios from 'axios';
import ROUTES from '../ROUTES';
import HospitalLogin from './login';
import { Headline } from '../commons';
axios.defaults.withCredentials = true;

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

    const verticalFlex = {
        display: 'flex',
        flexDirection: 'column'
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

        const options = nex[req.status].map((el) => <input type="button" value={el} onClick={() => updateRequest(req.id, el)} style={{border: 'solid 2px black', borderRadius: '10px'}} className="defaultWhite hoverGray"/>)
        return <>
            <div style={{...verticalFlex}}>
                <h3>Request to {req.username}: {req.medication}</h3>
                <p>{Math.abs(lat_dist.toFixed(2))} km {lat_dist > 0 ? "North" : "South"}, {Math.abs(long_dist.toFixed(2))} km {long_dist > 0 ? "East" : "West"}</p>
            </div>
            <div style={{...verticalFlex, marginLeft: '20px'}}>
                <p>Currently {req.status}</p>
                <div style={{display: 'flex', justifyContent: 'stretch', height: '100%', gap: '10px'}}>
                    {options}
                </div>
            </div>
        </>
    }

    if(!info) return <>Loading...</>
    else {
        return <div style={{...verticalFlex, marginLeft: '20px', marginRight: '20px', marginTop: '5em', gap:'15px'}}>
            <h1>Welcome {info.name}</h1>
            {info.requests.map((el, ind) => <div key={ind} style={{display: 'flex', border: 'solid 2px red', borderRadius: '10px', padding: '10px'}}>{toElem(el)}</div>)}
        </div>
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
        return <>
            <Headline loggedIn={false}/>
            <HospitalLogin />
        </>
    } else {
        return <>
            <Headline loggedIn={true} logOutLocation='/hospital'/>
            <Dashboard />
        </>
    }
}

const App = () => {
    return <>
        <Content />
    </>
}

export default App;