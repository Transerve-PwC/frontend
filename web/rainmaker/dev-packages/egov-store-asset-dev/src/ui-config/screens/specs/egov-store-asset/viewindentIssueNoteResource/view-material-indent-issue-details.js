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
    const applicationNumber =getQueryArg(window.location.href, "applicationNumber");
  if(IndentId)
  {
    const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-store-asset/createMaterialIndentNote?step=0&IndentId=${IndentId}`
    : `/egov-store-asset/createMaterialIndentNote?step=0&IndentId=${IndentId}`;
    dispatch(setRoute(createUrl));
  }
  if(applicationNumber)
  {
    const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-store-asset/createMaterialIndentNote?step=0&applicationNumber=${applicationNumber}`
    : `/egov-store-asset/createMaterialIndentNote?step=0&applicationNumber=${applicationNumber}`;
    dispatch(setRoute(createUrl));
  }
  };
  
  const MaterialIssueCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "review-hr",
      scheama: getCommonGrayCard({
        MaterialIssueCardContainer: getCommonContainer({
          MaterialName: getLabelWithValue(
            {
              labelName: "Material Nmae",
                  labelKey: "STORE_MATERIAL_NAME"
            },
            { jsonPath: "materialIssues[0].materialIssueDetails[0].material.name",          
          }
          ),
          TotalIndentQty: getLabelWithValue(
            {
              labelName: "Total Indent Qty Required",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_TOTAL_INDENT_QTY_REQUIRED"
            },
            { jsonPath: "materialIssues[0].materialIssueDetails[0].indentDetail.indentQuantity"
            
           }
          ),
          // BalanceQty: getLabelWithValue(
          //   {
          //     labelName: "Balance Qty",
          //         labelKey: "STORE_MATERIAL_INDENT_NOTE_BALANCE_QTY"
          //   },
          //   { jsonPath: "materialIssues[0].materialIssueDetails[0].indentDetail.BalanceQtyAfterIssue"
            
          //  }
          // ),
          QtyIssued: getLabelWithValue(
            {
              labelName: "Qty Issued",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_ISSUED"
            },
            { jsonPath: "materialIssues[0].materialIssueDetails[0].quantityIssued"
            
           }
          ),
          UOMName: getLabelWithValue(
            { labelName: "UOM",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME"},
            {
              jsonPath: "materialIssues[0].materialIssueDetails[0].uom.name"
             
            }
          ),
          // UnitPrice: getLabelWithValue(
          //   { labelName: "Unit Price",
          //   labelKey: "STORE_MATERIAL_INDENT_NOTE_UNIT_PRICE"},
          //   {
          //     jsonPath: "materialIssues[0].materialIssueDetails[0].indentDetail.unitRate"
             
          //   }
          // ),
          // BalanceQtyAfterIssue: getLabelWithValue(
          //   { labelName: "Balance Qty After Issue",
          //   labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_BALANCE_QTY_AFTER_ISSUE"},
          //   {
          //     jsonPath: "materialIssues[0].materialIssueDetails[0].indentDetail.BalanceQtyAfterIssue"
             
          //   }
          // ),
           TotalValue: getLabelWithValue(
            { labelName: "Total Value",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_TOTAL_VALUE"},
            {
              jsonPath: "materialIssues[0].materialIssueDetails[0].indentDetail.TotalValue"
             
            }
          ),
          IndentPurpose: getLabelWithValue(
            {   labelName: "Indent Purpose",
            labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE" },
            {
              jsonPath: "materialIssues[0].materialIssueDetails[0].indent.indentPurpose",
             
            }
          ),
          ProjectCode: getLabelWithValue(
            {   labelName: "Project Code",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_PROJECT_CODE"},
            {
              jsonPath: "materialIssues[0].materialIssueDetails[0].indentDetail.projectCode.code",
             
            }
          ),
         
          Remark: getLabelWithValue(
            {   labelName: "Remark",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK"},
            {
              jsonPath: "materialIssues[0].materialIssueDetails[0].description",
             
            }
          ),
          
        })
      }),
  
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "materialIssues[0].materialIssueDetails",
      prefixSourceJsonPath:
        "children.cardContent.children.MaterialIssueCardContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  };
  export const getIndentIssueDetailsView = (isReview = true) => {
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
              labelName: "Indent Material Issue Details",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENT_MATERIAL_ISSUE_DETAILS"
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
      viewOne: MaterialIssueCard
    });
  };
  