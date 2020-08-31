

const appName = process.env.REACT_APP_NAME;

//GET methods
export const getAccessToken = () => {
  return localStorageGet(`token`);
};
export const getUserInfo = () => {
  return localStorageGet("user-info");
};
export const getTenantId = () => {
  return localStorageGet("tenant-id");
};
export const getLocalization = (key) => {
  return localStorage.getItem(key);
};
export const getLocale = () => {
  return localStorage.getItem("locale");
};

export const getDefaultLocale = () => {
  return localStorage.getItem("defaultLocale");
};
export const getPGRSector = () => {
  return localStorage.getItem("PGRSector");
};

export const getapplicationType = () => {
  return localStorage.getItem("applicationType");
};

export const getapplicationNumber = () => {
  return localStorage.getItem("ApplicationNumber");
};

export const getapplicationMode = () => {
  return localStorage.getItem("applicationMode");
};

export const getOPMSTenantId = () => {
  return localStorage.getItem('opms-tenant-id');
};

export const getServiceRequestStatus = () => {
  return localStorage.getItem("ServiceRequestStatus");
};

export const getSLADays = () => {
  return localStorage.getItem("SLADays");
};
export const getCurrentAssignee = () => {
  return localStorage.getItem("CurrentAssignee");
};

export const getEncroachmentType = () => {
  return localStorage.getItem('encroachmentType');
};
export const getModule = () => {
  return localStorage.getItem("module");
};
export const getHCRoles = () => {
  return localStorage.getItem("HCRoles");
};

export const getEChallanPaymentMailSent = () => {
  return localStorage.getItem('EChallanPaymentMailSent');
};


//SET methods 
export const setHCRoles = (HCRoles) => {
  localStorageSet("HCRoles", HCRoles, null);
};

export const setCurrentAssignee = (CurrentAssignee) => {
  localStorageSet("CurrentAssignee", CurrentAssignee, null);
};
export const setSLADays = (SLADays) => {
  localStorageSet("SLADays", SLADays, null);
};
export const setServiceRequestStatus = (ServiceRequestStatus) => {
  localStorageSet("ServiceRequestStatus", ServiceRequestStatus, null);
}; 
export const setUserInfo = (userInfo) => {
  localStorageSet("user-info", userInfo, null);
};
export const setAccessToken = (token) => {
  localStorageSet("token", token, null);
};
export const setRefreshToken = (refreshToken) => {
  localStorageSet("refresh-token", refreshToken, null);
};
export const setTenantId = (tenantId) => {
  localStorageSet("tenant-id", tenantId, null);
};
export const setLocale = (locale) => {
  localStorageSet("locale", locale);
};
export const setReturnUrl = (url) => {
  localStorageSet("returnUrl", url);
};

export const setDefaultLocale = (locale) => {
  localStorageSet("defaultLocale", locale);
};
export const setPGRSector = (locale) => {
  localStorageSet("PGRSector", locale);
};

export const setapplicationType = (applicationTypeName) => {
  localStorageSet("applicationType", applicationTypeName);
};

export const setapplicationNumber = (applicationNumber) => {
  localStorageSet("ApplicationNumber", applicationNumber);
};

export const setapplicationMode = (applicationMode) => {
  localStorageSet("applicationMode", applicationMode);
};
export const setOPMSTenantId = (OPMSTenantId) => {
  localStorageSet('opms-tenant-id',OPMSTenantId);
};
export const setModule = (moduleName) => {
  localStorageSet("module", moduleName);
};


export const seteventid = (eventId) => {
  localStorageSet("eventId", eventId);
};
export const seteventuuid = (eventuuId) => {
  localStorageSet("eventuuId", eventuuId);
};

export const setEncroachmentType = (encroachmentType) => {
  localStorageSet('encroachmentType',encroachmentType);
};

export const setEChallanPaymentMailSent = (isChallanPayMailSent) => {
  localStorageSet('EChallanPaymentMailSent',isChallanPayMailSent);
};


//Remove Items (LOGOUT)
export const clearUserDetails = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(appName)) {
      window.localStorage.removeItem(key);
    }
  });
};
//Role specific get-set Methods
export const localStorageGet = (key, path) => {
  const appName = process.env.REACT_APP_NAME;
  let value = null;
  if (path) {
    const data = JSON.parse(window.localStorage.getItem(appName + "." + key)) || null;
    value = get(data, path);
  } else {
    value = window.localStorage.getItem(appName + "." + key) || null;
  }
  return value;
};
export const localStorageSet = (key, data, path) => {
  const appName = process.env.REACT_APP_NAME;
  const storedData = window.localStorage.getItem(appName + "." + key);

  if (path) {
    set(storedData, path, data);
    window.localStorage.setItem(appName + "." + key, storedData);
    window.localStorage.setItem( key, storedData);
  } else {
    window.localStorage.setItem(appName + "." + key, data);
    window.localStorage.setItem(key, data);
  }
};
//Remove Item
export const lSRemoveItem = (key) => {
  const appName = process.env.REACT_APP_NAME;
  window.localStorage.removeItem(appName + "." + key);
};

export const lSRemoveItemlocal = (key) => {
  window.localStorage.removeItem(key);
};


// get tenantId for Employee/Citizen
export const getTenantIdCommon = () => {
  return process.env.REACT_APP_NAME === "Citizen"?JSON.parse(getUserInfo()).permanentCity:getTenantId();
}