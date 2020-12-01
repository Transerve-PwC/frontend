

import React, { Component } from 'react'
import SuccessMessage from "../../modules/SuccessMessage";
import Label from "egov-ui-kit/utils/translationNode";


export default class index extends Component {
	render() {
		return (
			<div>
	 <Label label={"BK_MYBK_PCC_APPLICATION_REQUEST"} />
      <Label label={"BK_MYBK_PCC_APPLICATION_REQUEST"} />
      <Label label={"BK_CS_COMMON_SEND_MESSAGE"} />
      <Label label={"BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE"} />
			 <div className="success-message-main-screen resolve-success">
        <SuccessMessage
        headermessage="BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER"
           successmessage="BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE"
           secondaryLabel="BK_CS_COMMON_SEND_MESSAGE"
           containerStyle={{ display: "inline-block" }}
           icon={<Icon action="navigation" name="check" />}
           backgroundColor={"#22b25f"}
           applicationNumber={createWaterTankerApplicationData&&createWaterTankerApplicationData.data?createWaterTankerApplicationData.data.bkApplicationNumber:''}
         />
</div>



			</div>
		)
	}
}
