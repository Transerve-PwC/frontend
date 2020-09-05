const remoteConfigPath = (path, screenKey) => {
  let config = {};
  switch (path) {
    case "tradelicence":
    case "tradelicense-citizen":
    case "fine-master":
      config = require(`egov-tradelicence/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "rented-properties":
    case "rented-properties-citizen":
      config = require(`egov-rented-properties/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "estate":
      config = require(`egov-estate/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "estate-citizen":
      config = require(`egov-estate/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-common":
      config = require(`egov-common/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    default:
      config = require(`ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
  }
  return config;
};

export default remoteConfigPath;
