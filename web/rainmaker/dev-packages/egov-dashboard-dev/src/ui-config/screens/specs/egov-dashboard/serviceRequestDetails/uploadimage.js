import {  getBreak,  getCommonCard,  getCommonContainer,  getCommonTitle,  getTextField,  getSelectField,  getPattern, getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";
import {  handleScreenConfigurationFieldChange as handleField,  prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  furnishNocResponse,  getSearchResults} from "../../../../../ui-utils/commons";
import "./index.css";

export const uploadimage = getCommonCard({
  imageUpload : {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-hc",
    componentPath: "ImageUploadMolecule",
    props: {
    formKey: `newapplication`
    },
    visible: true,
    // required: true
    },
});
