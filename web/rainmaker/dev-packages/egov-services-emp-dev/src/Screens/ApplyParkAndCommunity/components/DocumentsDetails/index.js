import React, { Component } from "react";
import { Tabs, Card, TextField, Icon, Button } from "components";
import { withStyles } from "@material-ui/core/styles";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Grid from "@material-ui/core/Grid";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Footer from "../../../../modules/footer";
import get from "lodash/get";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import DocumentList from "../DocumentList";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px"
  },
  input: {
    display: "none"
  }
});

class ApplicatInfo extends Component {
  /// constructor(props) {
  //	super(props);
  state = {
    documentsContract: [],
    UploadType:[],
    documentOne: "",
    name: "Vandana",
  };
  //	};

  prepareDocumentsUploadData = (documentData, type, documentCode) => {
    this.setState(
      {
        name: "changeName",
      },
      () => {
        console.log("Praveen ------> : ", this.state);
      }
    );
    console.log("this.state.name1==>>", this.state.name);
    let documents = "";
    if (type == "apply_pcc") {
      documents = documentData;
    }

    documents = documents.filter((item) => {
      return item.active;
    });
    let documentsContract = [];
    let name2 = "vidhushi";
    let tempDoc = {};
    documents.forEach((doc) => {
      let card = {};
      card["code"] = doc.documentType;
      card["title"] = doc.documentType;
      card["cards"] = [];
      tempDoc[doc.documentType] = card;
    });

    documents.forEach((doc) => {
      // Handle the case for multiple
      if (
        doc.code === "BK_DOC_DOC_PICTURE" &&
        doc.hasMultipleRows &&
        doc.options
      ) {
        let buildingsData = get(
          state,
          "screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.Documents",
          []
        );

        buildingsData.forEach((building) => {
          let card = {};
          card["name"] = building.name;
          card["code"] = doc.code;
          card["hasSubCards"] = true;
          card["subCards"] = [];
          doc.options.forEach((subDoc) => {
            let subCard = {};
            subCard["name"] = subDoc.code;
            subCard["required"] = subDoc.required ? true : false;
            card.subCards.push(subCard);
          });
          tempDoc[doc.documentType].cards.push(card);
        });
      } else {
        let card = {};
        card["name"] = `BK_${doc.code}`;
        card["code"] = `BK_${doc.code}`;
        card["required"] = doc.required ? true : false;
        if (doc.hasDropdown && doc.dropdownData) {
          let dropdown = {};
          dropdown.label = "BK_SELECT_DOC_DD_LABEL";
          dropdown.required = true;
          dropdown.menu = doc.dropdownData.filter((item) => {
            return item.active;
          });
          dropdown.menu = dropdown.menu.map((item) => {
            return {
              code: item.code,
              label: getTransformedLocale(item.code),
            };
          });
          card["dropdown"] = dropdown;
        }
        tempDoc[doc.documentType].cards.push(card);
      }
    });

    Object.keys(tempDoc).forEach((key) => {
      documentsContract.push(tempDoc[key]);
    });
    console.log("The Value of documentsContract--", documentsContract);
    // this.props.prepareFinalObject("documentsContract", documentsContract);
    console.log("thisState--", this.state);

    this.setState({
      documentsContract: documentsContract,
      UploadType: documentCode
    });

    
    // this.setState({
    //   documentOne: documentsContract
    // })
    // console.log("BeforeUpdateName", this.state.name)
    // this.setState({
    //   name: name2
    // })
    // console.log("AfterUpdateName", this.state.name)
    // console.log("exactdocumentsContract2--", documentsContract)
    // console.log("afterUPDATE2documentsContract--", this.state.documentsContract)
  };

  componentDidMount() {
    console.log("Vandana was here in arrow functioned ");
    let documentData = [
      {
        active: true,
        code: "PCC_DOCUMENT",
        description: "PCC_DOCUMENT_DESCRIPTION",
        documentType: "DOC",
        dropdownData: [],
        hasDropdown: false,
        required: true,
      },
    ];


let documentCode = [
  {
  documentCode: "BK_DOC.DOC_PICTURE",
  documentType: "DOC",
  isDocumentRequired: false,
  isDocumentTypeRequired: false
  }
]

    let type = "apply_pcc";
    this.prepareDocumentsUploadData(documentData, type, documentCode);
  }

  // preparemyObj = ()=>{

  //   console.log('Vandana 2 was here');
  //   let documentData=[
  //     {
  //         active: true,
  //         code: "PCC_DOCUMENT",
  //         description: "PCC_DOCUMENT_DESCRIPTION",
  //         documentType: "DOC",
  //         dropdownData: [],
  //         hasDropdown: false,
  //         required: true,
  //     },
  //   ]

  //   let type = "apply_pcc"
  // //this.propsprepareDocumentsUploadData(documentData,dispatch,"apply_pcc", this.props.mydispatch );
  // this.prepareDocumentsUploadData(documentData,type);

  //   this.prepareDocumentsUploadData(documentData,type);
  // }

  continue = (e) => {

    
    let re = /\S+@\S+\.\S+/;
    let mb = /^\d{10}$/;
    e.preventDefault();
    if ( this.props.documentMap === "Document Not Found")
     {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Please upload mandatory documents!",
          labelKey: `Please upload mandatory documents!`,
        },
        "warning"
      );
    }  
    else {
      this.props.nextStep();
    }
  };
  onCitizenNameChange = (e) => {};
  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };
  handleFileChange(e) {
    console.log("Vandana 3 was here");

    e.preventDefault();
    var files;
    if (e.dataTransfer) {
      console.log("e.data", e.dataTransfer);
      files = e.dataTransfer.files;
    } else if (e.target) {
      console.log("e.target", e.target.files);
      files = e.target.files;
    }
  }
  render() {
    console.log("TheNameStateInRender--", this.state.name);
    console.log("mainstateOfComponent--", this.state.documentsContract);
    console.log("documentsUploadReduxFirstOne--", this.state.UploadType);
    const { firstName, email, mobileNo, lastName, handleChange, classes } = this.props;
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden",
    };

    // let buttonLabel = {
    //   labelName: "UPLOAD FILE",
    //   labelKey: "BK_OSB_DOCUMENT_UPLOAD_BUTTON",
    // };


    let buttonLabel = {    
      label:"BK_UPLOAD_FILE"
    };
  
    let description =
      "Only .jpg, .jpeg, .png and .pdf files. 1MB max file size.";
   
   
    let inputProps = {
      accept: ".pdf,.png,.jpg,.jpeg",
    };

    let maxFileSize = 1025;

    let documentDatatwo = [
      {
        active: true,
        code: "PCC_DOCUMENT",
        description: "PCC_DOCUMENT_DESCRIPTION",
        documentType: "DOC",
        dropdownData: [],
        hasDropdown: false,
        required: true,
      },
    ];

    console.log("documentDatatwo--", documentDatatwo);

    return (
      <div>
        
        <div>
        <div classsName="container">
         <div className="col-xs-12">
        {this.state.documentsContract.length > 0 && (
          <DocumentList
            documentsList={this.state.documentsContract}
            documentsUploadRedux ={this.state.UploadType}
            // buttonLabel="UPLOAD FILE"  //{<Label buttonLabel={true} label="BK_CORE_COMMON_GOBACK" />}
            buttonLabel={buttonLabel}
            description={description}
            inputProps={inputProps}
            maxFileSize={maxFileSize}
            handleChange={handleChange}
          />
        )}
 
</div>
<div>
</div>
</div>
<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={
      <div className="col-sm-12 col-xs-12" style={{textAlign: 'right'}}>
      <Button
              className="responsive-action-button"
              primary={true}
              label={<Label buttonLabel={true} label="BK_CORE_COMMON_GOBACK" />}
              fullWidth={true}
              onClick={this.back}
              style={{ marginRight: 18 }}
              startIcon={<ArrowBackIosIcon />}
            />
          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_COMMON_GONEXT" />}
            fullWidth={true}
            onClick={this.continue}
            startIcon={<ArrowForwardIosIcon />}
          />
        
        </div> 
        }></Footer>
       </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { complaints, common, auth, form } = state;
  let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject:"";
  let documentMAP2 = documentMap ? documentMap.documentMap:" "
  return {
    documentMap,
    documentMAP2,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),

    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ApplicatInfo)
);
