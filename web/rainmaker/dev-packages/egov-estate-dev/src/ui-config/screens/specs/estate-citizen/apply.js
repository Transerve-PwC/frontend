import { getCommonHeader, getTextField, getCommonContainer, getCommonCard, getSelectField, getPattern, getDateField, getCommonTitle, getCommonParagraph } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import {first_step} from './first_step.json';
import {preview} from './preview.json';
import {footer, stepper} from './footer'
import { get } from "lodash";

const header = getCommonHeader({
    labelName: "Apply",
    labelKey: "EST_COMMON_APPLY"
  });

const formwizardFirstStep = {
    uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
  }
}

const documentList = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-estate",
  componentPath: "DocumentListContainer",
  props: {
    buttonLabel: {
      labelName: "UPLOAD FILE",
      labelKey: "TL_BUTTON_UPLOAD FILE"
    },
    downloadButtonLabel: {
      labelName: "DOWNLOAD FILE",
      labelKey: "TL_BUTTON_DOWNLOAD_FILE"
    },
    inputProps : [],
    documentTypePrefix: "EST_",
    documentsJsonPath: "temp[0].documents",
    uploadedDocumentsJsonPath: "temp[0].uploadedDocsInRedux",
    tenantIdJsonPath: "ch.chandigarh",
    removedJsonPath: "temp[0].removedDocs"
  }
};

const documentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "TL_NEW-UPLOAD-DOCS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  paragraph: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "TL_NEW-UPLOAD-DOCS_SUBHEADER"
  }),
  documentList
})

const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    documentDetails
  },
  visible: false
}

const prepareDocuments = (documents, jsonPath) => {
  let documentsArr =
    documents.length > 0
      ? documents.reduce((documentsArr, item, ind) => {
        documentsArr.push({
          name: item.code,
          required: item.required,
          jsonPath: `${jsonPath}[${ind}]`,
          statement: item.description
        });
        return documentsArr;
      }, [])
      : [];
  return documentsArr;
};

const setDocumentData = async(action, state, dispatch, {screenKey, screenPath}) => {
  const {jsonPath, documentList = []} = require("./second_step.json");
  const documents = documentList.map(item => ({
    type: item.code,
    description: {
      labelName: "Only .jpg and .pdf files. 6MB max file size.",
      labelKey: item.fileType
    },
    formatProps :{
      accept : item.accept || "image/*, .pdf, .png, .jpeg",
    }, 
    maxFileSize: 6000,
    downloadUrl: item.downloadUrl,
    moduleName: "RentedProperties",
    statement: {
        labelName: "Allowed documents are Aadhar Card / Voter ID Card / Driving License",
        labelKey: item.description
    }
    }))
    const documentTypes = prepareDocuments(documentList, jsonPath);
    let applicationDocs = get(
      state.screenConfiguration.preparedFinalObject,
      jsonPath,
      []
    ) || [];
    applicationDocs = applicationDocs.filter(item => !!item)
    let applicationDocsReArranged =
      applicationDocs &&
      applicationDocs.length &&
      documentTypes.map(item => {
        const index = applicationDocs.findIndex(
          i => i.documentType === item.name
        );
        return applicationDocs[index];
      }).filter(item => !!item)
    applicationDocsReArranged &&
      dispatch(
        prepareFinalObject(
          jsonPath,
          applicationDocsReArranged
        )
      );
    dispatch(
      handleField(
          screenKey,
          screenPath,
          "props.inputProps",
          documents
      )
  );
    dispatch(prepareFinalObject("temp[0].documents", documentTypes))
}

const headerObj = value => {
    return getCommonHeader({
        labelName: value,
        labelKey: value
    })
}

const getField = item => {

  const {label: labelItem, placeholder, type, pattern, editable = true, ...rest } = item
  
  let fieldProps = {
    label : {
      labelName: labelItem,
      labelKey: labelItem
    },
     placeholder : {
      labelName: placeholder,
      labelKey: placeholder
    },
     gridDefination : {
      xs: 12,
      sm: 6
    },
    props: { disabled: !editable }
  }

  fieldProps = !!pattern ? {...fieldProps, pattern: getPattern(pattern)} : fieldProps

  switch(type) {
    case "TEXT_FIELD": {
      return getTextField({
        ...fieldProps,
        ...rest
    })
    }
    case "DROP_DOWN": {
      return getSelectField({
        ...fieldProps,
        ...rest
      })
    }
    case "DATE_FIELD": {
      return getDateField({
        ...fieldProps,
        ...rest,
        props: {...fieldProps.props, inputProps: {
          max: getTodaysDateInYMD()
      }
      },
        pattern: getPattern("Date")
      })
    }
    case "TEXT_AREA": {
      return getTextField({
        ...fieldProps,
        ...rest,
        props:{
          ...fieldProps.props,
          multiline: true,
          rows: "2"
        }
      })
    }
    default: return getTextField({
      ...fieldProps,
      ...rest
  })
  }
}

const getDetailsContainer = ({fields = []}) => {
    const values = fields.reduce((acc, field) => {
      return {...acc, [field.label]: getField(field)}
    }, {})
    return getCommonContainer(values);
}

const setThirdStep = async (action, state, dispatch) => {
  const {sections = []} = preview;
}

const getData = async (action, state, dispatch) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 0)
    })
    let { sections = [] } =  first_step;
    sections = sections.reduce((acc, section) => {
        return {
        ...acc, 
        [section.header]: getCommonCard({
            header: headerObj(section.header),
            details_container: getDetailsContainer(section)
        })
    }
    }, {})
    dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFirstStep",
          "children",
          sections
        )
      );
    setDocumentData(action, state, dispatch, {screenKey: "apply", screenPath: "components.div.children.formwizardSecondStep.children.documentDetails.children.cardContent.children.documentList"})
    setThirdStep(action, state, dispatch)
}

const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    // reviewDetails
  },
  visible: false
}

const commonApply = {
    uiFramework: "material-ui",
    name: "apply",
    beforeInitScreen: (action, state, dispatch) => {
        getData(action, state, dispatch)
        return action;
      },
      components: {
        div: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            className: "common-div-css"
          },
          children: {
            headerDiv: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              children: {
                header: {
                  gridDefination: {
                    xs: 12,
                    sm: 10
                  },
                  ...header
                }
              }
            },
            stepper,
            formwizardFirstStep,
            formwizardSecondStep,
            formwizardThirdStep,
            footer
          }
        }
      }
}

export default commonApply;