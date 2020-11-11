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
   const createUrl = `/egov-nulm/create-svru?step=0`;
  dispatch(setRoute(createUrl));
};

export const getSEPDetailsView = (isReview = true) => {
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
            labelName: "Street Vendor Registration Update",
            labelKey: "NULM_APPLICATION_FOR_SVRU_PROGRAM"
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
      lookingFor: getLabelWithValue(
        {
          labelName: "I am Looking for",
          labelKey: "NULM_SVRU_LOOKING_FOR"
        },
        { jsonPath: "NulmSusvRenewRequest.lookingFor",callBack: checkValueForNA  }
      ),
      nameOfStreetVendor: getLabelWithValue(
        {
          labelName: "Name of Street Vendor",
          labelKey: "NULM_SVRU_NANE_OF_STREET_VENDER"
        },
        { jsonPath: "NulmSusvRenewRequest.nameOfStreetVendor",callBack: checkValueForNA  }
      ),
     
      
      covNo: getLabelWithValue(
        {
          labelName: "Certificate of Vensing No (COV No.)",
          labelKey: "NULM_SVRU_CON_NUMBER"
        },
        { jsonPath: "NulmSusvRenewRequest.covNo",
        callBack: checkValueForNA  }
      ),
      residentialAddress: getLabelWithValue(
        {
          labelName: "Residential Address if Change from Last Given",
          labelKey: "NULM_SVRU_RES_ASDDRESS"
        },
        { jsonPath: "NulmSusvRenewRequest.residentialAddress",
        callBack: checkValueForNA }
      ),
      

      changeOfLocation: getLabelWithValue(
        {
          labelName: "Adhar Number",
          labelKey: "NULM_SVRU_PROPOSAL"
        },
        { jsonPath: "NulmSusvRenewRequest.changeOfLocation",
        callBack: checkValueForNA  }
      ),

      proposedAddress: getLabelWithValue(
        {
          labelName: "Proposed Zone",
          labelKey: "NULM_SVRU_PROPOSED_ZONE"
        },
        { jsonPath: "NulmSusvRenewRequest.proposedAddress" ,
        callBack: checkValueForNA  }
      ),


      newproposedZone: getLabelWithValue(
        {
          labelName: "Name of Proposed New Street Vendor",
          labelKey: "NULM_SVRU_PROPOSED_NEW_VENDER"
        },
        { jsonPath: "NulmSusvRenewRequest.nameOfProposedNewStreetVendor" ,
        callBack: checkValueForNA  }
      ),


     
    }),
  });
};
