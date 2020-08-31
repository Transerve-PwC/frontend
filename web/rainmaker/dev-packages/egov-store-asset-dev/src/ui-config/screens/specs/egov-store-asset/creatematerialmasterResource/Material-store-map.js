import {
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle,
    getSelectField,
    getTextField,
    getPattern,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import get from "lodash/get"; 
  import set from "lodash/set"; 
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  
  const arrayCrawler = (arr, n) => {
    if (n == 1) {
      return arr.map(item => {
        return { code: item.code, name: item.name };
      });
    } else
      return arr.map(item => {
        return arrayCrawler(item.children, n - 1);
      });
  };
  
  const storeDetailsCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      scheama: getCommonGrayCard({
        storeDetailsCardContainer: getCommonContainer(
          {
            store: {
              ...getSelectField({
              label: { labelName: "Store Name", labelKey: "STORE_DETAILS_STORE_NAME" },
              placeholder: {
                labelName: "Select Store Name",
                labelKey: "STORE_DETAILS_STORE_NAME_SELECT",
              },
              required: true,
              jsonPath: "materials[0].storeMapping[0].store.code",
              gridDefination: {
                xs: 12,
                sm: 4,
              },
              sourceJsonPath: "store.stores",
              props: {
                optionValue: "code",
                optionLabel: "name",
              },
               
              
            }),
            beforeFieldChange: (action, state, dispatch) => {
              let store = get(state, "screenConfiguration.preparedFinalObject.store.stores",[]) 
              store = store.filter(x=>x.code == action.value)//.materialType.code
              if(store[0].department)
              dispatch(prepareFinalObject("materials[0].storeMapping[0].department.name",store[0].department.name));
              else
              dispatch(prepareFinalObject("materials[0].storeMapping[0].department.name",""));
            }
          },
            DepartmentName: {
              ...getTextField({
                label: {
                  labelName: "Department Name",
                  labelKey: "STORE_DETAILS_DEPARTMENT_NAME"
                },
                placeholder: {
                  labelName: "Department Names",
                  labelKey: "STORE_DETAILS_DEPARTMENT_NAME"
                },
                required: false,
                props: {
                  disabled:true,
                },
                pattern: getPattern("Name") || null,
                jsonPath: "materials[0].storeMapping[0].department.name"
              })
            },
            AccountCode: getSelectField({
              label: { labelName: "Account Code", labelKey: "STORE_MATERIAL_ACCOUNT_CODE" },
              placeholder: {
                labelName: "Select Account Code",
                labelKey: "STORE_MATERIAL_ACCOUNT_CODE_SELECT",
              },
              required: false,
              visible:false,
              jsonPath: "materials[0].storeMapping[0].chartofAccount.glCode",
              gridDefination: {
                xs: 12,
                sm: 4,
              },
             // sourceJsonPath: "store.stores",
              props: {
                disabled:true,
                data: [
                  {
                    value: "46130",
                    label: "46130"
                  },
                 
                ],
                optionValue: "value",
                optionLabel: "label"
              },
              
            }),
            active: {
              uiFramework: "custom-containers-local",
              moduleName: "egov-store-asset",
              componentPath: "CheckboxContainer",
              jsonPath: "materials[0].storeMapping[0].active",
              gridDefination: {
                xs: 4,
              },
              isFieldValid: true,
              required: false,
        
              props: {
                content: "STORE_MATERIAL_TYPE_ACTIVE",
                jsonPath: "materials[0].storeMapping[0].active",
                screenName: "search-material-master",
                checkBoxPath:
                  "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.active",
              },
            },
          },
          {
            style: {
              overflow: "visible"
            }
          }
        )
      }),
            // set active true
            onMultiItemAdd: (state, muliItemContent) => {          
              let preparedFinalObject = get(
                state,
                "screenConfiguration.preparedFinalObject",
                {}
              );
              let cardIndex = get(muliItemContent, "store.index");
            if(preparedFinalObject){
              set(preparedFinalObject.materials[0],`storeMapping[${cardIndex}].active` , true);
            } 
              //console.log("click on add");
            return muliItemContent;
          },
      items: [],
      addItemLabel: {
        labelName: "ADD STORE",
        labelKey: "STORE_MATERIAL_MAP_ADD"
      },
      headerName: "Store",
      headerJsonPath:
        "children.cardContent.children.header.children.head.children.Accessories.props.label",
      sourceJsonPath: "materials[0].storeMapping",
      prefixSourceJsonPath:
        "children.cardContent.children.storeDetailsCardContainer.children"
    },
    type: "array"
  };
  
  export const storeDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Material Map to Stpre Details",
        labelKey: "STORE_MATERIAL_MAP_STORE_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    storeDetailsCard
  });