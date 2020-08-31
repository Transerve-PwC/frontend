import * as Yup from 'yup';
import { resource } from './resource'
const NumberRegx = /^[0-9]+\d*$/;
const StringRegx = /^[a-zA-Z ]{1,250}$/;
const mobRegx = /^([0-9]{10})$/;
const alphanum = /^[a-zA-Z0-9]+$/;
const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let arr = []
arr = resource

let language = localStorage.getItem("locale")


export const Validation_NOCTPET =
    Yup.object().shape({
        color: Yup.string()
            .required('This field is required'),
        applicantName: Yup.string()
            .matches(StringRegx, { message: "Applicant Name Should be Text", excludeEmptyString: true })

            .required('This field is required'),

        sex: Yup.string()
            .required('This field is required'),
        veterinaryCouncilRegistrationNo: Yup.string()
            .matches(NumberRegx, { message: "Veterinary Council Registration No should be  digit", excludeEmptyString: true })

            .required('This field is required'),
        immunizationContactDetail: Yup.string()
            .matches(mobRegx, { message: "Contact Details should be 10 digit", excludeEmptyString: true })

            .required('This field is required'),

        immunizationNameVeterinaryDoctor: Yup.string()
            .matches(StringRegx, { message: "Name Veterinary Doctor Should be String", excludeEmptyString: true })

            .required('This field is required'),
        breed: Yup.string()
            .required('This field is required'),
        // uploadVaccinationCertificate: Yup.string()
        //     .required('This field is required'),
        // uploadPetPicture: Yup.string()
        //     .required('This field is required'),
        // immunizationSector: Yup.string()
        //     .required(arr[language]['immunizationsector'] + ' ' + arr[language]['This field is required']),
        houseNo: Yup.string()
            .matches(NumberRegx, { message: "House No. should be  digit", excludeEmptyString: true })

            .required('This field is required'),
        immunizationClinicNo: Yup.string()
            .matches(NumberRegx, { message: "Clinic No. should be  digit", excludeEmptyString: true })

            .required('This field is required'),
        sector: Yup.string()
            .required('This field is required'), nameOfPetDog: Yup.string()
                .matches(StringRegx, { message: "Name Of Pet Dog Should be String", excludeEmptyString: true })

                .required('This field is required'),
        age: Yup.string()
            .required('This field is required'),

    })



export const Validation_NOCSELLMEAT =
    Yup.object().shape({
        applicantName: Yup.string().matches(StringRegx, { message: "Applicant Name Should be Text", excludeEmptyString: true }).required('Required Field'),
        fatherHusbandName: Yup.string().matches(StringRegx, { message: "Father/Husband Name Should be Text", excludeEmptyString: true }).required('Required Field'),
        houseNo: Yup.string().matches(alphanum, { message: "House No should be number", excludeEmptyString: true }).required('Required Field'),
        division: Yup.string().matches(StringRegx, { message: "Division Name Should be Text", excludeEmptyString: true }).required('Required Field'),
        nocSought: Yup.string().matches(StringRegx, { message: "NOC Sought Should be Text", excludeEmptyString: true }).required('Required Field'),
        //uploadDocuments: Yup.string().matches(StringRegx, { message: "Document Name Should be Text", excludeEmptyString: true }).required('Required Field'),
    })



export const Validation_NOCADD =
    Yup.object().shape({
        typeOfApplicant: Yup.string().matches(StringRegx, { message: "Applicant Type Should be Text", excludeEmptyString: true }).required('Required Field'),
        applicantName: Yup.string().matches(StringRegx, { message: "Applicant Name Should be Text", excludeEmptyString: true }).required('Required Field'),
        address: Yup.string().matches(alphanum, { message: "Address Should be Text", excludeEmptyString: true }).required('Required Field'),
        mobileNo: Yup.string().matches(mobRegx, { message: "Mobile No Should be valid", excludeEmptyString: true }).required('Required Field'),
        emailId: Yup.string().matches(email, { message: "Email Id Should be valid", excludeEmptyString: true }).required('Required Field'),
        typeOfAdvertisement: Yup.string().matches(StringRegx, { message: "Advertisement type Should be Text", excludeEmptyString: true }).required('Required Field'),
        subTypeOfAdvertisement: Yup.string().matches(StringRegx, { message: "Advertisement Subtype Should be Text", excludeEmptyString: true }).required('Required Field'),
        duration: Yup.string().matches(StringRegx, { message: "Advertisement type Should be Text", excludeEmptyString: true }).required('Required Field'),
        noOfDayWeekMonthsYears: Yup.string().matches(StringRegx, { message: "Add proper duration", excludeEmptyString: true }),
        space: Yup.string().matches(StringRegx, { message: "Advertisement space Should be Text", excludeEmptyString: true }).required('Required Field'),
        fee: Yup.string().matches(NumberRegx, { message: "Advertisement fee Should be Number", excludeEmptyString: true }).required('Required Field'),
        date: Yup.string().matches(StringRegx, { message: "Advertisement date Should be Text", excludeEmptyString: true }).required('Required Field'),
    })



export const Validation_NOCROADCUT =
    Yup.object().shape({
        typeOfApplicant: Yup.string().matches(StringRegx, { message: "Applicant type Should be Text", excludeEmptyString: true }).required('Required Field'),
        purposeOfRoadCutting: Yup.string().matches(StringRegx, { message: "Purpose Should be Text", excludeEmptyString: true }).required('Required Field'),
        applicantName: Yup.string().matches(StringRegx, { message: "Applicant Name Should be Text", excludeEmptyString: true }).required('Required Field'),
        division: Yup.string().matches(StringRegx, { message: "Division Should be Text", excludeEmptyString: true }).required('Required Field'),
        ward: Yup.string().matches(StringRegx, { message: "Ward Name Should be Text", excludeEmptyString: true }).required('Required Field'),
        sector: Yup.string().matches(StringRegx, { message: "Sector Name Should be Text", excludeEmptyString: true }).required('Required Field'),
        requestedLocation: Yup.string().matches(StringRegx, { message: "Location Name Should be Text", excludeEmptyString: true }),
        landmark: Yup.string().matches(StringRegx, { message: "Landmark Name Should be Text", excludeEmptyString: true }).required('Required Field'),
        length: Yup.string().matches(NumberRegx, { message: "Lemngth Should be Number", excludeEmptyString: true }).required('Required Field'),
        width: Yup.string().matches(NumberRegx, { message: "Width Should be Number", excludeEmptyString: true }).required('Required Field'),
        uploadDocuments: Yup.string().matches(StringRegx, { message: "Document Name Should be Text", excludeEmptyString: true }).required('Required Field'),
    })


