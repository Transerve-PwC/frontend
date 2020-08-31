import { getCommonHeader, getCommonCard, getCommonTitle, getCommonContainer, getLabel, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import "./index.css"
import { searchVendorResultErrorResponse, serachVendorErrorResultGrid } from "./searchResultApiResponse";
import { FileUpload, SampleFileDownload } from "./serachResultGrid";
import { showHideAdhocPopupVendorError } from "../../utils";

const viewErrorButton = getCommonContainer({
    viewErroeButton: {
        componentPath: "Button",
        props: {
            variant: "contained",
            // color: "primary",
            style: {
                minWidth: "200px",
                height: "48px",
                // marginRight: "40px",
                color: "#3366BB",
                boxShadow: "unset",
                backgroundColor: "unset",
                textDecoration: "underline"
            }
        },
        children: {
            viewErrorButtonLabel: getLabel({
                labelName: "View Error Data",
                labelKey: "EC_VENDOR_ERROR_DATA"
            }),

        },
        onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
                searchVendorResultErrorResponse('', state, dispatch, '');
                showHideAdhocPopupVendorError(state, dispatch, "search")
            }
        }
    },
});
export const vendorChooseFile = getCommonCard({
    FileUpload,
    breakAfterSearch: getBreak(),
    SampleFileDownload,
     viewErrorButton,
});
