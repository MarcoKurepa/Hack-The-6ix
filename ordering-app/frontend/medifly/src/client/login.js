import {useState} from 'react';
import axios from 'axios';
import ROUTES from '../ROUTES';

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
    return (
    <div>
        {!message || <p>{message}</p>}
        <input type="text" placeholder="username" onChange={(x) => setUsername(x.target.value)} value={username} />
        <br />
        <input type="password" placeholder="password" onChange={(x) => setPassword(x.target.value)} value={password} />
        <br/>
        <input type="button" value="Submit" onClick={onSubmit}/>
        <a href="/client/register">Register</a>
    </div>);
}

export default CustomerLogin;