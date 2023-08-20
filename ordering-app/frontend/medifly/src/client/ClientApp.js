import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import ROUTES from '../ROUTES';
import {Routes, Route, Navigate} from 'react-router-dom';
import {RegisterPage, ActivationPage} from './register';
import CustomerLogin from './login';
import SplashScreen from './SplashScreen';
import './client.css'
import { Headline } from './commons';
import emergencyButton from './emergency.png';
import searchButton from './search.png';

axios.defaults.withCredentials = true;
const LocationContext = React.createContext()

const RequestButton = ({sentRequest, setSent, name}) => {
    const curLocation = React.useContext(LocationContext)
    const curMedication = name
    const [sendingRequest, setSendingRequest] = useState(false)

    useEffect(() => {
        if(sendingRequest && curMedication && curLocation && !sentRequest){
            axios.post(`${ROUTES.server}/submit-request/`, {
                long: curLocation.coords.longitude, 
                lat: curLocation.coords.latitude, 
                medication: curMedication
            }, {withCredentials: true}).then((res) => {
                if(res.status === 200 && res.data.message === "success"){
                    alert("Success!")
                    window.location.replace('/client/status')
                } else {
                    alert("Something went wrong")
                }
            })
            setSent(true)
        }
    }, [curLocation, curMedication, sendingRequest, sentRequest, setSent])

    return <span style={{backgroundColor: 'white', padding: '10px', color: 'black', marginTop: '10px', borderRadius: '10px', fontWeight: 'bolder', textAlign: 'center'}} onClick={() => setSendingRequest(true)}>{name}</span>
}

const SearchPage = () => {
    const [allMedication, setAllMedication] = useState(undefined)
    const [sentRequest, setSentRequest] = useState(false)

    useEffect(() => {
        axios.get(`${ROUTES.server}/medications`, {withCredentials: true}).then((res) => {
            if(res.status === 200){
                setAllMedication(res.data.medications)
            }
        })
    }, [])

    return <div style={{display: 'flex', flexDirection: 'column', paddingTop: '5em', backgroundColor: 'var(--lighterBlue)', paddingLeft: '20px', paddingRight: '20px'}}>
        {allMedication !== undefined && allMedication.map((el) =>             
        <RequestButton key={el} sentRequest={sentRequest} setSent={setSentRequest} name={el} />)}
        <input type="button" value="Home" onClick={() => window.location.replace("/client")}/>
    </div>
}

const StatusPage = () => {
    const [requests, setRequests] = useState(undefined)
    useEffect(() => {
        axios.get(`${ROUTES.server}/customer/requests`, {withCredentials: true}).then((res) => {
            if(res.status === 200){
                setRequests(res.data.requests)
            }
        })
    }, [])
    if(requests === undefined) return <>Loading...</>
    else {
        const els = requests.map((el, ind) => 
            <div key={ind}>
                <h1>{el.medication}</h1>
                <p>From {el.hospitalName}</p>
                <p>Status: {el.status}</p>
            </div>
        )
        return els
    }
}

const Dashboard = () => {
    const [isEmergency, setIsEmergency] = useState(false)
    const [emergencyMedication, setEmergencyMedication] = useState(undefined)

    const [sentRequest, setSentRequest] = useState(false)

    useEffect(() => {
        axios.get(`${ROUTES.server}/customer/important-medication`, {withCredentials: true}).then((res) => {
            if(res.status === 200){
                setEmergencyMedication(res.data.medicine)
            }
        })
    }, [])

    const emergency = () => {
        setIsEmergency(true)
    }

    const search = () => {
        window.location.replace("/client/search")
    }

    let emEl = <img src={emergencyButton} alt="Emergency" style={{borderRadius: "40px", boxShadow: "10px 10px 10px black", width: "90%", textAlign: 'center', marginTop: "30px", marginLeft: 'auto', marginRight: 'auto'}} onClick={emergency} />
    if(isEmergency && emergencyMedication){
        emEl = <div style={{backgroundColor: "var(--red)", borderRadius: "40px", marginTop: "40px", color: "white", display: 'flex', flexDirection: 'column', padding: "20px"}}>
            <h2>Emergency Medication Options</h2>
        {emergencyMedication.map((el) => 
            <RequestButton key={el} sentRequest={sentRequest} setSent={setSentRequest} name={el} />)}
        </div>
    }

    return <>
        <div style={{display: 'flex', flexDirection: 'column', marginTop: "5em", marginLeft: "50px", marginRight: "50px", textAlign: 'center'}}>
            {emEl}
            <br />
            <img src={searchButton} alt="Search" onClick={search} style={{marginTop: "30px"}}/>
        </div>
    </>
}

const Content = () => {
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
                setNeedCompletion(!response.data.registrationCompleted)
            }
        }).catch(() => setLoginChecked(true));
    }, [])

    if(!loginChecked) return <>Loading...</>
    else if(!loggedIn){
        return <Routes>
            <Route path="/register" element={<RegisterPage />}/>
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/" element={<SplashScreen />} />
            <Route path="/*" element={<Navigate to="/client" />} />
        </Routes>
    } else if(loggedIn && needCompletion){
        return <>
            <Headline loggedIn={true}/>
            <Routes>
                <Route path="/activate" element={<ActivationPage />} />
                <Route path="/*" element = {<Navigate to="/client/activate" />}></Route>
            </Routes>
        </>
    } else {
        return <>
            <Headline loggedIn={true}/>
            <Routes>
                <Route path="/register" element={<RegisterPage />}/>
                <Route path="/login" element={<CustomerLogin />} />
                <Route path="/activate" element={<ActivationPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/status" element={<StatusPage />} />
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </>
    }
}

const App = () => {
    const [curLocation, setCurLocation] = useState(undefined)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setCurLocation(pos)
            navigator.geolocation.watchPosition(setCurLocation)
        })
    }, [])

    return <LocationContext.Provider value={curLocation}>
        <Content />
    </LocationContext.Provider>
}

export default App;