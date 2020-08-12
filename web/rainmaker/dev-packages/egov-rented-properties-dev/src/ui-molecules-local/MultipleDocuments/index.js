import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography"
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import {LabelContainer}  from "egov-ui-framework/ui-containers"
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo ,getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import { getFileUrl,getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import moment from 'moment'

const styles = {
    card: {
      paddingTop: 8,
      borderRadius: "inherit"
    },
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
      wordWrap: "break-word"
    }
  };
  
  const documentTitle = {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "0.67px",
    lineHeight: "19px"
  };

  const commentHeader = {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "17px",
    fontWeight: 400,
    letterSpacing: "0.67px",
    lineHeight: "19px"
  }
  const labelHeader = {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "25px",
    fontWeight: 400,
    letterSpacing: "0.67px",
    lineHeight: "19px"
  }

class MultipleDocuments extends Component {

  render() {
      let {data = [], btnhide,contents, classes , dispatch} = this.props
      data = data.filter(dat => !!dat.applicationDocuments)
        if(data.length==0){
        return(
          <Card className="Multiple-card-212">  
          <CardContent>
          <Grid container>
          <Grid xs={12} sm={12} style={{display: "flex", justifyContent: "flex-end"}}>
          <Grid xs={12} sm={12} style={{textAlign: "center"}}>
          <LabelContainer
              labelName= "No transit site images captured."
              style={labelHeader}
          />
          </Grid>
          </Grid>
          </Grid>
          </CardContent>
          </Card>
        )
      }
      return (
          <div>
              {!!data.length && data.map((datum, index) => (
                  <Card className="MultipleOwners-card-212">            
                  <CardContent>
                  <Grid container>
                  <Grid xs={12} sm={12} style={{display: "flex", justifyContent: "flex-end"}}>
                    {btnhide &&
                      (<Grid xs={12} sm={4} style={{textAlign: "right"}}>
                  <Button  mt={1} mr={0} color="primary"  variant="contained"  
                  onClick={() => { 
                    dispatch(setRoute(`/rented-properties/notice-violation?tenantId=${getTenantId()}`)); 
                    dispatch(prepareFinalObject("SingleImage[0]", datum));}}> 
                    Create Violation
                    </Button>
                    </Grid>)
                    } 
                 </Grid>
                 <Grid xs={12} sm={12} >
                  {!btnhide && (<LabelContainer   
                      labelName= "Notice ID : "
                      style={documentTitle}
                  />)
                    }
                  {!btnhide && (<LabelContainer   
                      labelName= {datum.memoNumber ? datum.memoNumber : 'NA'}
                      style={documentTitle}
                  />)
                    }
                  {btnhide && !!datum.notices.length &&  (<Grid xs={6} align="left">
                  <Button color="primary"
                  onClick={() => { 
                    dispatch(setRoute(`/rented-properties/notices?tenantId=${getTenantId()}`)); 
                    }}> 
                     Notice ID : {datum.notices.join(",")}
                    </Button>
                    </Grid>)
                    }
                    <br></br>
                    {!btnhide && (<LabelContainer   
                      labelName= {datum.memoDate ? moment(datum.memoDate).format('dddd, MMMM Do, YYYY h:mm:ss A') : 'NA'}
                      style={documentTitle}
                  />)
                    }
                    {btnhide && 
                      (<LabelContainer   
                        labelName= {moment(datum.auditDetails.createdTime).format('dddd, MMMM Do, YYYY h:mm:ss A')}
                        style={documentTitle}
                    />)
                    }
                    </Grid> 
                      {datum.applicationDocuments.map((content) => (
                          <Grid xs={6} sm={3} 
                          style={{
                              marginBottom: "8px",
                              marginTop: "8px",
                              wordBreak : "break-word"
                            }}>
                           <Grid
                            item
                            container
                            xs={6}
                            sm={4}
                            className={
                               classNames(classes.whiteCard, "background-grey")
                              
                            }
                            >
                          <Grid xs={12}>
                            <LabelContainer
                              labelName= {content.documentType}
                              // labelKey={content.id}
                              style={documentTitle}
                            />
                          </Grid>
                          <Grid container>
                            <Grid xs={6} className={classes.subtext}>
                              {btnhide && (<Typography className={classes.body2}>{!!content.url ? content.url.split("?")[0].split("/").pop().slice(13) : content.fileStoreId ? decodeURIComponent(getFileUrl(content.fileStoreId)).split("?")[0].split("/").pop().slice(13) : ""}</Typography>)}
                            </Grid>
                            <Grid xs={6} align="right">
                              <Button href={!!content.url ? content.url : getFileUrlFromAPI(content.fileStoreId)} color="primary">
                              Download
                              </Button>
                            </Grid>
                          </Grid>
                          </Grid>
                          </Grid>)
                      )}
                  </Grid>
                  <br></br>
                      <LabelContainer
                      labelName= "Comments : "
                      style={commentHeader}
                  />
                  &nbsp;
                   <LabelContainer
                      labelName= {datum.description ? datum.description : 'NA'}
                      style={documentTitle}
                  />
                  </CardContent>
                  </Card>)
                  )}
          </div>
      )
  }
}



export default withStyles(styles)(MultipleDocuments)