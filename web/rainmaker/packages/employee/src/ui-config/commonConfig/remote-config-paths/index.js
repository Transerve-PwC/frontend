const remoteConfigPath = (path, screenKey) => {
  let config = {};
  switch (path) {
    case "tradelicence":
    case "tradelicense-citizen":
    case "fine-master":
      config = require(`egov-tradelicence/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "rented-properties":
      config = require(`egov-rented-properties/ui-config/screens/specs/${path}/${screenKey}`).default;
    case "estate":
      config = require(`egov-estate/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "pt-mutation":
      case "pt-common-screens":
      config = require(`egov-pt/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "hrms":
      config = require(`egov-hrms/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "uc":
      config = require(`egov-uc/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "bpastakeholder":
      config = require(`egov-bpa/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-bpa":
      config = require(`egov-bpa/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "fire-noc":
      config = require(`egov-noc/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "abg":
      config = require(`egov-abg/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-common":
      config = require(`egov-common/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-boilerplate":
      config = require(`egov-boilerplate/ui-config/screens/specs/${path}/${screenKey}`).default;
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
    case "egov-pr":
      config = require(`egov-pr/ui-config/screens/specs/${path}/${screenKey}`).default;
      break; 
    case "pms":
      config = require(`egov-pms/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;  
      case "egov-store-asset":
        config = require(`egov-store-asset/ui-config/screens/specs/${path}/${screenKey}`).default;
        break; 
    case "egov-echallan":
      config = require(`egov-echallan/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
	case "auction":
      config = require(`egov-echallan/ui-config/screens/specs/${path}/${screenKey}`).default;
	 break;
    case "item-master":
      config = require(`egov-echallan/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "fine-master":
      config = require(`egov-echallan/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "vendor-master":
      config = require(`egov-echallan/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    default:
      config = require(`ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
  }
  return config;
};

export default remoteConfigPath;
