import {
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  const gotoCreatePage = (state, dispatch) => {
    const IndentId = getQueryArg(window.location.href, "IndentId");
    const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-store-asset/createMaterialReceiptNote?step=1`
    : `/egov-store-asset/createMaterialReceiptNote?step=1`;
    dispatch(setRoute(createUrl));
  };
  
  const openningbalenceCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "review-hr",
      scheama: getCommonGrayCard({
        openningbalenceCardContainer: getCommonContainer({
          materialcode: getLabelWithValue(
            {
              labelName: "Material Code",
                labelKey: "STORE_MATERIAL_NAME"
            },
            { jsonPath: "materialReceipt[0].receiptDetails[0].material.name",          
          }
          ),
          LotNumber: getLabelWithValue(
            {
              labelName: "Lot No.",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_LOT_NO"
            },
            { jsonPath: "materialReceipt[0].receiptDetails[0].lotNo",          
          }
          ),
          ExpiryDate: getLabelWithValue(
            {
              labelName: "Expiry Date",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_EXPIRY_DATE"
            },
            { jsonPath: "materialReceipt[0].receiptDetails[0].expiryDate",          
          }
          ),
          userQuantity: getLabelWithValue(
            {
              labelName: "Opening Qty",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_QTY"
            },
            { jsonPath: "materialReceipt[0].receiptDetails[0].userQuantity",          
          }
          ),
          unitRate: getLabelWithValue(
            {
              labelName: "Opening Rate",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_RATE"
            },
            { jsonPath: "materialReceipt[0].receiptDetails[0].unitRate",          
          }
          ),
          receiptNumber: getLabelWithValue(
            {
              labelName: "Receipt No.",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_NO"
            },
            { jsonPath: "materialReceipt[0].receiptDetails[0].oldReceiptNumber",          
          }
          ),
          receivedDate: getLabelWithValue(
            {
              labelName: "Receipt Date",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_DATE"
            },
            { jsonPath: "materialReceipt[0].receiptDetails[0].receivedDate",          
          }
          ),
          
          remarks: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK"
            },
            { jsonPath: "materialReceipt[0].receiptDetails[0].remarks",          
          }
          ),
        
        })
      }),
  
      items: [],
      hasAddItem: false,
      isReviewPage: true,
     // screenKey:"view-price-list",
      sourceJsonPath: "materialReceipt[0].receiptDetails",
      prefixSourceJsonPath:
        "children.cardContent.children.openningbalenceCardContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  };
  export const getReceiptDetailsView = (isReview = true) => {
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
              labelName: "Material Receipt Details",
              labelKey: "STORE_MATERIAL_RECEIPT_MATERIAL_RECEIPT_DETAILS"
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
            // onClickDefination: {
            //   action: "condition",
            //   callBack: gotoCreatePage
            // }
          }
        }
      },
      viewOne: openningbalenceCard
    });
  };
  