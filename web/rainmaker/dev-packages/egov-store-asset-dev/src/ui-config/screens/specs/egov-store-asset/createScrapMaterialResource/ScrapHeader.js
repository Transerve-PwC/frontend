import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

export const ScrapHeader = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Scrap",
      labelKey: "STORE_SCRAP_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  ScrapHeaderContainer: getCommonContainer({
    storeName: {
      ...getSelectField({
        label: { labelName: "Store Name", labelKey: "STORE_DETAILS_STORE_NAME" },
        placeholder: {
          labelName: "Select Store Name",
          labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
        },
       
        required: true,
        jsonPath: "scraps[0].store.code",
        sourceJsonPath: "searchMaster.storeNames",
        props: {
          disabled : true ,
          className: "hr-generic-selectfield",
          optionValue: "code",
          optionLabel: "name"
        }
      }),
    },
    scrapDate: {
      ...getDateField({
        label: {
          labelName: "Scrap Date",
          labelKey: "STORE_SCRAP_DATE",
        },
        placeholder: {
          labelName: "Scrap Date",
          labelKey: "STORE_SCRAP_DATE",
        },
        required: true,
        pattern: getPattern("Date"),
        jsonPath: "scraps[0].scrapDate",
        props: {
          inputProps: {
            min: new Date().toISOString().slice(0, 10),
          }
        }
      }),
    },  
 
   
    remarks: getTextField({
      label: {
        labelName: "Scrap Remarks",
        labelKey: "STORE_SCRAP_REMARK",
      },
      props: {
        className: "applicant-details-error",
        multiline: "multiline",
        rowsMax: 2,
      },
      placeholder: {
        labelName: "Enter Scrap Remarks",
        labelKey: "STORE_SCRAP_REMARK_PLCEHLDER",
      },
      required:true,
      pattern: getPattern("alpha-numeric-with-space-and-newline"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "scraps[0].description",
    }),
    createdBy: {
      ...getTextField({
        label: {
          labelName: "Scrap Created by",
          labelKey: "STORE_SCRAP_CREATEBY"
        },
        placeholder: {
          labelName: "Enter Created By",
          labelKey: "STORE_SCRAP_CREATEBY_PLCEHLDER"
        },
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "scraps[0].createdBy"
      })
    },
    designation: {
      ...getTextField({
        label: {
          labelName: "Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN"
        },
        placeholder: {
          labelName: "Enter Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN_PLCEHLDER"
        },
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "scraps[0].designation"
      })
    },
  })
});

