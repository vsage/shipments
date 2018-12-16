const { convertToEuros, getDealAmountInEuros, getTalentsRevenue } = require('./helpers')
const dealsList = require('./example_deals.json')

/**
 * You can play here with the functions from helpers:
 * 
 * convertToEuros: takes an amount a currency and a date and returns a promise
 * that resolves in the amount converted
 * 
 * getDealAmountInEuros: takes a deal (in dealsList) and returns a promise that
 * resolves in the deal amount in euro
 * 
 * getTalentsRevenue: takes a Date and a dateType (week, month year) and returns a
 * promise that resolves in the sum of amounts for every deal in this time range.
 * Doesn't work because we need a better subscription plan for fixer.io API
 * The other alternative that is way worse is to make multiple API calls to the 
 * historical endPoint to get the multiple historical rates and when we have all
 * the answers we can map the Deals to find the total amount.
 */

var examples = [
    { amt: 3, curr: 'USD', date: new Date()},
    { deal: dealsList[2] }
]

convertToEuros(examples[0].amt, examples[0].curr, examples[0].date).then((data) => {
    console.log("Converted "+ examples[0].amt + " " + examples[0].curr + " to Euros on the " + examples[0].date + ": ")
    console.log(data)
})

getDealAmountInEuros(examples[1].deal).then((data) => {
    console.log("Got the amount in Euros for the deal " + examples[1].deal.id + ": ")
    console.log(data);
}, (err) => {
  console.log(err)
})

// getTalentsRevenue(new Date(), 'year')