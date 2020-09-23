import * as Yup from 'yup';
import { resource } from './resource'
const NumberRegx = /^[0-9]+\d*$/;
const StringRegx = /^[a-zA-Z ]{1,250}$/;
const mobRegx = /^([0-9]{10})$/;

let arr = []
arr = resource

let language = localStorage.getItem("locale")
// export const Validation = {
//     Validation_NOCTPET
// }








export const Validation_NOCTPET =
    Yup.object().shape({
        color: Yup.string()
            .required('req'),
        applicantName: Yup.string()
            .matches(StringRegx, { message: "Applicant Name Should be Text", excludeEmptyString: true })

            .required('isrequired'),

        sex: Yup.string()
            .required('isrequired'),
        veterinaryCouncilRegistrationNo: Yup.string()
            .matches(NumberRegx, { message: "Veterinary Council Registration No should be  digit", excludeEmptyString: true })

            .required('isrequired'),
        immunizationContactDetail: Yup.string()
            .matches(mobRegx, { message: "Contact Details should be 10 digit", excludeEmptyString: true })

            .required('isrequired'),

        immunizationNameVeterinaryDoctor: Yup.string()
            .matches(StringRegx, { message: "Name Veterinary Doctor Should be String", excludeEmptyString: true })

            .required('isrequired'),
        breed: Yup.string()
            .required('isrequired'),
        // uploadVaccinationCertificate: Yup.string()
        //     .required('isrequired'),
        // uploadPetPicture: Yup.string()
        //     .required('isrequired'),
        // immunizationSector: Yup.string()
        //     .required(arr[language]['immunizationsector'] + ' ' + arr[language]['isrequired']),
        houseNo: Yup.string()
            .matches(NumberRegx, { message: "House No. should be  digit", excludeEmptyString: true })

            .required('isrequired'),
        immunizationClinicNo: Yup.string()
            .matches(NumberRegx, { message: "Clinic No. should be  digit", excludeEmptyString: true })

            .required('isrequired'),
        sector: Yup.string()
            .required('isrequired'), nameOfPetDog: Yup.string()
                .matches(StringRegx, { message: "Name Of Pet Dog Should be String", excludeEmptyString: true })

                .required('isrequired'),
        age: Yup.string()
            .required('isrequired'),

    })



export const Validation_NOCSELLMEAT =
    Yup.object().shape({ applicantName: Yup.string().required('Required Field'), fatherHusbandName: Yup.string().required('Required Field'), houseNo: Yup.string().required('Required Field'), division: Yup.string().required('Required Field'), nocSought: Yup.string().required('Required Field'), uploadDocuments: Yup.string().required('Required Field'), })


export const Validation_NOCADD =
    Yup.object().shape({ applicantName: Yup.string().required('Required Field'), fatherHusbandName: Yup.string().required('Required Field'), houseNo: Yup.string().required('Required Field'), division: Yup.string().required('Required Field'), nocSought: Yup.string().required('Required Field'), uploadDocuments: Yup.string().required('Required Field'), })

export const Validation_NOCROADCUT =
    Yup.object().shape({ applicantName: Yup.string().required('Required Field'), fatherHusbandName: Yup.string().required('Required Field'), houseNo: Yup.string().required('Required Field'), division: Yup.string().required('Required Field'), nocSought: Yup.string().required('Required Field'), uploadDocuments: Yup.string().required('Required Field'), })
