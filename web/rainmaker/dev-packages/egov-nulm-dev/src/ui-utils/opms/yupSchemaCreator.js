import * as yup from "yup";

export function createYupSchema(schema, config) {
    //alert(JSON.stringify(config))
    const { id, validationType, validations = [], mandatory } = config;
    if (!yup[validationType]) {
        return schema;
    }
    let validator = yup[validationType]();
    validations.forEach(validation => {
        const { params, type } = validation;
        if (!validator[type]) {
            return;
        }
        console.log(type, params);
        validator = validator[type](...params);
    });
    schema[id] = validator;
    return schema;
}
