import React from "react";
import { Card, CardContent, Grid, Typography, Button,} from "@material-ui/core";
import {
  getQueryArg,
  
} from "egov-ui-framework/ui-utils/commons";
import { Container } from "egov-ui-framework/ui-atoms";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import {

  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import Divider from "@material-ui/core/Divider";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import { withStyles } from "@material-ui/core/styles";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";
import set from "lodash/set";
import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { WFConfig} from "../../ui-utils/sampleResponses"

//import "./index.css";
const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: "#FE7A51"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});

class PensionDataContainer extends React.Component {

  // Construcor(props){
  //   super(props)
  //   this.state ={ open:false}
  //   this.onEditClick = this.onEditClick.bind(this)
  // }
  state = {
    open: false,

  };





  render() {
    
    const { classes, ProcessInstances ,preparedFinalObject,pageName} = this.props;    
    const currentObj =
    ProcessInstances && ProcessInstances[0];    
    let currentObjE = currentObj//[];   
   
    let DOE_INFO_VISIBLE = false;
    let DOP_INFO_VISIBLE = false;
    let RRP_INFO_VISIBLE = false;
    let Register = false
    let revesion = false
    let data = false 
    
    
let businessService = get(ProcessInstances[0], 'pensioner.businessService')

if (pageName ==="REGISTER")
{
  Register = true
  if(currentObjE)
  {
    if(currentObjE.pensionRegister.length === 0)

    data = true

  }
}

if (pageName ==="REVISION")
{
  revesion = true
 
}


//alert(businessService)
if(businessService === WFConfig().businessServiceRRP)
{
  RRP_INFO_VISIBLE = true;
}
 else if(businessService === WFConfig().businessServiceDOE)
 {
     DOE_INFO_VISIBLE = true;
 }
 else if(businessService === WFConfig().businessServiceDOP)
 {
  DOP_INFO_VISIBLE = true;
 }  
     
      let index = 0;
     // let jsonPath = `ProcessInstances[0].pensionRevision[${index}].dropdown.value`;
    return (     
      <div>   
{
            currentObj &&revesion &&(
            <Card>
  <CardContent>
  <Container
               children={
                <div style={{ width: "100%" }}>
                <Grid container="true" spacing={12} marginTop={16}>
                  <Grid
                    style={{ alignItems: "center", display: "flex" }}
                    item
                    sm={6}
                    xs={6}
                  >
                    <Typography component="h2" variant="subheading">
                      <LabelContainer
                        labelName="PENSION_EMPLOYEE_PENSIONER_DATA"
                        labelKey="PENSION_EMPLOYEE_PENSIONER_DATA"
                      />
                     &nbsp;&nbsp;-&nbsp;&nbsp;
                      <LabelContainer
                        labelName="Pension Module"
                        labelKey={`PENSION_MODULE_${businessService}`}
                      />
                    </Typography>
                    <br/>
                  </Grid>
                  </Grid>
                   <Grid container="true" spacing={12} marginTop={16}>
                  <br/>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="name" labelKey="PENSION_EMPLOYEE_NAME" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "PensionersBasicData[0].name")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="code" labelKey="PENSION_EMPLOYEE_CODE" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "PensionersBasicData[0].code")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="dob" labelKey="PENSION_DOB" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={convertEpochToDate(get(currentObj, "PensionersBasicData[0].dob"))} />
          
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="dateOfRetirement" labelKey="PENSION_DOR" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={convertEpochToDate(get(currentObj, "PensionersBasicData[0].dateOfRetirement"))} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="pensionerNumber" labelKey="PENSION_EMPLOYEE_PENSIONER_NUMBER" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "PensionersBasicData[0].pensionerNumber")} />
                    </Typography>
                  </Grid>
                  {
                    (DOP_INFO_VISIBLE || DOE_INFO_VISIBLE)  &&(

                <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="dateOfDeath" labelKey="PENSION_DOD" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={convertEpochToDate(get(currentObj, "PensionersBasicData[0].dateOfDeath"))} />
                    </Typography>
                  </Grid>
                    )
                  }
                  
                  
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="designation" labelKey="PENSION_EMPLOYEE_DESIGNATION" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "PensionersBasicData[0].designation")} />
                    </Typography>
                  </Grid>                 
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="gender" labelKey="PENSION_EMPLOYEE_GENDER" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "PensionersBasicData[0].gender")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="address" labelKey="PENSION_DEPENDENT_ADDRESS" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "PensionersBasicData[0].address")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="bankDetails" labelKey="PENSION_EMPLOYEE_PENSION_BA" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "PensionersBasicData[0].bankDetails")} />
                    </Typography>
                  </Grid> 
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="bankAccountNumber" labelKey="PENSION_EMPLOYEE_PENSION_AN" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "PensionersBasicData[0].bankAccountNumber")} />
                    </Typography>
                  </Grid>             
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="lpd" labelKey="PENSION_EMPLOYEE_PENSION_LPD" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "PensionersBasicData[0].lpd")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="bankIfsc" labelKey="PENSION_BANK_IFSC" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "PensionersBasicData[0].bankIfsc")} />
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="wef" labelKey="PENSION_EMPLOYEE_PENSION_WEF" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={convertEpochToDate(get(currentObj, "PensionersBasicData[0].wef"))} />
                    </Typography>
                  </Grid> */}
                  {
                     (DOP_INFO_VISIBLE || DOE_INFO_VISIBLE) &&(
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="claimantDob" labelKey="PENSION_EMPLOYEE_CLAIMANT_DOB" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={convertEpochToDate(Number(get(currentObj, "PensionersBasicData[0].claimantDob")))} />
                    </Typography>
                  </Grid>
                    )}
                   {
                     (DOP_INFO_VISIBLE || DOE_INFO_VISIBLE) &&(
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="claimantName" labelKey="PENSION_EMPLOYEE_CLAIMANT_NAME" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "PensionersBasicData[0].claimantName")} />
                    </Typography>
                  </Grid>
                    )}
                </Grid>
                </div>

              }
              />

  </CardContent>
</Card>
           
            )}
        {
          DOE_INFO_VISIBLE  && revesion &&(
            <Card>
  <CardContent>
  <Container
              children={
                <div style={{ width: "100%" }}>
                <Grid container="true" spacing={12} marginTop={16}>
                  <Grid
                    style={{ alignItems: "center", display: "flex" }}
                    item
                    sm={6}
                    xs={6}
                  >
                    <Typography component="h2" variant="subheading">
                      <LabelContainer
                        labelName="Pension Calculation Update Details"
                        labelKey="PENSION_PENSION_REVISION_VERIFIED_DATA_DETAILS"
                      />
                     &nbsp;&nbsp;-&nbsp;&nbsp;
                      <LabelContainer
                        labelName="Pension Calculation Update Details"
                        labelKey={`PENSION_MODULE_${businessService}`}
                      />
                    </Typography>
                    <br/>
                  </Grid>
                  </Grid>
                   <Grid container="true" spacing={12} marginTop={16}>
                  <br/>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="nqsYearVerified" labelKey="PENSION_EMPLOYEE_PENSION_NQS_YEAR_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.nqsYear")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="nqsMonthVerified" labelKey="PENSION_EMPLOYEE_PENSION_NQS_MONTH_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.nqsMonth")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="nqsDayVerified" labelKey="PENSION_EMPLOYEE_PENSION_NQS_DAY_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.nqsDay")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="familyPensionI" labelKey="PENSION_EMPLOYEE_PENSION_FAMILYPENSION1_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.familyPensionI")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="familyPensionII" labelKey="PENSION_EMPLOYEE_PENSION_FAMILYPENSIONII_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.familyPensionII")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="additionalPensionVerified" labelKey="PENSION_EMPLOYEE_PENSION_AP_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.additionalPension")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="commutedPensionVerified" labelKey="PENSION_EMPLOYEE_PENSION_CP_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.commutedPension")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="commutedValueVerified" labelKey="PENSION_EMPLOYEE_PENSION_CV_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.commutedValue")} />
                    </Typography>
                  </Grid>
                  
                          <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="familyPensionIVerified" labelKey="PENSION_EMPLOYEE_PENSION_AFP1_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.familyPensionI")} />
                    </Typography>
                  </Grid>
                     
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="familyPensionIIVerified" labelKey="PENSION_EMPLOYEE_PENSION_AFP2_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.familyPensionII")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="daVerified" labelKey="PENSION_EMPLOYEE_PENSION_DA_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.da")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="interimReliefVerified" labelKey="PENSION_EMPLOYEE_PENSION_IR_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.interimRelief")} />
                    </Typography>
                  </Grid> 
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="totalPension" labelKey="PENSION_EMPLOYEE_TOTL_PENSION_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.totalPension")} />
                    </Typography>
                  </Grid>   
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="netDeductions" labelKey="PENSION_EMPLOYEE_PENSION_NET_DEDUCTIONS_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.netDeductions")} />
                    </Typography>
                  </Grid> 
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="dcrgVerified" labelKey="PENSION_EMPLOYEE_PENSION_DCRG_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.dcrg")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="duesDeductions" labelKey="PENSION_EMPLOYEE_PENSION_DS_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.duesDeductions")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="provisionalPension" labelKey="PENSION_EMPLOYEE_PENSION_PP_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.provisionalPension")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="familyPensionIStartDate" labelKey="PENSION_EMPLOYEE_PENSION_FPSD_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.familyPensionIStartDate")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="familyPensionIEndDate" labelKey="PENSION_EMPLOYEE_PENSION_FPED_S" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.familyPensionIEndDate")} />
                    </Typography>
                  </Grid>
                  
                 
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="familyPensionIIStartDate" labelKey="PENSION_EMPLOYEE_PENSION_FP2SD_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.familyPensionIIStartDate")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="exGratia" labelKey="PENSION_EMPLOYEE_EG_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.exGratia")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="invalidPension" labelKey="PENSION_EMPLOYEE_PENSION_IP_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.invalidPension")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="woundExtraordinaryPension" labelKey="PENSION_EMPLOYEE_PENSION_WEP_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.woundExtraordinaryPension")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="attendantAllowance" labelKey="PENSION_EMPLOYEE_PENSION_ATN_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.attendantAllowance")} />
                    </Typography>
                  </Grid>
                  
                </Grid>
                </div>

              }
              />

  </CardContent>
</Card>
          )
        }     
     {
          DOP_INFO_VISIBLE && revesion  &&(   

<Card>
  <CardContent>
  <Container
              children={
                <div style={{ width: "100%" }}>
                <Grid container="true" spacing={12} marginTop={16}>
                  <Grid
                    style={{ alignItems: "center", display: "flex" }}
                    item
                    sm={6}
                    xs={6}
                  >
                    <Typography component="h2" variant="subheading">
                      <LabelContainer
                        labelName="Pension Calculation Update Details"
                        labelKey="PENSION_PENSION_REVISION_VERIFIED_DATA_DETAILS"
                      />
                       &nbsp;&nbsp;-&nbsp;&nbsp;
                      <LabelContainer
                        labelName="Pension Calculation Update Details"
                        labelKey={`PENSION_MODULE_${businessService}`}
                      />
                    </Typography>
                    <br/>
                  </Grid>
                  </Grid>
                   <Grid container="true" spacing={12} marginTop={16}>
                  <br/>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="nqsYearVerified" labelKey="PENSION_EMPLOYEE_PENSION_NQS_YEAR_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.nqsYear")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="nqsMonthVerified" labelKey="PENSION_EMPLOYEE_PENSION_NQS_MONTH_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.nqsMonth")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="nqsDayVerified" labelKey="PENSION_EMPLOYEE_PENSION_NQS_DAY_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.nqsDay")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="totalPension" labelKey="PENSION_EMPLOYEE_TOTL_PENSION_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.totalPension")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="pensionerFamilyPension" labelKey="PENSION_EMPLOYEE_PENSION_FP_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.pensionerFamilyPension")} />
                    </Typography>
                  </Grid>
                 
                </Grid>
                </div>

              }
              />

  </CardContent>
</Card>
          )
            }
             {
          RRP_INFO_VISIBLE &&revesion  &&(   

<Card>
  <CardContent>
  <Container
              children={
                <div style={{ width: "100%" }}>
                <Grid container="true" spacing={12} marginTop={16}>
                  <Grid
                    style={{ alignItems: "center", display: "flex" }}
                    item
                    sm={6}
                    xs={6}
                  >
                    <Typography component="h2" variant="subheading">
                      <LabelContainer
                        labelName="Pension Calculation Update Details"
                        labelKey="PENSION_PENSION_REVISION_VERIFIED_DATA_DETAILS"
                      />
                     &nbsp;&nbsp;-&nbsp;&nbsp;
                      <LabelContainer
                        labelName="Pension Calculation Update Details"
                        labelKey={`PENSION_MODULE_${businessService}`}
                      />
                    </Typography>
                    <br/>
                  </Grid>
                  </Grid>
                   <Grid container="true" spacing={12} marginTop={16}>
                  <br/>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="nqsYearVerified" labelKey="PENSION_EMPLOYEE_PENSION_NQS_YEAR_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.nqsYear")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="nqsMonthVerified" labelKey="PENSION_EMPLOYEE_PENSION_NQS_MONTH_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.nqsMonth")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="nqsDay" labelKey="PENSION_EMPLOYEE_PENSION_NQS_DAY_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.nqsDay")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="basicPension" labelKey="PENSION_EMPLOYEE_PENSION_BP_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.basicPension")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="provisionalPension" labelKey="PENSION_EMPLOYEE_PENSION_PP_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.provisionalPension")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="commutedPension" labelKey="PENSION_EMPLOYEE_PENSION_CP_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.commutedPension")} />
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="compensationPension" labelKey="PENSION_EMPLOYEE_PENSION_COM_P_S" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.compensationPension")} />
                    </Typography>
                  </Grid>                 
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="daVerified" labelKey="PENSION_EMPLOYEE_PENSION_DA_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.da")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="compassionatePensionVerified" labelKey="PENSION_EMPLOYEE_PENSION_COMP_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.compassionatePension")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="interimReliefVerified" labelKey="PENSION_EMPLOYEE_PENSION_IR_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.interimRelief")} />
                    </Typography>
                  </Grid> 
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="totalPension" labelKey="PENSION_EMPLOYEE_TOTL_PENSION_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.totalPension")} />
                    </Typography>
                  </Grid>             
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="pensionDeductions" labelKey="PENSION_EMPLOYEE_PENSION_PD_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.pensionDeductions")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="netDeductions" labelKey="PENSION_EMPLOYEE_PENSION_NET_DEDUCTIONS_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.netDeductions")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="finalCalculatedPension" labelKey="PENSION_EMPLOYEE_PENSION_FINAL_CALCULATION_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.finalCalculatedPension")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="dcrgVerified" labelKey="PENSION_EMPLOYEE_PENSION_DCRG_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.dcrg")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="commutedValueVerified" labelKey="PENSION_EMPLOYEE_PENSION_CV_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.commutedValue")} />
                    </Typography>
                  </Grid>
                 
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="duesDeductions" labelKey="PENSION_EMPLOYEE_PENSION_DS_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.duesDeductions")} />
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="terminalBenefitVerified" labelKey="PENSION_EMPLOYEE_PENSION_TB_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.terminalBenefit")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="finalCalculatedGratuity" labelKey="PENSION_EMPLOYEE_PENSION_FCG_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.finalCalculatedGratuity")} />
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="exGratia" labelKey="PENSION_EMPLOYEE_EG_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.exGratia")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="invalidPension" labelKey="PENSION_EMPLOYEE_PENSION_IP_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.invalidPension")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="woundExtraordinaryPension" labelKey="PENSION_EMPLOYEE_PENSION_WEP_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.woundExtraordinaryPension")} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 20 }}>
                    <Typography variant="caption">
                    <LabelContainer labelName="attendantAllowance" labelKey="PENSION_EMPLOYEE_PENSION_ATN_V" />
                    </Typography>
                    <Typography variant="body2">
                    <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.attendantAllowance")} />
                    </Typography>
                  </Grid>
                  
                </Grid>
                </div>

              }
              />

  </CardContent>
</Card>
          )
            }

        {/* Monthly data card */}
        {
        Register &&(
        <Card className="">
        <Grid
                      style={{ alignItems: "center", display: "flex", marginTop: 10, paddingLeft: 20 }}
                      item
                      sm={6}
                      xs={6}
                    >
                      <Typography component="h2" variant="subheading">
                        <LabelContainer
                          labelName="Pension Register Monthly data"
                          labelKey="PENSION_REGISTER_MONTHLY_DATA"
                        />
                      </Typography>
                      <br/>
                    </Grid>
                    {
                            data &&(
                              <Card>
                                <Grid
                      style={{ alignItems: "center", display: "flex", marginTop: 5, paddingLeft: 40,marginBottom:0 }}
                      item
                      sm={6}
                      xs={6}
                    >
                      <Label labelClassName="" label="COMMON_INBOX_NO_DATA" />
                      {/* <Typography component="h4" variant="subheading">
                        <LabelContainer
                          labelName="COMMON_INBOX_NO_DATA"
                          labelKey="COMMON_INBOX_NO_DATA"
                        />
                      </Typography> */}
                      <br/>
                    </Grid>
                                </Card>
                            )
                          }
       
         {
          currentObjE&& currentObjE.pensionRegister.map((row, i) => {
            return(
              <CardContent>
            {
                <Container style={{backgroundColor: "rgb(242, 242, 242)",  boxShadow: "none",borderRadius: 0, overflow: "visible"}}
                children={
                  <div>
                    <Grid container="true" spacing={12} marginTop={16}>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="dcrgVerified" labelKey="PENSION_EMPLOYEE_PENSION_ESY" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.effectiveYear} />
                        </Typography>
                      </Grid>
                     
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="dcrgVerified" labelKey="PENSION_EMPLOYEE_PENSION_ESM" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.effectiveMonth} />
                        </Typography>
                      </Grid>
                     
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="dcrgVerified" labelKey="PENSION_EMPLOYEE_PENSION_BP_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.basicPension} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="totalPension" labelKey="PENSION_EMPLOYEE_PENSION_TP_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.totalPension} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="da" labelKey="PENSION_EMPLOYEE_PENSION_DA_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.da} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="overPayment" labelKey="PENSION_EMPLOYEE_PENSION_OVER_PAYMENT_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.overPayment} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="commutedPension" labelKey="PENSION_EMPLOYEE_PENSION_COMMMUTED_PEENSION_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.commutedPension} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="incomeTax" labelKey="PENSION_EMPLOYEE_PENSION_INCOMETAX_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.incomeTax} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="additionalPension" labelKey="PENSION_EMPLOYEE_PENSION_AP_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.additionalPension} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="cess" labelKey="PENSION_EMPLOYEE_PENSION_CESS_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.cess} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="interimRelief" labelKey="PENSION_EMPLOYEE_PENSION_IR_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.interimRelief} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="pensionDeductions" labelKey="PENSION_EMPLOYEE_PENSION_PD_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.pensionDeductions} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="fma" labelKey="PENSION_EMPLOYEE_MR_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.fma} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="netDeductions" labelKey="PENSION_EMPLOYEE_PENSION_NET_DEDUCTION_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.netDeductions} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="miscellaneous" labelKey="PENSION_EMPLOYEE_PENSION_MISCELLENOUS_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.miscellaneous} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="finalCalculatedPension" labelKey="PENSION_EMPLOYEE_PENSION_FINAL_DEDUCTION_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.finalCalculatedPension} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="woundExtraordinaryPension" labelKey="PENSION_EMPLOYEE_PENSION_WOUNDED_PENSION_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.woundExtraordinaryPension} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Typography variant="caption">
                        <LabelContainer labelName="attendantAllowance" labelKey="PENSION_EMPLOYEE_PENSION_FINAL_TEN_ALLOWANCE_R" />
                        </Typography>
                        <Typography variant="body2">
                        <LabelContainer labelName={row.attendantAllowance} />
                        </Typography>
                      </Grid>
                      </Grid>
                      </div>
                      

                }  
              />
            } 
              
            </CardContent>
                )
        })
      } 

       
        </Card>  
         )  
      }
      </div>
      
    );
   
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const ProcessInstances = get(
    screenConfiguration.preparedFinalObject,
    "ProcessInstances",
    {})
  //const { workflow } = preparedFinalObject;
  //const { ProcessInstances } = workflow || [];

  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)), ProcessInstances
  };
  //return {  state,preparedFinalObject ,ProcessInstances};
  
};
const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),

  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PensionDataContainer)
);

//export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PensionReviewDataContainer))
//export default withStyles(styles)(PensionReviewDataContainer);
