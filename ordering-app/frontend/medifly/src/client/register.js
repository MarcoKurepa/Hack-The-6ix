import {useState, useEffect} from 'react';
import axios from 'axios';
import ROUTES from '../ROUTES';
import { Headline } from './commons';

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

    const textbox = {
        backgroundColor: "white",
        color: "black",
        fontSize: "1em",
        width: 'inherit',
        borderWidth: '0px 0px 3px 0px',
        borderBottomColor: 'black',
        padding: "10px 30px"
    }

    const verticalFlex = {
        display: "flex",
        flexDirection: "column"
    }

    return <>
        <Headline />
        <div style={{marginTop: "5em", ...verticalFlex, marginLeft: "10px", marginRight: "10px"}}>
            <h2>Let's Get Started</h2>
            <p>Sign up to explore all the different features</p>
            <input type="text" placeholder="username" onChange={(x) => setUsername(x.target.value)} value={username} style={textbox}/>
            <br />
            <input type="password" placeholder="password" onChange={(x) => setPassword(x.target.value)} value={password} style={{...textbox, marginTop: "10px"}}/>
            <br/>
            <input type="button" value="Submit" onClick={onSubmit} className="bigRounded blueHover slightBold" style={{marginTop: "30px", color: "white"}}/>
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
        const elements = allMedication.map((el, ind) => {
            const colorStyle = el.used ? {backgroundColor: 'lightGreen'} : {}
            return <span key={el.name} style={{...colorStyle, textAlign: 'center', padding: "5px", marginTop: "10px", border: "solid 2px black", borderRadius: "5px"}} type="button" onClick={() => toggleChoice(ind)} className={el.used ? "" : "hoverLightGreen"}>{el.name}</span>
        });
        return <div style={{marginTop: "5em", display: "flex", flexDirection: "column", paddingLeft: "20px", paddingRight: "20px"}}>
            {elements}
            <input type="button" value="next" onClick={sendChoices} className="bigRounded grayHover slightBold" style={{marginTop: "10px"}}/>
        </div>
    }
}

export const ActivationPage = () => {
    const [uuid, setUUID] = useState(undefined)

    const next = () => {
        document.cookie = `prev-link=${window.location.origin}/client; SameSite=Lax; path=/`
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