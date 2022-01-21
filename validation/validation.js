module.exports = validation =>{
    const empty =  value =>(typeof value == 'string' && !value.trim())? true:false
    return {empty}
}