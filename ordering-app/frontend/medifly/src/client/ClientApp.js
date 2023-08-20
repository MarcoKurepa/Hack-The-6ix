import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import ROUTES from '../ROUTES';
import {Routes, Route, Navigate} from 'react-router-dom';
import {RegisterPage, ActivationPage} from './register';
import CustomerLogin from './login';
import SplashScreen from './SplashScreen';
import './client.css'

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

    return <span onClick={() => setSendingRequest(true)}>{name}</span>
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

    return <div>
        {allMedication !== undefined && allMedication.map((el) =>             
        <span key={el}>
                <RequestButton sentRequest={sentRequest} setSent={setSentRequest} name={el} />
                <br />
        </span>)}
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

    let emEl = <input type="button" value="Emergency" onClick={emergency} />
    if(isEmergency && emergencyMedication){
        emEl = <div>
        {emergencyMedication.map((el) => 
            <span key={el}>
                <RequestButton sentRequest={sentRequest} setSent={setSentRequest} name={el} />
                <br />
            </span>)}
        </div>
    }

    return <>
        {emEl}
        <br />
        <input type="button" value="Search" onClick={search} />
    </>
}

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
            window.location.replace('/client');
        })
    }
    return <div style={style}><input type="button" style={buttonStyle} value="Logout" onClick={logOut}/></div>
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
            <NavBar />
            <Routes>
                <Route path="/activate" element={<ActivationPage />} />
                <Route path="/*" element = {<Navigate to="/client/activate" />}></Route>
            </Routes>
        </>
    } else {
        return <>
            <NavBar />
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