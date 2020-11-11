import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {  checkValueForNA } from "../../utils";
const gotoCreatePage = (state, dispatch) => {
   const createUrl = `/egov-nulm/log-maintenance?step=0`;
  dispatch(setRoute(createUrl));
};

export const getSUHLogDetailsView = (isReview = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Log Details",
            labelKey: "NULM_SUH_LOG_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isReview,
          gridDefination: {
            xs: 12,
            sm: 2,
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
              labelKey: "HR_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: gotoCreatePage
          }
        }
      }
    },
    viewOne: getCommonContainer({
      nameOfShelter: getLabelWithValue(
        {
          labelName: "Name of shelter",
          labelKey: "NULM_SUH_OF_SHELTER"
        },
        { jsonPath: "NulmSuhLogRequest.nameOfShelter" }
      ),
      date: getLabelWithValue(
        {
          labelName: "Date",
          labelKey: "NULM_SUH_LOG_DATE"
        },
        { jsonPath: "NulmSuhLogRequest.date" }
      ),
      name: getLabelWithValue(
        {
          labelName: "name",
          labelKey: "NULM_SUH_LOG_NAME"
        },
        { jsonPath: "NulmSuhLogRequest.name" }
      ),
      qualification: getLabelWithValue(
        {
          labelName: "Qualification",
          labelKey: "NULM_SEP_QUALIFACATION"
        },
        { jsonPath: "NulmSuhLogRequest.qualification" }
      ),
      gender: getLabelWithValue(
        {
          labelName: "Gender",
          labelKey: "NULM_SMID_GENDER"
        },
        { jsonPath: "NulmSuhLogRequest.gender" }
      ),
      age: getLabelWithValue(
        {
          labelName: "age",
          labelKey: "NULM_SEP_AGE"
        },
        { jsonPath: "NulmSuhLogRequest.age",
        callBack: checkValueForNA  }
      ),
      dateofbirth: getLabelWithValue(
        {
          labelName: "Date Of Birth",
          labelKey: "NULM_SEP_DOB"
        },
        { jsonPath: "NulmSuhLogRequest.dob",
        callBack: checkValueForNA  }
      ),       
      address: getLabelWithValue(
        {
          labelName: "Address",
          labelKey: "NULM_SMID_ADDRESS"
        },
        { jsonPath: "NulmSuhLogRequest.address" }
      ),
      aadhaarNo: getLabelWithValue(
        {
          labelName: "Adhar Number",
          labelKey: "NULM_SMID_ADHAR_NUMBER"
        },
        { jsonPath: "NulmSuhLogRequest.aadhaarNo" }
      ),
      reasonForStaying: getLabelWithValue(
        {
          labelName: "Reason for staying",
          labelKey: "NULM_SUH_LOG_REASON_FOR_STAY"
        },
        { jsonPath: "NulmSuhLogRequest.reasonForStaying" }
      ),
    }),
  });
};
