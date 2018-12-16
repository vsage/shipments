const request = require('request')
const moment = require('moment')
const dealsList = require('./example_deals.json')
const _ = require('lodash')
const config = require('../config')

/**
 * 
 * @param {Number} amount 
 * @param {String} currency 
 * @param {Date} date 
 * @returns {Promise}
 */
function convertToEuros(amount, currency, date) {
    var promise = new Promise(function(resolve, reject) {
        request(getHistoricalUrl(date), { json: true }, (err, res, body) => {
            if (err) { reject(err); }
            if (!body.rates[currency]) {reject('NO CURRENCY FOUND')}
            resolve(amount/body.rates[currency])
        });
    });
    return promise
}

/**
 * 
 * @param {Date} date - Should be the beginning of the desired dateType
 * @param {String} dateType - Can be week, month, year
 * @returns {Promise}
 */
function getTalentsRevenue(date, dateType) {
    var timeRange = []
    timeRange[0] = moment(date).year(2017).valueOf()
    timeRange[1] = moment(date).year(2017).endOf(dateType).valueOf()
    let validDeals = _.filter(dealsList, (d) => d.created_at>=timeRange[0] && d.created_at<=timeRange[1])
    let symbolsRequired = _.map(validDeals, 'currency')
    let url = narrowUrlToSymbols(getTimeSeriesUrl(timeRange[0], timeRange[1]), symbolsRequired)
    var promise = new Promise(function(resolve, reject) {
        request(url, { json: true }, (err, res, body) => {
            if (err) { reject(err); }
            if (!body.rates) {reject('NO RATES FOUND')}
            // Here we map the validDeals amounts for each day to the historical exchange rate for its specific currency
            resolve("If we have access to this endPoint this is where we get the final value")
        });    
    })
    return promise
}

/**
 * 
 * @param {Deal} deal 
 * @returns {Promise}
 */
function getDealAmountInEuros(deal) {
    var date = moment(date)
    return convertToEuros(deal.amount, deal.currency, deal.created_at)
}

function getHistoricalUrl(date) {
    var dateStr = moment(date).format('YYYY-MM-DD');       
    return 'http://data.fixer.io/api/'+ dateStr +'?access_key=' + config.fixer.access_key
}

function getTimeSeriesUrl(dateFrom, dateTo) {
    var dateFromStr = moment(dateFrom).format('YYYY-MM-DD');
    var dateToStr = moment(dateTo).format('YYYY-MM-DD');
    return 'http://data.fixer.io/api/timeseries?access_key='+ config.fixer.access_key +'&start_date='+ dateFromStr +'&end_date='+ dateToStr
}

function narrowUrlToSymbols(url, symbols) {
    var symbolsStr = symbols.join(',')
    return url + '&symbols=' + symbolsStr
}

module.exports = {
    convertToEuros,
    getDealAmountInEuros,
    getTalentsRevenue
}