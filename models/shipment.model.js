const db = require('../db')

/**
 * @returns {Promise} - list of all shipments without considering company (not used)
 */
module.exports.getAll = () => {
    return db.query('SELECT * FROM shipments')
}

/**
 * @param {string} companyId - MANDATORY - id of the company from which we want shipments
 * @param {string} sortBy - OPTIONAL - column we want to sort on
 * @param {string} direction - OPTIONAL - direction of the sorting ('ASC' by default)
 * @param {string} filterTransportationMode  - OPTIONAL - the transportation mode we want to filter on
 * @param {number} offset - OPTIONAL - pagination (starts at 1)
 * @param {number} limit - OPTIONAL - custom limit of results (by default 4)
 * @returns {Promise} - query to the db with the right params
 */
module.exports.getOneDetailed = (
    companyId,
    sortBy,
    direction,
    filterTransportationMode,
    offset,
    limit
    ) => {

    // Base query for list of shipments for one specific company
    let query = `SELECT name, shipment_id as id, international_departure_date, international_transportation_mode, json_agg((SELECT x FROM (SELECT sku, id, description, quantity, active_shipment_count) AS x)) AS products FROM
        (SELECT name, shipments.id as shipment_id, international_departure_date, international_transportation_mode, sku, description, products.id, sum(quantity) as quantity, sum(s2.active_count) as active_shipment_count FROM shipments
        JOIN shipment_products ON shipments.id = shipment_products.shipment_id
        JOIN products ON shipment_products.product_id = products.id
        JOIN (SELECT p.id, count(s) as active_count FROM products p
            JOIN shipment_products sp ON sp.product_id = p.id 
            JOIN shipments s ON sp.shipment_id = s.id
            WHERE s.company_id = $1
            GROUP BY p.id) s2 ON s2.id = products.id
        WHERE shipments.company_id = $1
        GROUP BY name, shipments.id, international_departure_date, international_transportation_mode, sku, description, products.id) s1`

    // Base groupBy end of query
    const groupBy = ' GROUP BY name, shipment_id, international_departure_date, international_transportation_mode'

    // Adds or not the transportationMode filter
    if (filterTransportationMode) {
        query += " WHERE international_transportation_mode = '"+ filterTransportationMode +"'"
    }

    // Adds the GROUP BY statement
    query += groupBy

    // Adds or not the ORDER BY statement
    if (sortBy) {
        query += ' ORDER BY ' + sortBy + ' ' + (direction ? direction : 'ASC')
    } else {
        query += ' ORDER BY id ASC'
    }

    let customLimit = limit ? limit : 4
    // Adds the LIMIT statement
    query += ' LIMIT ' + customLimit

    // Adds or not a custom offset to the query
    if (offset) {
        query += ' OFFSET ' + (offset - 1)*customLimit
    }

    // Inputs the values to the query (companyId)
    const values = [companyId]

    return db.query(query, values)
}