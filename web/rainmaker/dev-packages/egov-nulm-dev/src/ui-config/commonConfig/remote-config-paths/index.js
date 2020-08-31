const remoteConfigPath = (path, screenKey) => {
  let config = {};
  //alert("dev package :"+ path +" : "+ screenKey)
  switch (path) {
    default:
      config = require(`ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
  }
  return config;
};

export default remoteConfigPath;
