import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import "./index.css";

export const uploadimage = getCommonCard({
  // imageUpload : {
  //   uiFramework: "custom-molecules-local",
  //   moduleName: "egov-hc",
  //   componentPath: "ImageUploadMolecule",
  //   props: {
  //   formKey: `newapplication`
  //   },
  //   visible: true,
  //   // required: true
  //   },
  imageUpload : {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-rented-properties",
    componentPath: "ImageUploadMolecule",
    // componentPath: "ImageUploadMolecule",
    props: {
    formKey: `newapplication`,
    // imageLength: 6,
    hide: false,
    MAX_IMAGE_SIZE: 5000,
    labelKey: "COMMON_ERR_FILE_MORE_THAN_FIVEMB"
    },
    visible: true,
     required: true
    }
});
