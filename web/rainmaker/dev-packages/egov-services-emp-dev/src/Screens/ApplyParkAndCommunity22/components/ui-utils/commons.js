prepareDocumentsUploadData = (state,type, dispatchMethod) => {
    let documents = "";

    if (type == "apply_pcc") {
        console.log("documentState--",state),
        console.log("type--",type)
        console.log("forGet--",documents = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.PCC_Document",
            []
        ))
        documents = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.PCC_Document",
            []
        );
        // setState({ documents: state })
    }

    documents = documents.filter((item) => {
        return item.active;
    });
    let documentsContract = [];
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

    dispatchMethod(prepareFinalObject("documentsContract", documentsContract));
};

