import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";

export const nocSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Application Details",
          labelKey: "ROADCUT_APPLICATION_DETAILS_HEADER_NOC"
        })
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "NOC_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 0);
          }
        }
      }
    }
  },
  body: getCommonContainer({
    NameofDog: getLabelWithValue(
      {
        labelName: "Purpose Of Road Cutting",
        labelKey: "ROADCUT_PURPOSE_OF_ROADCUTTING_NOC"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if(value!=undefined){
          let purposeOfRoadCutting = JSON.parse(value).hasOwnProperty('purposeOfRoadCutting')?JSON.parse(value)['purposeOfRoadCutting']:'';
          return purposeOfRoadCutting;
          }
          else{
            return '';
          }
        }
      }
    ),
    roadCutType: getLabelWithValue(
      {
        labelName: "Road Cut Type",
        labelKey: "ROADCUT_ROAD_CUT_TYPE_LABEL_NOC"
      },
      {
     
      jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if(value!=undefined){
          let purposeOfRoadCutting = JSON.parse(value).hasOwnProperty('roadCutType')?JSON.parse(value)['roadCutType']:'';
          return purposeOfRoadCutting;
          }
          else{
            return '';
          }
        }
      }
    ),
    Age: getLabelWithValue(
      {
        labelName: "Division",
        labelKey: "ROADCUT_DIVISION_NOC"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if(value!=undefined){
          let division = JSON.parse(value).hasOwnProperty('division')?JSON.parse(value)['division']:'';
          return division;
          }else{
            return '';
          }
        }
      }
    ),
    Sex: getLabelWithValue(
      {
        labelName: "Ward",
        labelKey: "ROADCUT_WARD_NOC"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if(value!=undefined){
          let ward = JSON.parse(value).hasOwnProperty('ward')?JSON.parse(value)['ward']:'';
          return ward;
          }else{
            return '';
          }
        }
      }
    ),
    Breed: getLabelWithValue(
      {
        labelName: "Sector",
        labelKey: "ROADCUT_WARD_NOC"
      },
      {
        jsonPath: "nocApplicationDetail[0]",
        callBack: value => {
          if(value!=undefined){
          let sector =  value.sector==null?'':value.sector; //JSON.parse(value).hasOwnProperty('sector')?JSON.parse(value)['sector']:'';
          return sector;
          }else{
            return '';
          }
        }
      }
    ),
    Color: getLabelWithValue(
      {
        labelName: "Requested Location",
        labelKey: "ROADCUT_REQUESTEDLOCATION_NOC"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if(value!=undefined){
          let requestedLocation = JSON.parse(value).hasOwnProperty('requestedLocation')?JSON.parse(value)['requestedLocation']:'';
          return requestedLocation;
          }else{
            return '';
          }
        }
      }
    ),
    IdentificationMark: getLabelWithValue(
      {
        labelName: "Landmark",
        labelKey: "ROADCUT_LANDMARK_NOC"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if(value!=undefined){
          let landmark = JSON.parse(value).hasOwnProperty('landmark')?JSON.parse(value)['landmark']:'';
          return landmark;
          }else{
            return '';
          }
        }
      }
    ),
    lengthNumber: getLabelWithValue(
      {
        labelName: "Length",
        labelKey: "ROADCUT_LENGTH_LABEL_NOC"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if(value!=undefined){
          let length = JSON.parse(value).hasOwnProperty('length')?JSON.parse(value)['length']:'';
          return length;
          }else{
            return '';
          }
        }
      }
    )
  })
});
