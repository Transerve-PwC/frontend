import { getCommonGrayCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getFeesEstimateCard } from "../../utils";

const estimate = getCommonGrayCard({
  estimateSection: getFeesEstimateCard({
    sourceJsonPath: "OwnersTemp[0].estimateCardData"
  })
});

export default estimate;
