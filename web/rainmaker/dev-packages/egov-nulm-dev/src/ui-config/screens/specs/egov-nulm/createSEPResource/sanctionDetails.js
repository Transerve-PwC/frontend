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
  export const SanctionDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Sanction Details",
        labelKey: "NULM_SEP_SANCTION_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    SanctionDetailsContainer: getCommonContainer({
     
        sanctionDate: {
            ...getDateField({
              label: {
                labelName: "Sanction Date",
                labelKey: "NULM_SEP_SANCTION_DATE"
              },
              placeholder: {
                labelName: "Sanction Date",
                labelKey: "NULM_SEP_SANCTION_DATE"
              },
              required: true,
              pattern: getPattern("Date") || null,
              jsonPath: "NULMSEPRequest.sanctionDate",
              props: {
                inputProps: {
                  min:  new Date().toISOString().slice(0, 10),
                }
              }
            })
          },
          sanctionRemarks: {
        ...getTextField({
          label: {
            labelName: "Sanction Remarks",
            labelKey: "NULM_SEP_SANCTION_REMARK"
          },
          placeholder: {
            labelName: "Enter Sanction Remarks",
            labelKey: "NULM_SEP_SANCTION_REMARK_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Address") || null,
          jsonPath: "NULMSEPRequest.sanctionRemarks"
        })
      },
      
    })
  });