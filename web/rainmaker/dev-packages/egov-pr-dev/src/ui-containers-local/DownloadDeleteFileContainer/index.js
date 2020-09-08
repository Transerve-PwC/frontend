import React, { Component } from "react";
import { MultiDownloadCard } from "egov-ui-framework/ui-molecules";
//import { MultiCardDownloadGrid } from "../../ui-molecules-local/MultiCardDownloadGrid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { httpRequest, baserequestURL } from "../../ui-utils";
import { getTenantId, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import {  getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { connect } from "react-redux";
import get from "lodash/get";
import "./index.scss";
import "./index.css";
import store from "ui-redux/store";
import {  showHideAdhocPopupopmsReject } from "../../ui-config/screens/specs/utils";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField  } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const styles = {
  whiteCard: {
    maxWidth: 250,
    backgroundColor: "#FFFFFF",
    paddingLeft: 8,
    paddingRight: 0,
    paddingTop: 11,
    paddingBottom: 0,
    marginRight: 16,
    marginTop: 16
  },
  subtext: {
    paddingTop: 7
  },
  body2: {
	wordWrap: "break-word",
	wordBreak: "break-all",
  }
};

const documentTitle = {
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  fontSize: "16px",
  fontWeight: 400,
  letterSpacing: "0.67px",
  lineHeight: "19px",
  wordBreak: "break-all",
};

class DownloadDeleteFileContainer extends Component {
handleEvent1=(fileid)=>{
	store.dispatch(prepareFinalObject("fileid",fileid));

	showHideAdhocPopupopmsReject(store.getState(), store.dispatch, "library-summary", "pressMaster")

}
  handleEvent = (fileid) => {

   // alert("Bind Delete API : File ID" + fileid);
		if(confirm("Are you sure you want to remove this media?"))
	{
		let tenantId = getTenantId();
		let invitedGuestlist = [];
		var data_result="";
		let eventId = getQueryArg(window.location.href, "eventuuId"); 
		let mdmsBody = {
					"tenantId": tenantId,
					"moduleCode":localStorageGet("modulecode"),   
					"eventDetailUuid": eventId,
					"documentList":[
									  {
									   "documentType":"",
									   "documentId":[
										{
										 "fileStoreId":fileid
										}
									   ]
									  }
								  ]
		};
		
		 console.log(mdmsBody)
		try {
		let payload = null;
		let delete_api = baserequestURL+"/prscp-services/v1/library/_delete";
		payload =  httpRequest("post", delete_api, "_delete", [], { RequestBody: mdmsBody }).then(response => {
		console.log("responseeeeeeeeee");
		;
		console.log(response)
		if(response.ResponseInfo.status === "Success")
		{
			window.location.reload();
		}
		else
		{
			alert("Internal Error, Try Again!")
		}
	
			}).catch(error => {
			alert("Invalid Request")
		  });
	  } catch (e) {
		console.log(e);
	  }
	}
	else{
		return false;
	}		
  };

 
  render() {
    const { data, documentData, ...rest } = this.props;
	//console.log("documentDataaaaaaaaaaa");
	//console.log(documentData);
	console.log("dataaaaaaaaaaaaa1111111");
	console.log(data);
	console.log(documentData);
	//console.log(documentData[0].fileStoreId);
	let fileid = '';
	if(data[0])
	{
		fileid = data[0]
	}
	
	
    return (
	<div class="deletemediacontainer">	 
     
    
	  { fileid ?  
				  <Grid container {...rest}>
				  {data && data.length && data.map((item, key) => {
					return (
					
						
					  <Grid
						item
						container
						xs={12}
						sm={4}
						className="background-grey"
						style={{padding: "15px 35px 15px 15px", margin:"10px", background:"#fff"}}
					  >
					  <Grid xs={12}>
					  <Button  class="deletemedia" data={fileid} onClick={() => {this.handleEvent1(item.fileStoreId)}} documentData={documentData} {...rest}  style={{border:"none",position:"relative",margin:"0% 90%",width:"50px",color:"RED",background:"TRANSPARENT"}}> <span class="material-icons"><i class="material-icons">clear</i></span></Button>
					  </Grid>
						<Grid xs={12}>
						  <LabelContainer
							labelName={item.title}
							labelKey={item.title}
							style={documentTitle}
						  />
						</Grid>
						<Grid xs={6} container>
						  <Grid xs={12} className="subtext">
							<Typography className="NAME">{item.name}</Typography>
						  </Grid>
						 
						</Grid>
						 <Grid xs={6} align="right">
							{/* <Button href={item.link} color="primary" style={{position:"relative",margin:"0% 85%"}}> */}
							<Button href={item.link} color="primary" style={{position:"relative"}}>
							  {/* {item.linkText} */}
							  Download
							</Button>
						  </Grid>
					  </Grid>
					);
				  })}
				</Grid> 
			: "Media Not Uploaded" }	
	</div>  
	
    );
	 
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const data = ownProps.data
    ? ownProps.data
    : get(screenConfiguration.preparedFinalObject, ownProps.sourceJsonPath, []);
  return { data };
};

export default connect(
  mapStateToProps,
  null
)(DownloadDeleteFileContainer);
