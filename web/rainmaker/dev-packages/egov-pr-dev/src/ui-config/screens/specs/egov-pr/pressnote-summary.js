import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,

} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { localStorageGet,localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { ResendPressInviteGrid} from "./searchResource/searchResults";
import { documentsPressNoteSummary } from "./summaryResource/documentsSummary";

import { pressnoteFooter } from "./applyResource/pressnoteFooter";

import { pressnoteSummary } from "./summaryResource/pressnoteSummary";

import { getTenantId } from "../../../../../../../packages/lib/egov-ui-kit/utils/localStorageUtils/index";
import {getSearchResultsViewPressnote} from "./searchResource/citizenSearchFunctions";
import { getPressGridDataforview } from "./searchResource/citizenSearchFunctions";
import "../../../../customstyle.css";
import "./publishtender.css";

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Press note Details",
    labelKey: "PR_GENERATE_PRESS_NOTE"
  })
});
const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];
  let reduxDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.documentsUploadRedux",
    {}
  );
  jp.query(reduxDocuments, "$.*").forEach(doc => {
    if (doc.documents && doc.documents.length > 0) {
      documentsPreview.push({
        title: getTransformedLocale(doc.documentCode),
        name: doc.documents[0].fileName,
        fileStoreId: doc.documents[0].fileStoreId,
        linkText: "View"
      });
    }
  });
  let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
  let fileUrls =
    fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : [];
  documentsPreview = documentsPreview.map(doc => {
    doc["link"] = fileUrls[doc.fileStoreId];



    return doc;
  });


        dispatch(prepareFinalObject("documentsPreview", documentsPreview));



        
        
}


const screenConfig = {
  uiFramework: "material-ui",
  name: "pressnote-summary",
  beforeInitScreen: (action, state, dispatch) => {

   localStorageSet("ResendInvitelist","");
   localStorageSet("ResendInvitelistAll","");
    let payload={
      "requestBody":{
              "tenantId":getTenantId(),
              "pressNoteUuid":getQueryArg(window.location.href, "pressnoteuuId") ,
             "moduleCode": localStorageGet("modulecode"),
              
      }
      
            }
			
			
		localStorageSet("resendmodule", "PRESSNOTE");
		localStorageSet("eventifforinvitatoin",getQueryArg(window.location.href, "pressnoteuuId"));
			
			
    getPressGridDataforview(action, state, dispatch);

    getSearchResultsViewPressnote(state, dispatch,payload)
   
// Hide edit buttons
set(
  action,
  "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
  false
);
set(
  action,
  "screenConfig.components.div.children.body.children.cardContent.children.pressnoteSummary.children.cardContent.children.header.children.editSection.visible",
  false
);

    prepareDocumentsView(state, dispatch);
    return action;
  },
  
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css",
       // id:"pressnote-summary"
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
              ...header,
            }
          },
        
        },
        body: getCommonCard({
        pressnoteSummary: pressnoteSummary,
        documentsSummary: documentsPressNoteSummary,
         resendbody: getCommonCard({
		 resendheader: getCommonHeader({
				labelName: "Invited Press List",
				labelKey: "PR_INVITED_PRESS_LIST"
      },
      {
        style: {
          marginBottom: 18,
        }
      }
      ),
			guestlist : ResendPressInviteGrid
		}),	
    
        }),
        pressnoteFooter: pressnoteFooter
      }
    }
  }
};

export default screenConfig;
