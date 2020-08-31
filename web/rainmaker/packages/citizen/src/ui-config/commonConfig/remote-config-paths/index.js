const remoteConfigPath = (path, screenKey) => {
  let config = {};
  switch (path) {
    case "tradelicence":
    case "tradelicense-citizen":
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
    case "pt-mutation":
      case "pt-common-screens":
      // case "pt-citizen":
      config = require(`egov-pt/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "fire-noc":
      config = require(`egov-noc/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-bpa":
      config = require(`egov-bpa/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-common":
      config = require(`egov-common/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "uc-citizen":
      config = require(`egov-uc/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "abg":
      config = require(`egov-abg/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-common":
      config = require(`egov-common/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "bpastakeholder":
      config = require(`egov-bpa/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "bpastakeholder-citizen":
      config = require(`egov-bpa/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "edcrscrutiny":
      config = require(`egov-bpa/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "wns":
    case "wns-citizen":
      config = require(`egov-wns/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
	case "egov-opms":
      config = require(`egov-opms/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-hc":
      config = require(`egov-hc/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-echallan":
      config = require(`egov-echallan/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;   
      case "egov-nulm":
      config = require(`egov-nulm/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    default:
      config = require(`ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
  }
  return config;
};

export default remoteConfigPath;
