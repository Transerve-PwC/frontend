import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getDateField,
    getSelectField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getTodaysDateInYMD } from "../../utils";
  import { getNULMPattern } from "../../../../../ui-utils/commons";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import get from "lodash/get";
  import set from "lodash/set";
  import {NULM_SEP_CREATED,
    FORWARD_TO_TASK_FORCE_COMMITTEE,
    APPROVED_BY_TASK_FORCE_COMMITTEE,
    REJECTED_BY_TASK_FORCE_COMMITTEE,
    SENT_TO_BANK_FOR_PROCESSING,
  SANCTION_BY_BANK} from '../../../../../ui-utils/commons';
  
  const isDisabled = window.localStorage.getItem("SEP_Status")=== SENT_TO_BANK_FOR_PROCESSING ? true : false;
  export const bankDetailToProcess = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Bank Details for Processing",
        labelKey: "NULM_SEP_BANK_DETAILS_FOR_PROCESSING"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    bankDetailToProcessContainer: getCommonContainer({
         
        committeeBankName: {
            ...getTextField({
              label: {
                labelName: "Bank Name (Only in Chandigarh)",
                labelKey: "NULM_SEP_BANK_NAME"
              },
              placeholder: {
                labelName: "Enter Bank Name (Only in Chandigarh)",
                labelKey: "NULM_SEP_BANK_NAME_PLACEHOLDER"
              },
              required: true,
              props: {
                disabled: isDisabled
               },
              pattern: getPattern("alpha-numeric-with-space") || null,
              jsonPath: "NULMSEPRequest.committeeBankName"
            })
          },
          committeeBranchName: {
            ...getTextField({
              label: {
                labelName: "Branch Name",
                labelKey: "NULM_SEP_BRANCH_NAME"
              },
              placeholder: {
                labelName: "Enter Branch Name",
                labelKey: "NULM_SEP_BRANCH_NAME_PLACEHOLDER"
              },
              required: true,
              props: {
                disabled: isDisabled
                },
              pattern: getPattern("alpha-numeric-with-space") || null,
              jsonPath: "NULMSEPRequest.committeeBranchName"
            })
          },
          applicationForwardedOnDate: {
        ...getDateField({
          label: {
            labelName: "Application forwarded to Bank On",
            labelKey: "NULM_SEP_APPLICATION_FORWD_BANK_DATE"
          },
          placeholder: {
            labelName: "Application forwarded to Bank On",
            labelKey: "NULM_SEP_APPLICATION_FORWD_BANK_DATE"
          },
          required: true,
          
          pattern: getPattern("Date") || null,
          jsonPath: "NULMSEPRequest.applicationForwardedOnDate",
          props: {
            inputProps: {
              disabled : isDisabled,
              min:  new Date().toISOString().slice(0, 10),
            }
          }
        })
      },
   
    })
  });