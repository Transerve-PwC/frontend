import { getCommonGrayCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getFeesEstimateCard } from "../../utils";

const estimate = (sourceJsonPath) => {
  return getCommonGrayCard({
  estimateSection: getFeesEstimateCard({
    sourceJsonPath
  })
})
}

export default estimate;
