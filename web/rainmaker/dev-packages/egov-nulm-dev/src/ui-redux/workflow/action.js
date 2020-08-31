
export const viewNocAction = {
    setData,
    setColData,
    setColorData,
    setNewData,
    setBreedData,
    setJSONData,
    setViewata,
    setReviewata,
    setFileData,
    setLandingdata,
    setViewJSONData,
    setViewdata
};
function setData(data) {
    return {
        type: "setdata",
        text: data
    }
}
function setColData(col) {
    return {
        type: "setcoldata",
        text: col
    }
}
function setColorData(color) {
    return {
        type: "setcolordata",
        text: color
    }
}
function setNewData(color) {
    return {
        type: "setcolordata",
        text: color
    }
}
function setBreedData(breed) {
    return {
        type: "setbreeddata",
        text: breed
    }
}
function setJSONData(data) {
    return {
        type: "setjsonata",
        text: data
    }
}
function setViewata(data) {
    return {
        type: "setviewata",
        text: data
    }
}
function setReviewata(data) {
    return {
        type: "setreviewata",
        text: data
    }
}
function setFileData(file) {
    return {
        type: "setfiledata",
        text: file
    }
}

function setLandingdata(data) {
    return {
        type: "setlandingdata",
        text: data
    }
}

function setViewJSONData(data) {
    return {
        type: "setviewJSONData",
        text: data
    }
}

function setViewdata(data) {
    return {
        type: "setviewdata",
        text: data
    }
}
