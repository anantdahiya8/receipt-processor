var secrets = require('../config/secrets');
const { v4: uuidv4 } = require('uuid');

module.exports = function (router) {

    var homeRoute = router.route('/');

    homeRoute.get(function (req, res) {
        console.log(uuidv4());
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is ' + connectionString });
    });

    return router;
}
