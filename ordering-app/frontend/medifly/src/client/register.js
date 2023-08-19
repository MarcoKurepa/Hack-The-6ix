import {useState, useEffect} from 'react';
import axios from 'axios';
import ROUTES from '../ROUTES';

export const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = () => {
        axios.post(`${ROUTES.server}/customer/register`, {
            username: username,
            password: password
        }, {withCredentials: true}).then((response) => {
            if(response.status === 200 && response.data.message === "success"){
                window.location.replace("/client/activate")
            } else {
                
            }
        })
    }

    return <>
        <h1>Register as a customer</h1>
        <div>
            <input type="text" placeholder="username" onChange={(x) => setUsername(x.target.value)} value={username} />
            <br />
            <input type="password" placeholder="password" onChange={(x) => setPassword(x.target.value)} value={password} />
            <br/>
            <input type="button" value="Submit" onClick={onSubmit}/>
        </div>
    </>;
}

const MedicationSelectionPage = (props) => {
    const nextHandler = props.nextHandler

    const [allMedication, setAllMedication] = useState(undefined)
    useEffect(() => {
        axios.get(`${ROUTES.server}/medications`, {withCredentials: true}).then((response) => {
            if(response.status === 200){
                const setTo = response.data.medications.map((el) => ({
                    name: el,
                    used: false
                }));
                setAllMedication(setTo)
            }
        })
    }, [])

    const toggleChoice = (ind) => {
        const copy = [...allMedication]
        copy[ind].used = !copy[ind].used
        setAllMedication(copy)
    }

    const sendChoices = () => {
        axios.post(`${ROUTES.server}/customer/set-medication`, {medication: allMedication.filter((el) => el.used).map((el) => el.name)},
            {withCredentials: true}).then((response) => {
                if(response.status === 200){
                    nextHandler()
                }
            })
    }

    if(allMedication === undefined) return <>Loading...</>
    else {
        const elements = allMedication.map((el, ind) => 
        <span key={el.name}>
            <span style={el.used ? {backgroundColor: 'lightGreen'} : {backgroundColor: 'white'}} type="button" onClick={() => toggleChoice(ind)}>{el.name}</span>
            <br/>
        </span>
        );
        return <div>
            {elements}
            <input type="button" value="next" onClick={sendChoices} />
        </div>
    }
}

export const ActivationPage = () => {
    const [uuid, setUUID] = useState(undefined)

    const next = () => {
        document.cookie = `prev-link=http://${window.location.hostname}/client; SameSite=Lax; path=/`
        window.location.replace(`${ROUTES.server}/videostream`)
    }
    
    useEffect(() => {
        axios.get(`${ROUTES.server}/customer/uuid`, {withCredentials: true}).then((response) => {
            if(response.status === 200){
                setUUID(response.data.uuid);
            }
        })
    }, [])

    if(uuid === undefined){
        return <>Loading...</>
    } else {
        return <>
            <MedicationSelectionPage nextHandler={next} />
        </>

    }
}