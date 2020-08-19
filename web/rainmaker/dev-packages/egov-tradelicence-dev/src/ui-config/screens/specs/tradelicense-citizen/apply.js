import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  updatePFOforSearchResults,
  getBoundaryData
} from "../../../../ui-utils/commons";
import get from "lodash/get";
import { footer } from "../tradelicence/applyResource/footer";
import { getQueryArg, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import {
  header,
  formwizardFirstStep,
  formwizardSecondStep,
  formwizardThirdStep,
  formwizardFourthStep,
  stepper,
  getMdmsData
} from "../tradelicence/apply";
import { getAllDataFromBillingSlab } from "../utils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { changeDocuments, showHideFields, setServiceType } from "../tradelicence/applyResource/tradeDetails";
import { RC_PEDAL_RICKSHAW_LOADING_REHRI, DL_PEDAL_RICKSHAW_LOADING_REHRI, LICENSE_DHOBI_GHAT, RENEWAL_RENT_DEED_SHOP } from "../../../../ui-constants";
import { getReviewDetails } from "../tradelicence/applyResource/review-trade";
import set from "lodash/set";

const tradeLicenseType = getQueryArg(window.location.href, "tlType");

const getData = async (action, state, dispatch, tenantId, applicationNumber) => {
  await getMdmsData(action, state, dispatch);
  const licenseType = get(state.screenConfiguration.preparedFinalObject,
                          "Licenses[0].businessService","") 
  let tradeTypes = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.TradeLicense.MdmsTradeType", "")
  tradeTypes = tradeTypes.map((trade, index, array) => {
    const findIndex = array.findIndex(item => item.category === trade.category);
    if(index === findIndex) {
      return {
      code: trade.category,
      label: getLocaleLabels(trade.category + "_GROUP", trade.category + "_GROUP")
    }
    }
  }).filter(item => !!item)
  set(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.TradeLicense.tradeTypes", tradeTypes)
  !!licenseType && changeDocuments(action, state, dispatch, tradeLicenseType);
  if(applicationNumber) {
    prefillData(action, state, dispatch)
    getReviewDetails(state, dispatch, "apply", "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewTradeDetails.children.cardContent.children.viewOne", "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewOne")
  } else {
    showHideFields(action, state, dispatch)
  }
  await getAllDataFromBillingSlab(tenantId, dispatch);
  await getBoundaryData(action, state, dispatch, [
    { key: "tenantId", value: tenantId }
  ]);
  dispatch(
    prepareFinalObject(
      "Licenses[0].tradeLicenseDetail.address.tenantId",
      tenantId
    )
  );
  dispatch(
    prepareFinalObject("Licenses[0].tradeLicenseDetail.address.city", tenantId)
  );
};
const updateSearchResults = async (
  action,
  state,
  dispatch,
  queryValue,
  tenantId,
  applicationNumber
) => {
  await updatePFOforSearchResults(
    action,
    state,
    dispatch,
    queryValue,
    "",
    tenantId
    );
  await getData(action, state, dispatch, tenantId, applicationNumber);
  const queryValueFromUrl = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  if (!queryValueFromUrl) {
    dispatch(
      prepareFinalObject(
        "Licenses[0].oldLicenseNumber",
        get(
          state.screenConfiguration.preparedFinalObject,
          "Licenses[0].applicationNumber",
          ""
        )
      )
    );
    dispatch(prepareFinalObject("Licenses[0].applicationNumber", ""));
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "visible",
        false
      )
    );
  }
};

const prefillData = (action, state, dispatch) => {
  const serviceType = get(state.screenConfiguration.preparedFinalObject,
    "Licenses[0].businessService","") 
  let tradeTypes = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.TradeLicense.MdmsTradeType", "")
  const licenseType = tradeTypes.find(item => item.code === serviceType).category
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.licenseType.props",
        "value",
        licenseType
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.licenseType.props",
        "disabled",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.serviceType.props",
        "disabled",
        true
      )
    );
    dispatch(
      handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children._licensePeriod",
              "props.disabled",
              serviceType ===  DL_PEDAL_RICKSHAW_LOADING_REHRI
      )
  )
  setServiceType(action, state, dispatch, licenseType, "apply", "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.serviceType.props")
    const data = {
      applicationType: serviceType === RC_PEDAL_RICKSHAW_LOADING_REHRI || serviceType === DL_PEDAL_RICKSHAW_LOADING_REHRI || serviceType === LICENSE_DHOBI_GHAT,
      licensePeriod: serviceType === RC_PEDAL_RICKSHAW_LOADING_REHRI,
      _licensePeriod: serviceType === DL_PEDAL_RICKSHAW_LOADING_REHRI,
      occupation: serviceType === RC_PEDAL_RICKSHAW_LOADING_REHRI || serviceType === DL_PEDAL_RICKSHAW_LOADING_REHRI,
      fullAddress: serviceType === RC_PEDAL_RICKSHAW_LOADING_REHRI || serviceType === DL_PEDAL_RICKSHAW_LOADING_REHRI || serviceType === LICENSE_DHOBI_GHAT,
      completeResidentialAddress: serviceType === RENEWAL_RENT_DEED_SHOP,
      permanentAddress: serviceType === RENEWAL_RENT_DEED_SHOP,
      familyMonthlyIncome: serviceType === RENEWAL_RENT_DEED_SHOP,
      trade: serviceType === LICENSE_DHOBI_GHAT || serviceType === RENEWAL_RENT_DEED_SHOP,
      particularsOfArea: serviceType === LICENSE_DHOBI_GHAT,
      platformNumber: serviceType === RENEWAL_RENT_DEED_SHOP,
      placeOfWork: serviceType === RENEWAL_RENT_DEED_SHOP,
      businessStartDate: serviceType === RENEWAL_RENT_DEED_SHOP
  }
  showHideFields(action, state, dispatch, data)
}


const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(
      prepareFinalObject(
        "Licenses",
        []
      )
    )
    dispatch(
      prepareFinalObject(
        "LicensesTemp",
        []
      )
    )
    const queryValue = getQueryArg(window.location.href, "applicationNumber") || get(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0].applicationNumber",
      null
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const applicationNo = queryValue
      ? queryValue
      : get(
          state.screenConfiguration.preparedFinalObject,
          "Licenses[0].oldLicenseNumber",
          null
        );
    
    if (applicationNo) {
      updateSearchResults(action, state, dispatch, applicationNo, tenantId, queryValue);
    } else {
      getData(action, state, dispatch, tenantId, queryValue);
    }
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
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
        // formwizardSecondStep,
        formwizardThirdStep,
        formwizardFourthStep,
        footer
      }
    },
    breakUpDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-tradelicence",
      componentPath: "ViewBreakupContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "apply"
      }
    }
  }
};

export default screenConfig;
