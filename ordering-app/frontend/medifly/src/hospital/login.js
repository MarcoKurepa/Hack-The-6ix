import {useState} from 'react';
import axios from 'axios';
import ROUTES from '../ROUTES';
import '../client/client.css'

const HospitalLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(undefined);
    const onSubmit = () => {
        axios.post(`${ROUTES.server}/hospital/login`, {
            username: username,
            password: password
        }, {withCredentials: true}).then((response) => {
            if(response.status === 200 && response.data.success){
                window.location.replace("/hospital")
            } else {
                setMessage("invalid credentials")
            }
        })
    }

    const grayTextbox = {
        backgroundColor: "var(--lightGray)",
        color: "black",
        fontSize: "1em",
        width: 'auto'
    }

    return (
    <div style={{marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', marginTop: "5em", width: '20em'}}>
        {!message || <p style={{color: 'red'}}>{message}</p>}
        <h3>Welcome</h3>
        <p>Log into your hospital account to receive deliveries</p>
        <input type="text" placeholder="username" onChange={(x) => setUsername(x.target.value)} value={username} className="bigRounded" style={grayTextbox}/>
        <br />
        <input type="password" placeholder="password" onChange={(x) => setPassword(x.target.value)} value={password}
        className="bigRounded" style={{...grayTextbox, marginTop: "10px"}}/>
        <br/>
        <input type="button" value="Submit" onClick={onSubmit} className="bigRounded blueHover" style={{marginTop: "2em", fontSize: '1em', color: 'white'}}/>
        <input type="button" value="Register" onClick={() => window.location.replace('/client/register')} className="bigRounded whiteHover" style={{borderColor: 'black', borderWidth: '3px', marginTop: "10px"}}/>
    </div>);
}

export default HospitalLogin;