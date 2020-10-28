import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonTitle,
  getSelectField,
  getTextField,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { addComponentJsonpath } from "egov-ui-framework/ui-utils/commons";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import "./index.css";

const showComponent = (
  dispatch,
  componentJsonPath,
  display,
  oldStyle = {}
) => {
  let displayProps = display ?
    {
      ...oldStyle,
      display: 'block'
    } :
    {
      ...oldStyle,
      display: "none"
    };
  dispatch(
    handleField(
      "view-property-detail",
      componentJsonPath,
      "props.style",
      displayProps
    )
  );
};


const commonApplicantInformation = () => {
  return getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Details of Authorised Person",
        labelKey: "PT_COMMON_OWNER_INFORMATION"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    applicantCard: getCommonContainer({
      mobileNumber: getTextField({
        label: {
          labelName: "Mobile No.",
          labelKey: "PT_COMMON_APPLICANT_MOBILE_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter Mobile No.",
          labelKey: "PT_COMMON_APPLICANT_MOBILE_NO_PLACEHOLDER"
        },
        required: true,
        props: {
          disabled :true,
          className: "applicant-details-error"
        },
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Properties[0].owners[0].mobileNumber",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      applicantName: getTextField({
        label: {
          labelName: "Name",
          labelKey: "PT_COMMON_APPLICANT_NAME_LABEL"
        },
        placeholder: {
          labelName: "Enter Name",
          labelKey: "PT_COMMON_APPLICANT_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "Invalid Name",
        jsonPath: "Properties[0].owners[0].name",
        props: {
          disabled :true,
          className: "applicant-details-error"
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      // genderRadioGroup: {
      //   uiFramework: "custom-containers",
      //   componentPath: "RadioGroupContainer",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 12,
      //     md: 6
      //   },
      //   jsonPath: "Property.owners[0].gender",
      //   props: {
      //     label: { name: "Gender", key: "PT_COMMON_GENDER_LABEL" },
      //     className: "applicant-details-error",
      //     buttons: [
      //       {
      //         labelName: "Male",
      //         labelKey: "PT_COMMON_GENDER_MALE",
      //         value: "MALE"
      //       },
      //       {
      //         labelName: "FEMALE",
      //         labelKey: "PT_COMMON_GENDER_FEMALE",
      //         value: "FEMALE"
      //       },
      //       {
      //         labelName: "Transgender",
      //         labelKey: "PT_COMMON_GENDER_TRANSGENDER",
      //         value: "TRANSGENDER"
      //       }
      //     ],
      //     jsonPath: "Property.owners[0].gender",
      //     required: true,
      //     errorMessage: "Required",
      //   },
      //   required: true,
      //   type: "array"
      // },
      guardianName: getTextField({
        label: {
          labelName: "Father/Husband's Name",
          labelKey: "PT_COMMON_FATHER_OR_HUSBAND_NAME"
        },
        placeholder: {
          labelName: "Enter Father/Husband's Name",
          labelKey: "PT_COMMON_ENTER_FATHER_OR_HUSBAND_NAME"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "Invalid Name",
        jsonPath: "Properties[0].owners[0].fatherOrHusbandName",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6
        },
        props: {
          disabled :true,
          className: "applicant-details-error"
        }
      }),
      // relationshipWithGuardian: getSelectField({
      //   label: {
      //     labelName: "Relationship with Guardian",
      //     labelKey: "PT_COMMON_APPLICANT_RELATIONSHIP_LABEL"
      //   },
      //   placeholder: {
      //     labelName: "Select Relationship with Guardian",
      //     labelKey: "PT_COMMON_APPLICANT_RELATIONSHIP_PLACEHOLDER"
      //   },
      //   required: true,
      //   jsonPath: "Property.owners[0].relationship",
      //   data: [{ code: "FATHER" }, { code: "HUSBAND" }],
      //   localePrefix: {
      //     moduleName: "common-masters",
      //     masterName: "OwnerType"
      //   },
      //   //sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 2,
      //     md: 2
      //   }
      // }),
      applicantAddress: getTextField({
        label: {
          labelName: "Correspondence Address",
          labelKey: "PT_COMMON_CORRESPONDENCE_ADDRESS_LABEL"
        },
        placeholder: {
          labelName: "Enter Correspondence Address",
          labelKey: "PT_COMMON_CORRESPONDENCE_ADDRESS_PLACEHOLDER"
        },
        pattern: getPattern("Address"),
        required: true,
        errorMessage: "Invalid Address",
        jsonPath: "Properties[0].owners[0].correspondenceAddress",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          disabled :true,
          className: "applicant-details-error"
        }
      }),
      // specialApplicantCategory: getSelectField({
      //   label: {
      //     labelName: "Special Applicant Category",
      //     labelKey: "PT_COMMON_SPECIAL_APPLICANT_CATEGORY_LABEL"
      //   },
      //   placeholder: {
      //     labelName: "Select Special Applicant Category",
      //     labelKey: "PT_COMMON_SPECIAL_APPLICANT_CATEGORY_PLACEHOLDER"
      //   },
      //   jsonPath: "Property.owners[0].ownerType",
      //   required: true,
      //   localePrefix: {
      //     moduleName: "common-masters",
      //     masterName: "OwnerType"
      //   },
      //   sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 12,
      //     md: 6
      //   }
      // }),
    })
  });
};

export const propertyOwnershipDetails = commonApplicantInformation();
export const propertyOwnershipDetails1 = getCommonCard({
  // header: getCommonTitle(
  //   {
  //     labelName: "Transferee Details",
  //     labelKey: "PT_COMMON_PROPERTY_OWNERSHIP_DETAILS_HEADER"
  //   },
  //   {
  //     style: {
  //       marginBottom: 18
  //     }
  //   }
  // ),
  // break: getBreak(),
  individualApplicantInfo: commonApplicantInformation(),
 // applicantTypeContainer: getCommonContainer({
//     applicantTypeSelection: getCommonContainer({
//       applicantType: {
//         ...getSelectField({
//           label: {
//             labelName: "Ownership Type",
//             labelKey: "PT_COMMON_OWNERSHIP_TYPE"
//           },
//           placeholder: {
//             labelName: "Select Ownership Type",
//             labelKey: "PT_COMMON_SELECT_OWNERSHIP_TYPE"
//           },
//           jsonPath: "Property.ownershipCategory",
//           localePrefix: {
//             moduleName: "common-masters",
//             masterName: "OwnerShipCategory"
//           },
//           required: true,
//           sourceJsonPath: "OwnershipCategory",
//           gridDefination: {
//             xs: 12,
//             sm: 12,
//             md: 6
//           },
//           props: {
//             className: "applicant-details-error"
//           }
//         }),
//         beforeFieldChange: (action, state, dispatch) => {

//           let path = "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer.children.institutionType.children.cardContent.children.institutionTypeDetailsContainer.children.privateInstitutionTypeDetails";


//           let applicantType = get(
//             state,
//             "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.Institutions",
//             []
//           );
//           let applicantSubType = applicantType
//             .filter(
//               item => item
//                 .active &&
//                 item
//                   .parent
//                   .startsWith(action.value)
//             );
//           dispatch(
//             handleField(
//               "view-property-detail",
//               path,
//               "props.data",
//               applicantSubType
//             )
//           );

//           let singleApplicantContainerJsonPath =
//             "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer";
//           let multipleApplicantContainerJsonPath =
//             "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer"
//           let institutionContainerJsonPath =
//             "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer";
//           let institutionTypeContainerJsonPath = "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer";

//           if (action.value.includes("SINGLEOWNER")) {
//             showComponent(
//               dispatch,
//               singleApplicantContainerJsonPath,
//               true,
//               get(
//                 state,
//                 `screenConfiguration.screenConfig.view-property-detail.${singleApplicantContainerJsonPath}.props.style`
//               )
//             );
//             showComponent(
//               dispatch,
//               multipleApplicantContainerJsonPath,
//               false,
//               get(
//                 state,
//                 `screenConfiguration.screenConfig.view-property-detail.${multipleApplicantContainerJsonPath}.props.style`
//               )
//             );
//             showComponent(
//               dispatch,
//               institutionContainerJsonPath,
//               false,
//               get(
//                 state,
//                 `screenConfiguration.screenConfig.view-property-detail.${institutionContainerJsonPath}.props.style`
//               )
//             );
//             showComponent(
//               dispatch,
//               institutionTypeContainerJsonPath,
//               false,
//               get(
//                 state,
//                 `screenConfiguration.screenConfig.view-property-detail.${institutionTypeContainerJsonPath}.props.style`
//               )
//             );

//           } else if (action.value.includes("INSTITUTIONAL")) {
//             dispatch(
//               handleField(
//                 "view-property-detail",
//                 path,
//                 "required",
//                 false
//               )
//             );

//             dispatch(
//               handleField(
//                 "view-property-detail",
//                 path,
//                 "props.value",
//                 ''
//               )
//             );
//             set(state.screenConfiguration.preparedFinalObject,"Property.institution.type", "");
//             dispatch(
//                 prepareFinalObject(
//                   "Property.institution.type",
//                   ""
//                 )
//               )
//             showComponent(
//               dispatch,
//               singleApplicantContainerJsonPath,
//               false,
//               get(
//                 state,
//                 `screenConfiguration.screenConfig.view-property-detail.${singleApplicantContainerJsonPath}.props.style`
//               )
//             );
//             showComponent(
//               dispatch,
//               multipleApplicantContainerJsonPath,
//               false,
//               get(
//                 state,
//                 `screenConfiguration.screenConfig.view-property-detail.${multipleApplicantContainerJsonPath}.props.style`
//               )
//             );
//             showComponent(
//               dispatch,
//               institutionContainerJsonPath,
//               true,
//               get(
//                 state,
//                 `screenConfiguration.screenConfig.view-property-detail.${institutionContainerJsonPath}.props.style`
//               )
//             );
//             showComponent(
//               dispatch,
//               institutionTypeContainerJsonPath,
//               true,
//               get(
//                 state,
//                 `screenConfiguration.screenConfig.view-property-detail.${institutionTypeContainerJsonPath}.props.style`
//               )
//             );
//           }
//           else if (action.value.includes("MULTIPLEOWNERS")) {
//             showComponent(
//               dispatch,
//               singleApplicantContainerJsonPath,
//               false,
//               get(
//                 state,
//                 `screenConfiguration.screenConfig.view-property-detail.${singleApplicantContainerJsonPath}.props.style`
//               )
//             );
//             showComponent(
//               dispatch,
//               multipleApplicantContainerJsonPath,
//               true,
//               get(
//                 state,
//                 `screenConfiguration.screenConfig.view-property-detail.${multipleApplicantContainerJsonPath}.props.style`
//               )
//             );
//             showComponent(
//               dispatch,
//               institutionContainerJsonPath,
//               false,
//               get(
//                 state,
//                 `screenConfiguration.screenConfig.view-property-detail.${institutionContainerJsonPath}.props.style`
//               )
//             );
//             showComponent(
//               dispatch,
//               institutionTypeContainerJsonPath,
//               false,
//               get(
//                 state,
//                 `screenConfiguration.screenConfig.view-property-detail.${institutionTypeContainerJsonPath}.props.style`
//               )
//             );

//             addItemInMultiselect(state, dispatch);
//           }
//         },
//       },
//     }),
    // singleApplicantContainer: {
    //   uiFramework: "custom-atoms",
    //   componentPath: "Div",
    //   children: {
    //     individualApplicantInfo: commonApplicantInformation()
    //   }
    // },
   
  
 // })
});



export const addItemInMultiselect = (state, dispatch, dynamicInput = {}) => {
  const {
    screenKey = "view-property-detail",
    sourceJsonPath = "Property.owners",
    prefixSourceJsonPath = "children.cardContent.children.applicantCard.children",
    componentJsonpath = "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.children.multipleApplicantInfo",
  } = dynamicInput;
  const screenConfig = get(state, "screenConfiguration.screenConfig", {});
  const scheama = get(screenConfig, `${screenKey}.${componentJsonpath}.props.scheama`, {});
  const items = get(screenConfig, `${screenKey}.${componentJsonpath}.props.items`, []);
  const itemsLength = items.length;

  if (sourceJsonPath) {
    let multiItemContent = get(scheama, prefixSourceJsonPath, {});
    for (var variable in multiItemContent) {
      if (
        multiItemContent.hasOwnProperty(variable) &&
        multiItemContent[variable].props &&
        multiItemContent[variable].props.jsonPath
      ) {
        let prefixJP = multiItemContent[variable].props.jsonPathUpdatePrefix
          ? multiItemContent[variable].props.jsonPathUpdatePrefix
          : sourceJsonPath;
        let splitedJsonPath = multiItemContent[variable].props.jsonPath.split(
          prefixJP
        );
        if (splitedJsonPath.length > 1) {
          let propertyName = splitedJsonPath[1].split("]");
          if (propertyName.length > 1) {
            multiItemContent[
              variable
            ].jsonPath = `${prefixJP}[${itemsLength}]${propertyName[1]}`;
            multiItemContent[
              variable
            ].props.jsonPath = `${prefixJP}[${itemsLength}]${
              propertyName[1]
              }`;
            multiItemContent[variable].index = itemsLength;
          }
        }
      }
    }

    set(scheama, prefixSourceJsonPath, multiItemContent);
  }
  items[itemsLength] = cloneDeep(
    addComponentJsonpath(
      { [`item${itemsLength}`]: scheama },
      `${componentJsonpath}.props.items[${itemsLength}]`
    )
  );
  dispatch(handleField(screenKey, componentJsonpath, `props.items`, items));

}