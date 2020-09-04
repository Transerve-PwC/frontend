import React from "react";
import RenderScreen from "egov-ui-framework/ui-molecules/RenderScreen";
import CustomTab from "../../ui-molecules-local/CustomTab";
import { connect } from "react-redux";
import { addComponentJsonpath } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";

class MultiItem extends React.Component {
  state = {
    tabIndex: this.props.activeIndex || 0
  };

  onTabClick = tabIndex => {
    const { state, dispatch } = this.props;
    // this.onTabChange(tabIndex, dispatch, state);
    if(this.state.tabIndex !== tabIndex) {
      this.props.onTabChange(tabIndex, dispatch, state)
      this.setState({ tabIndex });
    }
  };

  render() {
    const {
      uiFramework,
      onFieldChange,
      onComponentClick,
      screenKey,
      componentJsonpath
    } = this.props;

    const { onTabClick } = this;

    const transFormedProps = {
      ...this.props,
      tabs: this.props.tabs.map((tab, key) => {
        return {
          ...tab,
          tabContent: (
            <RenderScreen
              key={key}
              screenKey={screenKey}
              components={cloneDeep(
                addComponentJsonpath(
                  tab.tabContent,
                  `${componentJsonpath}.props.tabs[${key}].tabContent`
                )
              )}
              uiFramework={uiFramework}
              onFieldChange={onFieldChange}
              onComponentClick={onComponentClick}
            />
          )
        };
      })
    };
    return <CustomTab handleClick={onTabClick} {...transFormedProps} />;
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { screenConfig, preparedFinalObject } = screenConfiguration;
  return { screenConfig, preparedFinalObject, state };
};

export default connect(mapStateToProps)(MultiItem);
