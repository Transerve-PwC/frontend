import React, { Component } from "react";


export default class TlHowItWorks extends Component {
    render() {
        const url = process.env.REACT_APP_MEDIA_BASE_URL + "/CTL_User_Manual_Citizen.pdf#view=FitH&embedded=true"
        return(
            <div style={{height: "100vh"}}>
            <iframe
              frameBorder="0"
              width = "100%"
              height = "90%"
              src={url}
            />
            </div>
        )
    }
}