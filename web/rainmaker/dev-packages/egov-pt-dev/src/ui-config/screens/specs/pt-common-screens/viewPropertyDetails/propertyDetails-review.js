import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import {getpropertyAssemblyDetailsView} from './view-propertyAssembly-details';
import {getpropertyLocationDetailsView} from './viewPropertyLocationDetails';
import {getpropertyOwnerDetailsView} from './viewPropertyOwnershipDetails';
import { poCommonFooter } from "./footer";

export const viewPropertyDetails = isReview => {
  const viewpropertyAssemblyDetails = getpropertyAssemblyDetailsView(isReview);
  const viewpropertyLocationDetails = getpropertyLocationDetailsView(isReview);
  const viewpropertyOwnerDetails = getpropertyOwnerDetailsView(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    viewpropertyAssemblyDetails,
    viewpropertyLocationDetails,
    viewpropertyOwnerDetails,
    footer
  });
};
