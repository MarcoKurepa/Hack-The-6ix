import axios from 'axios';
import ROUTES from './ROUTES';

export const Headline = ({loggedIn=false, logOutLocation='/client'}) => {
    const logOut = () => {
        axios.get(`${ROUTES.server}/logout`).then((response) => {
            window.location.replace(logOutLocation);
        })
    }
    const cuteRound = {
        backgroundColor: "white",
        color: "black",
        fontSize: "1em",
        borderRadius: "20px"
    }
    return <div style={{backgroundColor: "var(--lightBlue)", marginTop: "0px", position: 'absolute', top: '0', width: "100%", display: 'flex'}}>
        <div style={{flex: "1 1 0px"}}></div>
        <h2 style={{color: 'white', textAlign: 'center', flex: "1 1 0px"}}>MediFLY</h2>
        <div style={{flex: "1 1 0px", display: "flex", flexDirection: "row-reverse"}}>
            {loggedIn && <input type="button" style={{margin: "10px", paddingLeft: "2em", paddingRight: "2em", ...cuteRound}} value="Logout" onClick={logOut}/>}
        </div>
    </div>
}