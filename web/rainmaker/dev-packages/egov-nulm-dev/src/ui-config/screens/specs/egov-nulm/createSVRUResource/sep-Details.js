import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getCommonGrayCard,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD } from "../../utils";
import { getNULMPattern } from "../../../../../ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField , prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
const NomineeDetailsCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: getCommonGrayCard({
      NomineeDetailsCardContainer: getCommonContainer(
        {
          name: {
              ...getTextField({
                label: {
                  labelName: "Name",
                  labelKey: "NULM_SUH_LOG_NAME",
                },
                placeholder: {
                  labelName: "Enter Name",
                  labelKey: "NULM_SUH_LOG_NAME_PLACEHOLDER",
                },
                required: true,
                pattern: getPattern("Name") || null,
                jsonPath: "NulmSusvRenewRequest.susvApplicationFamilyDetails[0].name",       
              })
            },
            age: {
              ...getTextField({
                label: {
                  labelName: "age",
                  labelKey: "NULM_SEP_AGE"
                },
                placeholder: {
                  labelName: "Enter age",
                  labelKey: "NULM_SEP_AGE_PLACEHOLDER"
                },
                required: true,
                pattern: getPattern("age") || null,
                jsonPath: "NulmSusvRenewRequest.susvApplicationFamilyDetails[0].age"
              })
            },
            relation: {
              ...getTextField({
                label: {
                  labelName: "Relation",
                  labelKey: "NULM_SUSV_RELATION"
                },
                placeholder: {
                  labelName: "Enter Relation",
                  labelKey: "NULM_SUSV_RELATION_PLACEHOLDER"
                },
                required: true,
                pattern: getPattern("Name") || null,
                jsonPath: "NulmSusvRenewRequest.susvApplicationFamilyDetails[0].relation"
              })
            },
        },
        {
          style: {
            overflow: "visible"
          }
        }
      )
    }),
    items: [],
    addItemLabel: {
      labelName: "Add Nominee",
      labelKey: "NULM_SUSV_ADD_NOMINEE"
    },
    headerName: "Nominee",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "NulmSusvRenewRequest.susvApplicationFamilyDetails",
    prefixSourceJsonPath:
      "children.cardContent.children.NomineeDetailsCardContainer.children"
  },
  type: "array"
};
export const SepDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Street Vendor Details",
      labelKey: "NULM_SVRU_VENDER_HEARDER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  SepDetailsContainer: getCommonContainer({
   
    lookingFor: {
      ...getSelectField({
        label: {
          labelName: "I am Looking for",
          labelKey: "NULM_SVRU_LOOKING_FOR"
        },
        placeholder: {
          labelName: "Select Looking for",
          labelKey: "NULM_SVRU_LOOKING_FOR_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        //applyScreenMdmsData
      //   sourceJsonPath:
      //  "applyScreenMdmsData.NULM.lookingFor",
        jsonPath: "NulmSusvRenewRequest.lookingFor",
        props: {
          data: [
            {
              code: "Application for Transfer of Registration on Death Cases",
              name: "Application for Transfer of Registration on Death Cases"
            },
            {
              code: "Correction & Particulars",
              name: "Correction & Particulars"
            },
            {
              code: "Updating in Official Records",
              name: "Updating in Official Records"
            },
            {
              code: "ID Card Renewal & Duplication",
              name: "ID Card Renewal & Duplication"
            },
           
          ],
          optionValue: "code",
          optionLabel: "name",
        },
        beforeFieldChange: (action, state, dispatch) => {

          if(action.value)
          {
            if(action.value ==='Application for Transfer of Registration on Death Cases')
            {
              dispatch(
                handleField(
                  "create-svru",
                  "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nominieedetails",
                  "props.style",
                  { display: "none" }
                )
              ); 
              dispatch(
                handleField(
                  "create-svru",
                  "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nameOfProposedNewStreetVendor",
                  "props.style",                  
                  { display: "inline-block" }
                )
              ); 

            }
            else{
              dispatch(
                handleField(
                  "create-svru",
                  "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nominieedetails",
                  "props.style",
                 
                  { display: "inline-block",width:"100%" }
                )
              ); 
              dispatch(
                handleField(
                  "create-svru",
                  "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nameOfProposedNewStreetVendor",
                  "props.style",
                  { display: "none" }
                )
              );

            }
          }
        },
      })
    },
    nameOfStreetVendor: {
      ...getTextField({
        label: {
          labelName: "Name of Street Vendor",
          labelKey: "NULM_SVRU_NANE_OF_STREET_VENDER"
        },
        placeholder: {
          labelName: "Enter Name of Street Vendor",
          labelKey: "NULM_SVRU_NANE_OF_STREET_VENDER_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NulmSusvRenewRequest.nameOfStreetVendor",       
      })
    },
    covNo: {
      ...getTextField({
        label: {
          labelName: "Certificate of Vensing No (COV No.)",
          labelKey: "NULM_SVRU_CON_NUMBER"
        },
        placeholder: {
          labelName: "Enter COV No.",
          labelKey: "NULM_SVRU_CON_NUMBER_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NulmSusvRenewRequest.covNo",       
      })
    },
    residentialAddress: {
      ...getTextField({
        label: {
          labelName: "Residential Address if Change from Last Given",
          labelKey: "NULM_SVRU_RES_ASDDRESS"
        },
        placeholder: {
          labelName: "Enter Residential Address",
          labelKey: "NULM_SVRU_RES_ASDDRESS_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NulmSusvRenewRequest.residentialAddress",       
      })
    },
    changeOfLocation: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmSusvRenewRequest.changeOfLocation",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmSusvRenewRequest.changeOfLocation",
        label: { name: "Any Proposal in Change of location for street vending", key: "NULM_SVRU_PROPOSAL" },
        buttons: [
          {
            labelName: "Yes",
            labelKey: "NULM_SMID_YES",
            value:"Yes",           
          },
          {
            label: "No",
            labelKey: "NULM_SMID_NO",
            value:"No",           
          },
         
        ],      
        defaultValue: "No"
      },
      type: "array",
      beforeFieldChange: (action, state, dispatch) => {
        if (action.value === "No") {
          dispatch(
            handleField(
              "create-svru",
              "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.proposedAddress",
              "props.style",
              { display: "none" }
            )
          ); 
         // dispatch(prepareFinalObject("NulmSusvRenewRequest.proposedAddress",null));

        }
        else  if (action.value === "Yes") {
          dispatch(
            handleField(
              "create-svru",
              "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.proposedAddress",
              "props.style",
              { display: "inline-block" }
            )
          ); 
 
        }
           
      }
     
    },
    proposedAddress: {
      ...getTextField({
        label: {
          labelName: "Proposed Zone",
          labelKey: "NULM_SVRU_PROPOSED_ZONE"
        },
        placeholder: {
          labelName: "Enter proposed zone",
          labelKey: "NULM_SVRU_PROPOSED_ZONE_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("Name") || null,
        jsonPath: "NulmSusvRenewRequest.proposedAddress"
      })
    },
    nominieedetails :getCommonCard({
      header: getCommonTitle(
        {
          labelName: "Dependent Family Member Details",
          labelKey: "NULM_SVRU_NOMINEE_DETAILS"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      NomineeDetailsCard
    }),
    
    nameOfProposedNewStreetVendor: {
      ...getTextField({
        label: {
          labelName: "Name of Proposed New Street Vendor",
          labelKey: "NULM_SVRU_PROPOSED_NEW_VENDER"
        },
        placeholder: {
          labelName: "Enter new Street Vendor",
          labelKey: "NULM_SVRU_PROPOSED_NEW_VENDER_PLACEHOLDER"
        },
      required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NulmSusvRenewRequest.nameOfProposedNewStreetVendor"
      })
    },
  })
});