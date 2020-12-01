import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

const gotoCreatePage = (state, dispatch) => {
  const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-store-asset/createpricelist?step=0`
      : `/egov-store-asset/createpricelist?step=0`;
  dispatch(setRoute(createUrl));
};

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-hrms",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};


export const getPriceListDetailsView = (isReview = true) => {
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
            labelName: "Material Details",
            labelKey: "STORE_MATERIAL_SUPPLIER_DETAILS"
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
              labelKey: "STORE_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: gotoCreatePage
          }
        }
      }
    },
   
    break1: getBreak(),
    viewOne: getCommonContainer({
      reviewsuppliercode: getLabelWithValue(
        {
          labelName: "Supplier Name",
            labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME"
        },
        {  jsonPath: "priceLists[0].supplier.code", }
      ),
      reviewrateType: getLabelWithValue(
        { labelName: "Rate Type", labelKey: "STORE_PRICE_RATE_TYPE" },
        { jsonPath: "priceLists[0].rateType", }
      ),
      rateContractNumber: getLabelWithValue(
        {
          labelName: "Rate Contract/Tender/Quatation No.",
            labelKey: "STORE_PRICE_RATE_CONTRACT_TENDER_QUATATION_NO"
        },
        { jsonPath: "priceLists[0].rateContractNumber" }
      ),
      rateContractDate: getLabelWithValue(
        { labelName: "Rate Contract/Tender/Quatation Date",
        labelKey: "STORE_PRICE_RATE_CONTRACT_TENDER_QUATATION_DATE" },
        {
          jsonPath: "priceLists[0].rateContractDate",
        }
      ),
      agreementNumber: getLabelWithValue(
        { labelName: "Agrement No",
        labelKey: "STORE_PRICE_AGREMENT_NO" },
        {
          jsonPath: "priceLists[0].agreementNumber"
        }
      ),
      agreementDate: getLabelWithValue(
        { labelName: "Agrement Date", labelKey: "STORE_PRICE_AGREMENT_DATE" },
        {
          jsonPath: "priceLists[0].agreementDate",
        }
      ),
      agreementStartDate: getLabelWithValue(
        {
          labelName: "Agrement Start Date",
            labelKey: "STORE_PRICE_AGREMENT_START_DATE"
        },
        {
          jsonPath: "priceLists[0].agreementStartDate",
        }
      ),
      agreementEndDate: getLabelWithValue(
        {
          labelName: "Agrement End Date",
            labelKey: "STORE_PRICE_AGREMENT_END_DATE"
        },
        {
          jsonPath: "priceLists[0].agreementEndDate",
        }
      ),
      // active: getLabelWithValue(
      //   {
      //     labelName: "Active",
      //     labelKey: "STORE_PRICE_ACTIVE"
      //   },
      //   {
      //     jsonPath: "priceLists[0].active"
      //   }
      // )
    }),
   

  });
};
