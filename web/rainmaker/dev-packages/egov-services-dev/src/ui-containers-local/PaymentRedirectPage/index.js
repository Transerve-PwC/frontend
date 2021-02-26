import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { httpRequest } from "../../ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSearchResultsView,getSearchResultsViewForRoomBooking } from "../../ui-utils/commons";
import {
    downloadReceipt,
    downloadCertificate,
    
} from "../../ui-config/screens/specs/utils";

class PaymentRedirect extends Component {
    updateApiCall = async (apiUrl, urlPayload, payload,consumerCode,tenantId,transactionId,bookingType)=>{
        const res= await  httpRequest(
              "post",
              apiUrl,
              "",
              [],
              { UrlData: urlPayload, 
                  Booking: payload,
              }
          );
          this.props.setRoute(
              `/egov-services/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&secondNumber=${transactionId}&businessService=${bookingType}`
          );
      
      }
    componentDidMount = async () => {
        let { search } = this.props.location;
        const txnQuery = search
            .split("&")[0]
            .replace("eg_pg_txnid", "transactionId");
        try {
            let pgUpdateResponse = await httpRequest(
                "post",
                "pg-service/transaction/v1/_update" + txnQuery,
                "_update",
                [],
                {}
            );

            console.log("pgUpdateResponse", pgUpdateResponse);
            let consumerCode = get(
                pgUpdateResponse,
                "Transaction[0].consumerCode"
            );
            let tenantId = get(pgUpdateResponse, "Transaction[0].tenantId");
            let transactionStatus = get(
                pgUpdateResponse,
                "Transaction[0].txnStatus"
            );
            let transactionId = get(pgUpdateResponse, "Transaction[0].txnId");
            let bookingType = get(
                pgUpdateResponse,
                "Transaction[0].productInfo"
            );

            if (
                transactionStatus === "FAILURE" ||
                transactionStatus === "failure"
            ) {
                this.props.setRoute(
                    `/egov-services/acknowledgement?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&businessService=${bookingType}`
                );
            } else {
                var newPayload= {}
                let payload={}
                let apiUrl=""
                if(bookingType==='BKROOM'){
                    
                    let response = await getSearchResultsViewForRoomBooking([
                      { key: "applicationNumber", value: consumerCode },
                    ]);

                    let newResponse = get(response, "communityCenterRoomBookingMap", []);
    
                    Object.assign(newPayload, newResponse)
                  
                    payload = newPayload[Object.keys(newPayload)[0]];
                    if(payload.roomsModel.length>=2){
                        
                        let lastItem = payload.roomsModel[payload.roomsModel.length - 1]
                        let lastSecondItem = payload.roomsModel[payload.roomsModel.length - 2]
                        if(lastItem.roomApplicationNumber===lastSecondItem.roomApplicationNumber && lastItem.roomApplicationStatus===lastSecondItem.roomApplicationStatus){
                            
                            set(
                                lastItem,
                                "action",
                                "APPLY"
                                   
                            );
                            set(
                                lastSecondItem,
                                "action",
                                "APPLY"
                                   
                            );
    
                        set(lastItem, "roomPaymentStatus", transactionStatus);
                        set(lastSecondItem, "roomPaymentStatus", transactionStatus);
                        let newRoomObject=[lastSecondItem,lastItem]
                        payload.roomsModel= newRoomObject
                       
                        }else {
                            let tempRoomModel = payload.roomsModel[payload.roomsModel.length - 1]
                            delete payload.roomsModel
                            let newRoomObject=[tempRoomModel]
                            payload.roomsModel=newRoomObject
                            
                          
                        set(
                            payload.roomsModel[0],
                            "action",
                            "APPLY"
                               
                        );
                        
                        set(payload.roomsModel[0], "roomPaymentStatus", transactionStatus);
                        }
                        
                        set(payload, "financeBusinessService", "BKROOM");
                        set(payload, "roomBusinessService", "BKROOM");
                        apiUrl = "/bookings/community/room/_update";
    
                    

                    }else {
                        let tempRoomModel = payload.roomsModel[payload.roomsModel.length - 1]
                        
                        let newRoomObject=[tempRoomModel]
                        payload.roomsModel=newRoomObject
                        let bkAction = ""
                    set(
                        payload.roomsModel[0],
                        "action",
                        "APPLY"
                           
                    );
                    
                    set(payload.roomsModel[0], "roomPaymentStatus", transactionStatus);
                    }
                    
                    set(payload, "financeBusinessService", "BKROOM");
                    set(payload, "roomBusinessService", "BKROOM");
                    apiUrl = "/bookings/community/room/_update";

                }else{
                    let response = await getSearchResultsView([
                        { key: "tenantId", value: tenantId },
                        { key: "applicationNumber", value: consumerCode },
                    ]);
    
                    let paymentStatus = get(
                        response.bookingsModelList[0],
                        "bkPaymentStatus",
                        ""
                    );
                    payload = response.bookingsModelList[0];
    
                    let bkAction = ""
                    set(
                        payload,
                        "bkAction",
                        bookingType === "OSBM" || bookingType === "OSUJM"
                            ? "PAY"
                            : bookingType === "GFCP"
                            ? "APPLY"
                            : bookingType === "PACC"
                            ? paymentStatus === "SUCCESS" || paymentStatus === "succes" ? "MODIFY" : "APPLY"
                            : "PAIDAPPLY"
                    );
                    set(payload, "bkPaymentStatus", transactionStatus);
                    apiUrl = "/bookings/api/_update";
                    if(bookingType === "PACC"){
                        apiUrl = 'bookings/park/community/_update';
                        if(payload.bkApplicationStatus == "RE_INITIATED"){
                          payload.bkFromDate = payload.bkStartingDate;
                          payload.bkToDate = payload.bkEndingDate;
                        }
                    }
                    
                }
               
               
               
                if(bookingType !== "BWT"){
                let paymentReceipt= await downloadReceipt(payload, consumerCode, tenantId, 'true')
               
                let permissionLetter= await downloadCertificate(payload, consumerCode, tenantId, 'true')
                                
                Promise.all(paymentReceipt).then(data=>{
                    let urlPayload={
                        "paymentReceipt" :  data[0]
                    }

                    Promise.all(permissionLetter).then(permissionLetterData=>{

                        urlPayload= {
                            ...urlPayload, 
                            "permissionLetter": permissionLetterData[0]
                        }
                        console.log(urlPayload, "payload")
                        this.updateApiCall(apiUrl, urlPayload, payload,consumerCode,tenantId,transactionId,bookingType)
                
                    })
                })
                } else if(bookingType === "BWT"){
                   
                    let paymentReceipt= await downloadReceipt(payload, consumerCode, tenantId, 'true')
                                    
                    Promise.all(paymentReceipt).then(data=>{
                        let urlPayload={
                            "paymentReceipt" :  data[0]
                        }
    
                       
                            console.log(urlPayload, "payload")
                            this.updateApiCall(apiUrl, urlPayload, payload,consumerCode,tenantId,transactionId,bookingType)
                    
                        })
                

                } 
              
        }
        } catch (e) {
            console.log(e);
        }
    };
    render() {
        return <div />;
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setRoute: (route) => dispatch(setRoute(route)),
    };
};

export default connect(null, mapDispatchToProps)(withRouter(PaymentRedirect));


