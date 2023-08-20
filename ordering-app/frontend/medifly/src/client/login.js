import {useState} from 'react';
import axios from 'axios';
import ROUTES from '../ROUTES';
import { Headline } from '../commons';

const CustomerLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(undefined);
    const onSubmit = () => {
        axios.post(`${ROUTES.server}/customer/login`, {
            username: username,
            password: password
        }, {withCredentials: true}).then((response) => {
            if(response.status === 200 && response.data.success){
                window.location.replace("/client")
            } else {
                setMessage("invalid credentials")
            }
        })
    }

    const grayTextbox = {
        backgroundColor: "var(--lightGray)",
        color: "black",
        fontSize: "1em",
        width: 'inherit'
    }

    return (
    <>
    <Headline />
    <div style={{marginLeft: "20px", marginRight: "20px", display: 'flex', flexDirection: 'column', marginTop: "5em"}}>
        {!message || <p style={{color: 'red'}}>{message}</p>}
        <h3>Welcome</h3>
        <p>Log into your account to receive fast medication deliveries</p>
        <input type="text" placeholder="username" onChange={(x) => setUsername(x.target.value)} value={username} className="bigRounded" style={grayTextbox}/>
        <br />
        <input type="password" placeholder="password" onChange={(x) => setPassword(x.target.value)} value={password}
        className="bigRounded" style={{...grayTextbox, marginTop: "10px"}}/>
        <br/>
        <input type="button" value="Submit" onClick={onSubmit} className="bigRounded blueHover" style={{marginTop: "2em", fontSize: '1em', color: 'white'}}/>
        <input type="button" value="Register" onClick={() => window.location.replace('/client/register')} className="bigRounded whiteHover" style={{borderColor: 'black', borderWidth: '3px', marginTop: "10px"}}/>
    </div>
    </>);
}

export default CustomerLogin;