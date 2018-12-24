const express = require('express')
const router = express.Router()
const shipment = require('../models/shipment.model')

router.get('/', (req, res) => {
    if (req.query.company_id) {
        const companyId = req.query.company_id
        const sortBy = req.query.sort
        const direction = req.query.direction
        const filterTransportationMode = req.query.international_transportation_mode
        const limit = req.query.per
        const offset = req.query.page
        shipment.getOneDetailed(companyId, sortBy, direction, filterTransportationMode, offset, limit).then((data) => {
            res.send({'records': data.rows})
        }, (err) => {
            res.status(422).send({errors: [err]})
        })
    } else {
        res.status(422).send({errors: ['company_id is required']})
    }
  })

  module.exports = router