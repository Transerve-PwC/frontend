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
  export const TFCDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Task Force Committee",
        labelKey: "NULM_SEP_TASK_FORCE_COMMITTEE_HEADER"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    TFCDetailsContainer: getCommonContainer({
     
        taskCommitteeApprovedAmount: {
            ...getTextField({
              label: {
                labelName: "Amount approved by task force committee",
                labelKey: "NULM_SEP_AMOUNT_APPOVED_BY_TFC"
              },
              placeholder: {
                labelName: "Enter Amount",
                labelKey: "NULM_SEP_AMOUNT_APPOVED_BY_TFC_PLACEHOLDER"
              },
              required: true,
               props: {
                  disabled: isDisabled
              },
              pattern: getNULMPattern("Amount") || null,
           //   errorMessage: "NULM_SEP_AMOUNT_OF_LOAN_REQUIRED_VALIDATION",
              jsonPath: "NULMSEPRequest.taskCommitteeApprovedAmount"
            })
          },
  
          taskCommitteeRemark: {
        ...getTextField({
          label: {
            labelName: "Task force committee remarks",
            labelKey: "NULM_SEP_REMARK_BY_TFC"
          },
          placeholder: {
            labelName: "Enter remarks",
            labelKey: "NULM_SEP_REMARK_BY_TFC_PLACEHOLDER"
          },
          required: true,
          props: {
            disabled: isDisabled
        },
          pattern: getPattern("Address") || null,
          jsonPath: "NULMSEPRequest.taskCommitteeRemark"
        })
      },
      
      taskCommitteeActionDate: {
        ...getDateField({
          label: {
            labelName: "Task committee Action Date",
            labelKey: "NULM_SEP_DATE_BY_TCF"
          },
          placeholder: {
            labelName: "Task committee Action Date",
            labelKey: "NULM_SEP_DATE_BY_TCF"
          },
         
          required: true,
          pattern: getPattern("Date") || null,
          jsonPath: "NULMSEPRequest.taskCommitteeActionDate",
          props: {
            inputProps: {
              disabled : isDisabled,
              min:  new Date().toISOString().slice(0, 10),
            }
          }
        })
      },
  
      taskCommitteeStatus: {
        ...getSelectField({
          label: {
            labelName: "Status",
            labelKey: "NULM_SEP_STATUS_BY_TCF"
          },
          placeholder: {
            labelName: "select status",
            labelKey: "NULM_SEP_STATUS_BY_TCF_PLACEHOLDER"
          },
          props: {
            disabled: isDisabled
        },
          required: true,
         // sourceJsonPath:   "applyScreenMdmsData.NULM.Qualification",
          jsonPath: "NULMSEPRequest.taskCommitteeStatus",
          props: {
            optionValue: "code",
            optionLabel: "name",
            data : [
                {
                    code : "Approved by Task force committee",
                    name : "Approved by Task force committee"
                },
                {
                    code : "Rejected by Task force committee",
                    name : "Rejected by Task force committee"
                },
            ]
          },
        }),
        beforeFieldChange: (action, state, dispatch) => {
          const status = window.localStorage.getItem("SEP_Status");

          if(status === APPROVED_BY_TASK_FORCE_COMMITTEE){
            if(action.value === "Approved by Task force committee"){
              dispatch(
                handleField(
                  "create-sep",
                  "components.div.children.formwizardFirstStep.children.bankDetailToProcess.children.cardContent"  ,
                  "visible",
                  true
                )
              );
            }
            else{
              dispatch(
                handleField(
                  "create-sep",
                  "components.div.children.formwizardFirstStep.children.bankDetailToProcess.children.cardContent"  ,
                  "visible",
                  false
                )
              );
              // dispatch(
              //   handleField(
              //     "create-sep",
              //     "components.div.children.formwizardFirstStep.children.bankDetailToProcess.children.cardContent.children.header"  ,
              //     "visible",
              //     false
              //   )
              // );
            }
          }
        }
      },
    })
  });