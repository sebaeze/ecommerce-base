/*
*  Description of the APIs
*/
module.exports.apiDescription = {
    user:{
        method: 'GET',
        description: 'Retrieve information of current user if logged ',
        parameters: 'id=&id&email=email'
    },
    products:{
        method: 'GET',
        description: 'Retrieve list of products',
        parameters: 'country=cty&id=id&'
    },
    user:{
        method: 'GET',
        description: 'List current user logged',
        parameters: 'N/A'
    }
}