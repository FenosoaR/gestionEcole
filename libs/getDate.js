function getDate(date){
    let mois = date.getMonth() + 1
    let annee = date.getFullYear()
    let jours = date.getDate()

    return `${jours}-${mois}-${annee}`

}
module.exports = {getDate}