const SplashScreen = () => {
    document.body.style = "background-color: var(--lightBlue); height: 100%"
    document.getElementById("html").style = "height: 100%"
    document.getElementById("root").style = "height: 100%"

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        justifyContent: 'center',
        textAlign: 'center',
        height: "100%"
    }}>
        <h1 style={{width: '100%', fontSize: '4em', marginBottom: "0", marginTop: "0"}}>MediFLY</h1>
        <p style={{fontSize: '1em', marginBottom: "3em"}}>Get care fast and efficiently</p>
        <div style={{display: 'flex', alignItems: 'stretch'}}>
            <div style={{flex: '1 1 1', width: '50%'}}>
                <img style={{width: '15em', position: 'relative', top: "-5em", marginRight: "0"}} src="https://thenounproject.com/api/private/icons/1177286/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0" />
            </div>
            <div style={{flex: '1 1 1', width: '50%', padding: '0'}}>
                <img src="https://www.pngkit.com/png/full/44-444709_hands-up-handsup-png.png" style={{width: '7em'}} />
            </div>
        </div>
        <div style={{marginLeft: '30px', marginRight: '30px'}}>
            <input type="button" className="bigRounded slightBold whiteHover" value="Get Started" onClick={() => window.location.replace('/client/register/')}/>
            <input type="button" className="bigRounded slightBold blueHover" value="Log In" style={{marginTop: "15px"}} onClick={() => window.location.replace('/client/login')}/>
        </div>

    </div>
}

export default SplashScreen;