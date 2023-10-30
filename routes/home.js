const { v4: uuidv4 } = require('uuid');
const { addReceiptValidation } = require('../validation/receipt.validation');

module.exports = function (router) {

    var pointsRoute = router.route('/:id/points');
    var receiptRoute = router.route('/process');
    // store id and points mapping
    const database = new Map();

    pointsRoute.get(function(req, res){
        try{
            if(database.has(req.params.id)){
                res.status(200).json({ points: database.get(req.params.id) });
            }else{
                res.status(400).json({ message: "ID not present." });
            }
            return;
        }catch(error){
            console.log(error);
            res.status(400).json({ message: "Unable to process. Try again later." });
            return;
        }
    });

    receiptRoute.post(addReceiptValidation, function (req, res) {
        try{
            let points = getPoints(req.body);
            const id = uuidv4();
            database.set(id, points);
            res.json({ id: id });
        }catch(error){
            console.log(error);
            res.status(400).json({ message: "Unable to process the receipt. Please check the input." });
            return false;
        }
    });

    function getPoints(body){
        let points = 0;
        // One point for every alphanumeric character in the retailer name.
        const alphanumericRegex = /[A-Za-z0-9]/g;
        points += body.retailer.match(alphanumericRegex).length;
        let total = parseFloat(body.total);
        // 50 points if the total is a round dollar amount with no cents.
        if(total.toFixed(2) % 1.00 == 0){
            points += 50;
        }
        // 25 points if the total is a multiple of 0.25.
        if(total.toFixed(2) % 0.25 == 0){
            points += 25;
        }
        // 5 points for every two items on the receipt.
        points += Math.floor(body.items.length / 2) * 5;
        // If the trimmed length of the item description is a multiple of 3, multiply the price by
        //  0.2 and round up to the nearest integer. The result is the number of points earned.
        for(let i=0;i<body.items.length;i++){
            if(body.items[i].shortDescription.trim().length % 3 == 0){
                let price = parseFloat(body.items[i].price);
                points += Math.ceil(price * 0.2);
            }
        }
        // 6 points if the day in the purchase date is odd.
        let date = new Date(body.purchaseDate);
        console.log(date.getDate());
        if(date.getDate() % 2 == 1){
            points += 6;
        }
        // 10 points if the time of purchase is after 2:00pm and before 4:00pm.
        if(body.purchaseTime >= "14:00" && body.purchaseTime <= "16:00"){
            points += 10;
        }
        return points;
    }
    

    return router;
}
