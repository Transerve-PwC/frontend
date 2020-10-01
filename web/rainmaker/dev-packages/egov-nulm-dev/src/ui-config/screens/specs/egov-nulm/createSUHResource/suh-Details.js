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

export const SuhDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "SUH Details",
      labelKey: "NULM_SUH_DETAILS"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  SuhDetailsContainer: getCommonContainer({
   
    nameOfShelter: {
      ...getTextField({
        label: {
          labelName: "Name of shelter",
          labelKey: "NULM_SUH_OF_SHELTER"
        },
        placeholder: {
          labelName: "Enter Name of shelter",
          labelKey: "NULM_SUH_NAME_OF_SHELTER_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NulmSuhRequest.nameOfShelter",       
      })
    },
    address: {
      ...getTextField({
        label: {
          labelName: "Address",
          labelKey: "NULM_SUH_ADDRESS"
        },
        placeholder: {
          labelName: "Enter Address",
          labelKey: "NULM_SUH_ADDRESS_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        jsonPath: "NulmSuhRequest.address"
      })
    },
    shelterBackground: getSelectField({
      label: { labelName: "Shelter background", labelKey: "NULM_SUH_SHELTER_BCKGROUND" },
      placeholder: {
        labelName: "Select Shelter background",
        labelKey: "NULM_SUH_SHELTER_BCKGROUND_SELECT",
      },
      required: true,
      jsonPath: "NulmSuhRequest.shelterBackground",
     sourceJsonPath: "createScreenMdmsData.NULM.shelterBackground",
      props: {
        optionValue: "code",
        optionLabel: "name",
        // data: [
        //   {
        //     code: "New under DAY NULM",
        //     name: "New under day nulm"
        //   },
        //   {
        //     code: "Existing Shelter other than DAY NULM",
        //     name: "Existing shelter other than day nulm"
        //   },
        //   {
        //     code: "Refurbished",
        //     name: "Refurbished"
        //   },
        //   {
        //     code: "Non-refurbished",
        //     name: "Non-refurbished"
        //   },
        // ],
      },
    }),
    category: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmSuhRequest.category",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmSuhRequest.category",
        label: { name: "Category", key: "NULM_SUH_CATEGORY" },
        buttons: [
          {
            labelName: "Permanent",
            labelKey: "NULM_SUH_PERMANENT",
            value:"Permanent",           
          },
          {
            label: "Temporary",
            labelKey: "NULM_SUH_TEMPORARY",
            value:"Temporary",           
          }
        ],      
       // defaultValue: "MALE"
      },
      type: "array",  
    },
    weatherCondition: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmSuhRequest.weatherCondition",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmSuhRequest.weatherCondition",
        label: { name: "All weather conditioned classification", key: "NULM_SUH_ALL_WEATHER_CONDITIONED_CLASSIFICATION" },
        buttons: [
          {
            labelName: "YES",
            labelKey: "NULM_SEP_YES",
            value:"YES",           
          },
          {
            label: "NO",
            labelKey: "NULM_SEP_NO",
            value:"NO",           
          },        
        ],      
        defaultValue: "NO"
      },
      type: "array",     
    },
    shelterClassification: getSelectField({
      label: { labelName: "classification of shelter", labelKey: "NULM_SUH_CLASSIFICATION_OF_SHELTER" },
      placeholder: {
        labelName: "Select classification of shelter",
        labelKey: "NULM_SUH_CLASSIFICATION_OF_SHELTER_SELECT",
      },
      required: true,
      jsonPath: "NulmSuhRequest.shelterClassification",
      sourceJsonPath: "createScreenMdmsData.NULM.shelterClassification",
      props: {
        optionValue: "code",
        optionLabel: "name",
        // data: [
        //   {
        //     code: "Men",
        //     name: "Men"
        //   },
        //   {
        //     code: "Women",
        //     name: "Women"
        //   },
        //   {
        //     code: "General",
        //     name: "General"
        //   },
        //   {
        //     code: "Specially-abled",
        //     name: "Specially-abled"
        //   },
        //   {
        //     code: "Family",
        //     name: "Family"
        //   },
        // ],
      },
    }),
    otherClassification: getSelectField({
      label: { labelName: "Any other classification if any", labelKey: "NULM_SUH_ANY_OTHER_CLASSIFICATION_IF_ANY" },
      placeholder: {
        labelName: "Select Any other classification if any",
        labelKey: "NULM_SUH_ANY_OTHER_CLASSIFICATION_IF_ANY_SELECT",
      },
      jsonPath: "NulmSuhRequest.otherClassification",
      sourceJsonPath: "createScreenMdmsData.NULM.shelterOtherClassification",
      required: true,
      props: {
        optionValue: "code",
        optionLabel: "name",
        // data: [
        //   {
        //     code: "Old age home",
        //     name: "Old age home"
        //   },
        //   {
        //     code: "Child Care Home",
        //     name: "Child Care Home"
        //   },
        //   {
        //     code: "Nari Niketan",
        //     name: "Nari Niketan"
        //   },
        //   {
        //     code: "Home for speciallyabled persons",
        //     name: "Home for speciallyabled persons"
        //   },
        //   {
        //     code: "Others",
        //     name: "Others"
        //   },
        // ],
      },
    }),
    ownership: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmSuhRequest.ownership",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmSuhRequest.ownership",
        label: { name: "Ownership", key: "NULM_SUH_OWNERSHIP" },
        buttons: [
          {
            labelName: "Government",
            labelKey: "NULM_SUH_GOVERNMENT",
            value:"Government",           
          },
          {
            label: "Private",
            labelKey: "NULM_SUH_PRIVATE",
            value:"Private",           
          }
        ],      
       // defaultValue: "MALE"
      },
      type: "array",  
    },
    operationAndManagementOfShelters: getSelectField({
      label: { labelName: "Operation & management of shelters", labelKey: "NULM_SUH_OPERATION_MANAGEMENT_OF_SHELTERS" },
      placeholder: {
        labelName: "Select Operation & management of shelters",
        labelKey: "NULM_SUH_OPERATION_MANAGEMENT_OF_SHELTERS_SELECT",
      },
      required: true,
      jsonPath: "NulmSuhRequest.operationAndManagementOfShelters",
      sourceJsonPath: "createScreenMdmsData.NULM.operationAndManagementOfShelters",
      props: {
        optionValue: "code",
        optionLabel: "name",
        // data: [
        //   {
        //     code: "Homeless Persons Collective",
        //     name: "Homeless Persons Collective"
        //   },
        //   {
        //     code: "Youth & Women Collective Groups",
        //     name: "Youth & Women Collective Groups"
        //   },
        //   {
        //     code: "University & Institution",
        //     name: "University & Institution"
        //   },
        //   {
        //     code: "Nehru Yuva Kendra",
        //     name: "Nehru Yuva Kendra"
        //   },
         
        //   {
        //     code: "Unorganized sector trade union",
        //     name: "Unorganized sector trade union"
        //   },
        //   {
        //     code: "NGOs/CSOs registered under Society Act, 1860",
        //     name: "NGOs/CSOs registered under Society Act, 1860"
        //   },
        //   {
        //     code: "Self Help Groups regd. Under Local Govt.",
        //     name: "Self Help Groups regd. Under Local Govt."
        //   },
        //   {
        //     code: "Resident Welfare Associations",
        //     name: "Resident Welfare Associations"
        //   },
        //   {
        //     code: "Public Sector companies",
        //     name: "Public Sector companies"
        //   },
        //   {
        //     code: "Private Sector Associations/contractor",
        //     name: "Private Sector Associations/contractor"
        //   },
        // ],
      },
    }), 
    area: {
      ...getTextField({
        label: {
          labelName: "Area (sq. Ft.)",
          labelKey: "NULM_SUH_AREA_SQ_FT"
        },
        placeholder: {
          labelName: "Enter Area (sq. Ft.)",
          labelKey: "NULM_SUH_AREA_SQ_FT_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("numeric-only") || null,
        jsonPath: "NulmSuhRequest.area"
      })
    },   
    capacity: {
      ...getTextField({
        label: {
          labelName: "Capacity (no. Of beds)",
          labelKey: "NULM_SUH_CAPACITY_NO_OF_BEDS"
        },
        placeholder: {
          labelName: "Enter Capacity (no. Of beds)",
          labelKey: "NULM_SUH_CAPACITY_NO_OF_BEDS_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("numeric-only") || null,
        jsonPath: "NulmSuhRequest.capacity"
      })
    },
    assignedTo: getSelectField({
      label: { labelName: "Assign To", labelKey: "NULM_SUH_ASSIGN_TO" },
      placeholder: {
        labelName: "Select Assign To",
        labelKey: "NULM_SUH_ASSIGN_TO_SELECT",
      },
      required: true,
      jsonPath: "NulmSuhRequest.assignedTo",
     sourceJsonPath: "createScreenMdmsData1.NULM.assignTo",
      props: {
        optionValue: "code",
        optionLabel: "name",
      },
    }),
   
  })
});