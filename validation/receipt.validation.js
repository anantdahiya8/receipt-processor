const joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

const item = joi.object({
    shortDescription: joi.string().trim().pattern(new RegExp("^[\\w\\s\\-]+$")).required(),
    price: joi.string().trim().pattern(new RegExp("^\\d+\\.\\d{2}$")).required()
}).required()

const receiptSchema = joi.object({
    retailer: joi.string().trim().required(),
    purchaseDate: joi.date().format("YYYY-MM-DD").required(),
    purchaseTime: joi.string().pattern(new RegExp("^([01][0-9]|2[0-3]):([0-5][0-9])$")).required(),
    items: joi.array().items(item),
    total: joi.string().trim().pattern(new RegExp("^\\d+\\.\\d{2}$")).required()
});

function validateTotal(body, res){
    try{
        const total = parseFloat(body.total);
        let sum = 0;
        for(let i=0;i<body.items.length;i++){
            sum += parseFloat(body.items[i].price);
        }
        if(sum.toFixed(2) != total.toFixed(2)){
            res.status(400).json({ message: "Please check the total amount." });
            return false;
        }
    }catch(error){
        console.log(error);
        res.status(400).json({ message: "Unable to process the receipt. Please check the input." });
        return false;
    }
    return true;
}

module.exports = {
    addReceiptValidation: async (req, res, next) => {
        const value = await receiptSchema.validate(req.body);
        if(value.error){
            res.status(400).json({
                message: value.error.details[0].message
            });
            return;
        }
        if(!validateTotal(req.body, res)){
            return;
        }
        next();
    }
};