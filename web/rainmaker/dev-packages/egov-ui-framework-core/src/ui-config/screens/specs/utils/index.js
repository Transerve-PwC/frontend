import { handleScreenConfigurationFieldChange as handleField } from "../../../../ui-redux/screen-configuration/actions";
import { getTranslatedLabel } from "../../../../ui-utils/commons";

const appCardHeaderStyle = (colorOne = "#ec407a", colorTwo = "#d81b60") => {
  return {
    color: "#FFFFFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50px",
    padding: "15px",
    marginTop: "-36px",
    borderRadius: "3px",
    background: `linear-gradient(60deg,${colorOne} ,${colorTwo} )`,
    boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)"
  };
};

export const getStepperObject = (
  stpperProps,
  stepsData,
  uiFramework = "material-ui"
) => {
  let stepperData = {};
  if (uiFramework === "material-ui") {
    stepperData = {
      componentPath: "Stepper",
      uiFramework: "custom-molecules",
      props: {
        steps: stepsData,
        ...stpperProps.props
      }
    };
  }
  return stepperData;
};

export const getCommonHeader = (header, props) => {
  return {
    componentPath: "Typography",
    props: {
      variant: "headline",
      ...props
    },
    children: {
      // [header]: getLabel(header)
      key: getLabel(header)
    }
  };
};

export const getCommonTitle = (header, props = {}) => {
  return getCommonHeader(header, { variant: "title", ...props });
};

export const getCommonSubHeader = (header, props = {}) => {
  return getCommonHeader(header, { variant: "subheading", ...props });
};

export const getCommonParagraph = (paragraph, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        color: "rgba(0, 0, 0, 0.60)",
        fontFamily: "Roboto",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "20px",
        marginBottom: "12px",
        position: "relative",
        top: "1px",
        flex: "none"
      },
      ...props
    },

    children: {
      [paragraph]: getLabel(paragraph)
    }
  };
  // getCommonHeader(paragraph, { variant: "body1", ...props });
};

export const getCommonCaption = (paragraph, props = {}) => {
  return getCommonHeader(paragraph, { variant: "caption", ...props });
};

export const getCommonValue = (value, props = {}) => {
  return getCommonHeader(value, { variant: "body2", ...props });
};

export const getCommonCard = (children, cardProps = {}) => {
  return {
    componentPath: "Card",
    props: {
      ...cardProps
    },
    children: {
      cardContent: {
        componentPath: "CardContent",
        children
      }
    }
  };
};

export const getCommonCardWithHeader = (
  children,
  header = {},
  cardProps = {}
) => {
  return getCommonCard({
    cardContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        header: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            style: appCardHeaderStyle()
          },
          children: header,
          gridDefination: {
            xs: 12
          }
        },
        body: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children,
          gridDefination: {
            xs: 12
          }
        }
      }
    }
  });
};

export const getCommonGrayCard = children => {
  return getCommonCard(children, {
    style: {
      backgroundColor: "rgb(242, 242, 242)",
      boxShadow: "none",
      borderRadius: 0,
      overflow: "visible"
    }
  });
};

export const getBreak = (props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Break",
    props
  };
};

export const getLabel = (label, labelKey, props = {}) => {
  return {
    uiFramework: "custom-containers",
    componentPath: "LabelContainer",
    props: {
      ...label,
      ...props
    }
  };
};

export const getSelectField = selectScheama => {
  return getTextField({
    ...selectScheama,
    props: { select: true, ...selectScheama.props }
  });
};

export const getDateField = dateScheama => {
  return getTextField({
    ...dateScheama,
    props: {
      type: "date",
      ...dateScheama.props
    }
  });
};

export const getTimeField = timeScheama => {
  return getTextField({
    ...timeScheama,
    props: {
      type: "time",
      ...timeScheama.props
    }
  });
};

export const getDateTimeField = dateTimeScheama => {
  return getTextField({
    ...dateTimeScheama,
    props: {
      type: "datetime-local",
      ...dateTimeScheama.props
    }
  });
};

export const getTextField = textScheama => {
  const {
    label = {},
    placeholder = {},
    localePrefix = {},
    required = false,
    pattern,
    jsonPath = "",
    sourceJsonPath = "",
    cityDropdown = "",
    data = [],
    optionValue = "code",
    optionLabel = "code",
    iconObj = {},
    gridDefination = {
      xs: 12,
      sm: 6
    },
    props = {},
    minLength,
    maxLength,
    minValue,
    maxValue,
    infoIcon,
    title = {},
    errorMessage = "",
    requiredMessage = "",
    ...rest
  } = textScheama;
  return {
    uiFramework: "custom-containers",
    componentPath: "TextFieldContainer",
    props: {
      label,
      InputLabelProps: {
        shrink: true
      },
      placeholder,
      localePrefix,
      fullWidth: true,
      required,
      data,
      optionValue,
      optionLabel,
      sourceJsonPath,
      cityDropdown,
      jsonPath,
      iconObj,
      title,
      infoIcon,
      errorMessage,
      ...props
    },
    gridDefination,
    required,
    pattern,
    jsonPath,
    minLength,
    maxLength,
    minValue,
    maxValue,
    errorMessage,
    requiredMessage,
    ...rest
  };
};

export const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
  if (labelKey) {
    let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
    if (!translatedLabel || labelKey === translatedLabel) {
      return label;
    } else {
      return translatedLabel;
    }
  } else {
    return label;
  }
};

export const getCheckBoxwithLabel = (
  label,
  gridDefination = {
    xs: 12,
    sm: 12
  },
  props = {}
) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination,
    props,
    children: {
      div: {
        uiFramework: "material-ui",
        componentPath: "Checkbox",
        props: {
          color: "primary"
        }
      },
      label: getLabel(label)
    }
  };
};

export const getRadiobuttonwithLabel = (label, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props,
    children: {
      div: {
        uiFramework: "material-ui",
        componentPath: "Radio",
        props: {
          color: "primary"
        }
      },
      label: getLabel(label)
    }
  };
};

export const getRadiobuttonGroup = (
  labels,
  gridDefination = {
    xs: 12,
    sm: 12
  }
) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    gridDefination,
    children:
      labels &&
      labels.map(label => {
        return getRadiobuttonwithLabel(label);
      })
  };
};

export const getRadioButton = (buttons, jsonPath, defaultValue) => {
  return {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 4
    },

    props: {
      buttons,
      jsonPath,
      defaultValue
    },
    jsonPath
  };
};

export const getCommonContainer = (children, props = {}) => {
  return {
    componentPath: "Grid",
    props: {
      container: true,
      ...props
    },
    children
  };
};

export const getDivider = (props = {}) => {
  return {
    componentPath: "Divider",
    props
  };
};

export const dispatchMultipleFieldChangeAction = (
  screenKey,
  actionDefination = [],
  dispatch
) => {
  for (var i = 0; i < actionDefination.length; i++) {
    const { path, property, value } = actionDefination[i];
    dispatch(handleField(screenKey, path, property, value));
  }
};

export const getLabelWithValue = (label, value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 12,
      sm: 4,
      md: 3
    },
    props: {
      style: {
        marginBottom: "16px",
        wordBreak: "break-word",
        marginRight: "8px",
      },
      ...props
    },
    children: {
      label: getCommonCaption(label),
      value: getCommonValue(value)
    }
  };
};

export const convertEpochToDate = dateEpoch => {
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${day}/${month}/${year}`;
};

export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

export const getTabs = (list, props = {}) => {
  return {
    uiFramework: "material-ui",
    componentPath: "Tabs",
    props,
    children:
      list &&
      list.map(element => {
        return getTab(element);
      })
  };
};

export const getTab = (label, props = {}) => {
  return {
    uiFramework: "material-ui",
    componentPath: "Tab",
    props: {
      label,
      ...props
    }
  };
};

export const getTodaysDateInYMD = () => {
  let date = new Date();
  //date = date.valueOf();
  let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${date.getFullYear()}-${month}-${day}`;
  // date = epochToYmdDate(date);
  return date;
};

export const getTodaysDateInDMY = () => {
  let date = new Date();
  //date = date.valueOf();
  let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${day}-${month}-${date.getFullYear()}`;
  // date = epochToYmdDate(date);
  return date;
};


export const getNextMonthDateInYMD = () => {
  //For getting date of same day but of next month
  let date = getTodaysDateInYMD();
  date =
    date.substring(0, 5) +
    (parseInt(date.substring(5, 7)) + 1) +
    date.substring(7, 10);
  return date;
};


export const getPattern = type => {
  switch (type) {
    case "Name":
      return /^[^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”‘’]{1,50}$/i;
    case "MobileNo":
      return /^[6789][0-9]{9}$/i;
      case "AdharCardNumber":
        return /^[0-9]{12}$/i
    case "Amount":
      return /^[0-9]{0,9}$/i;
    case "AmountFeild":
      return /^[1-9][0-9]{0,6}$/i;
     case "comments":
      return /^([\s\S]){1,1000}$/i;
    case "Email":
      return /^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/i;
    case "Address":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,500}$/i;
    case "PAN":
      return /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/i;
    case "TradeName":
      return /^[^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”‘’]{1,100}$/i;
    case "Date":
      return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/i;
    case "UOMValue":
      return /^(0)*[1-9][0-9]{0,3}$/i;
    case "OperationalArea":
      return /^(0)*[1-9][0-9]{0,6}$/i;
    case "NoOfEmp":
      return /^(0)*[1-9][0-9]{0,2}$/i;
    case "GSTNo":
      return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/i;
    case "DoorHouseNo":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,50}$/i;
    case "BuildingStreet":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,100}$/i;
    case "Pincode":
      return /^[1-9][0-9]{5}$/i;
    case "PropertyID":
      return /^[a-zA-z0-9\s\\/\-]$/i;
    case "ElectricityConnNo":
      return /^[0-9]{15}$/i;
    case "DocumentNo":
      return /^[0-9]{1,15}$/i;
    case "eventName":
      return /^[^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”‘’]{1,65}$/i;
    case "eventDescription":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,500}$/i;
    case "FireNOCNo":
      return /^[a-zA-Z0-9-]*$/i;
    case "consumerNo":
      return /^[a-zA-Z0-9/-]*$/i;
    case "VeterinaryRegistrationNo":
      return /^[a-zA-Z0-9 \/-]*$/i;
    case "VillageName":
      return /^[a-zA-Z. ]*$/i;
    case "BadageNumber":
      return /^[a-zA-Z0-9]*$/i;
    case "Amountopms":
      return /^[0-9.]{0,20}$/i;
    case "validUrl":
      return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{1,255}$/i;
    case "TextValidation":
      return /^[a-zA-Z ]{1,180}$/;
    case "AlphaNumValidation":
      return /^[a-zA-Z0-9 ]{1,180}$/i;
    case "TransitNumberValidation":
        return /^([1-9]|[1-8][0-9]|9[0-9]|[1-8][0-9]{2}|9[0-8][0-9]|99[0-9]|[1-8][0-9]{3}|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9]|10000)$/i;
    case "EventDescription":
      return /^[a-zA-Z0-9-!%:;“”‘’*=@\n\r#?\\\\~`$&^<>?{}[\]|()\\-`.+,/\"' ]{1,500}$/i;
    case "EventTitle":
      return /^[a-zA-Z0-9 ]{1,180}$/i;
    case "PReventDescription":
      return /^[^\$\"'<>?\\\\~`!@\n\r$%^()+={}\[\]*.:;“”‘’]{1,500}$/i;
    case "subjectvalidation":
      return /^[a-zA-Z0-9-!%:;“”‘’*=@\n\r#?\\\\~`$&^<>?{}[\]|()\\-`.+,/\"' ]{1,180}$/i;
    case "AlphaNumValidationLocation":
      return /^[a-zA-Z0-9-/,& ]{1,180}$/i;
    case "AlphaNumValidationsms":
      return /^[a-zA-Z0-9!@\n\r#$&()\\-`.+,/\" ]{1,180}$/i;
    case "sizeofpublication":
      return /^[0-9]{1,50}$/i;

    case "fileNumber":
      return /^[a-zA-Z0-9-!%:;“”‘’*=@#?\\\\~`$&^<>?{}[\]|()\\-`.+,/\"' ]{1,50}$/i;
    case "TextValidationWithoutSpace":
      return /^[a-zA-Z]{1,180}$/i;
    case "budget":
      return /^[0-9]{0,9}(\.[0-9]{0,2})?$/;
    case "AlphaNumSubjectSMS":
      return /^[a-zA-Z0-9~!@\n\r#$%^&*(){}[]\/.,<>:;" ]{1,180}$/i;
    case "age":
      return /^[1-9][0-9]$/i;
    case "familyMonthlyIncome":
      return /^[1-9][0-9]\d*$/i;
    case "alpha-numeric-with-space":
      return /^[a-z0-9 ]*$/i;
    case "alpha-numeric-with-space-and-newline":
      return /^[a-z0-9 \n]*$/i;
    case "alpha-numeric":
      return /^[a-z0-9]*$/i;
    case "non-empty-alpha-numeric":
      return /^[a-z0-9]+$/i;
    case "alpha-only":
      return /^[a-z]+$/i;
      case "alpha-only-with-space":
      return /^[a-z ]+$/i;
    case "numeric-only":
      return /^[0-9]*$/i;
      case "twodigit-number":
      return /^[0-9]{1,2}$/i;
      case "twodigit-number-without-zero":
      return /^([1-9]{1}\d)$|^([1-9]{1})$/i;
    case "VATNo":
      return /^\d{2}[A-Za-z0-9-!@#$%&*.?=]{8}[V]{1}$/i;
    case "CSTNo":
      return /^\d{2}[A-Za-z0-9-!@#$%&*.?=]{8}[C]{1}$/i;
    case "TINNo":
      return /^\d{2}[A-Za-z0-9-!@#$%&*.?=]{9}$/i;
      case "interestRate":
      return /^(?=.*[1-9])\d{1,2}(?:\.\d{1,2})?$/i;
    case "DecimalAmount":
      return /^\d{0,6}$/i
    case "ECViolatorAddress":
      return /^[a-zA-Z.0-9 @#%&-:\n\r]{1,512}$/i;
    case "SeizedQuantity":
      return /^[0-9]{0,9}$/i;
    case "ECViolatorName":
      return /^[a-zA-Z ]{1,256}$/i;
    case "ECItemName":
      return /^[a-zA-Z.@()/0-9 ]{1,256}$/i;
    case "ECItemDescription":
      return /^[a-zA-Z.0-9 @#/%&]{1,256}$/i;
    case "ECVehicleRegistrationNo":
      return /^[a-zA-Z0-9 -]{1,10}$/i;
    case "ECNatureOfViolation":
      return /^[a-zA-Z.0-9 @#%&-:\n\r]{1,256}$/i;
    case "ECItemRemark":
      return /^[a-zA-Z.0-9 @#%&-:\n\r]{1,256}$/i;

      //validation patterns for HC....don't use
      case "NoOfTree":
        return /^(0?[1-9]|[1-9][0-9])$/i;
      case "location":
        return /^[a-zA-Z0-9#$&?@~_|(),/,[\\\],-.,:\s,\n]{1,256}$(?!.*[<>*;={}`%+^!])/;
      case "HCServiceRequestId":
          return /^[a-zA-Z0-9#$&?@~_|,-.,:\s,\n]{1,256}$(?!.*[<>()'"/\*;={}`%+^!])/;
      case "HCMobileNo":
      return /^[0-9]{10}$/i
      case "HCEmail":
      return /(?=^.{1,256}$)(^\w+([\.]?\w+)*@\w+([\.]?\w+)*(\.\w{2,3})+$)/;
      case "HCOwnerName":
        return /^[a-zA-Z\s]{1,256}$(?!.*[<>()'"/\*;={}`%+^!–])/i;
      case "HCMobileNoSearch":
          return /^[0-9]{0,10}$/i;
      case "serviceRequestDescription":
          return  /^[a-zA-Z0-9#$&?@~_|.,:\s,]{1,256}$(?!.*[<>()'"/\*;={}`%+^!–])/;
     case "aadhar":
      return  /^[0-9]{4}$/i;
     case "aadharAcknowledgementNo":
      return  /^[0-9]{14}$/i;  
      case "typeOfRequest":
        return /^[^\$\"'<>?\\\\~`!@$%^+={}\[\]*.:;“”‘’]{1,500}$/i;
        case "areaRequired":
        return /^(0)*[1-9][0-9]{0,2}$/i;
  }
};

export const checkValueForNA = value => {
  return value && value !== "null" ? value : "NA";
};
export const getCommonLabelWithValue = (paragraph, value, props = {}) => {
  return getCommonLabelValue(paragraph, value, { variant: "caption", ...props });
}

export const getCommonLabelValue = (header, value, props) => {
  return {
    componentPath: "Typography",
    props: {
      variant: "headline",
      ...props
    },
    children: {
      // [header]: getLabel(header)
      key: getLabelForModify(header, value),
    }
  };
};

export const getLabelForModify = (label, jsonPath, props = {}) => {
  return {
    uiFramework: "custom-containers",
    componentPath: "ModifyLabelConatiner",
    props: {
      ...label,
      ...jsonPath,
      ...props
    }
  };
};

export const getLabelWithValueForModifiedLabel = (label, value, label2, value2, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 3
    },
    props: {
      style: {
        marginBottom: "16px",
        wordBreak: "break-word"
      },
      ...props
    },
    children: {
      label1: getCommonCaption(label),
      value1: getCommonValue(value),
      label2: getCommonLabelWithValue(label2, value2)
    }
  };
};