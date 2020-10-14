import {  getBreak,  getCommonCard,  getCommonContainer,  getCommonTitle,  getTextField,  getSelectField,  getPattern} from "egov-ui-framework/ui-config/screens/specs/utils";

const uploadimage = getCommonCard({
  imageUpload : {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-rented-properties",
    componentPath: "ImageUploadMolecule",
    // componentPath: "ImageUploadMolecule",
    props: {
    formKey: `newapplication`,
    // imageLength: 6,
    hide: false,
    MAX_IMAGE_SIZE: 6000,
    labelKey: "RP_ERR_FILE_MORE_THAN_SIXMB"
    },
    visible: true,
     required: true
    }
});


const imageuploadHeader = getCommonTitle(
    {
        labelName: "Transit Site Images Upload",
        labelKey: "RP_TRANSIT_SITE_IMAGE_UPLOAD_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

  const getimageUploadDetails = () => {
    return {
        header: imageuploadHeader,
        // detailsContainer: getCommonContainer({
        //     uploadimage
        // })
        uploadimage
    }
}


  export const imageUploadDetailsProperties = getCommonCard(getimageUploadDetails())