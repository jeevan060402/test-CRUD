const express = require("express");
const {Invoice, InvoiceItem, InvoiceBillSundry} = require('../models');

const routes = express.Router();

routes.post(
    '/',async (req,res) => {
        try {
            const {date, customerName, billingAddress, ShippingAddress, GSTIN, invoieItems, invoiceBillSundrys} = req.body;
            let totalAmount = 0;
            invoieItems.forEach(item => {
                if(item.quantity  <=0 && item.price <=0 ){
                    throw new Error('Quantity and price should be greater than zero')
                }
                item.amount = item.quantity * item.price;
                totalAmount += parseFloat(item.amount)
            });

            invoiceBillSundrys.forEach(sundry =>{
                totalAmount += parseFloat(sundry.amount)
            });

            const invoice = await Invoice.create({
                date,
                customerName,
                billingAddress,
                ShippingAddress,
                GSTIN,
                totalAmount,
            })

            await Promise.all(invoieItems.map(item => {
                item.invoiceId = invoice.id;
                return InvoiceItem.create(item)
            }))

            await Promise.all(invoiceBillSundrys.map(item =>{
                item.invoiceId = invoice.id;
                return InvoiceBillSundry.create(item);
            }));
            res.status(201).json(invoice)
        }
        catch(error){
            res.status(400).json({error:error.message});
        }
    }
)


routes.get('/:id',async (req,res) => {
    try {
        const {id} = req.params;
        const invoice = await Invoice.findOne({
            where: {id},
            include:{InvoiceItem, InvoiceBillSundry},
        })
        if (!invoice){
            return res.status(404).json({error:'Invoice not found'})
        }
        res.json(invoice)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
})


routes.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {date, customerName, billingAddress, ShippingAddress, GSTIN, invoiceItems, invoiceBillSundrys} = req.body;

        const invoice = await Invoice.findByPk(id);
        if(!invoice) {
            return res.status(404).json({error:"invoice not found"})
        }

        invoice.date = date;
        invoice.customerName = customerName;
        invoice.billingAddress = billingAddress;
        invoice.ShippingAddress = ShippingAddress;
        invoice.GSTIN = GSTIN;

        let totalAmount = 0;
        await Promise.all(InvoiceItem.map(
            async item=>{
                if (item.quantity <=0  && item.price <= 0){
                    throw new Error('------')
                }
                item.amount = item.quantity * item.price

                const existingItem = await InvoiceItem.findOne({Where :{id:item.id}});
                if (existingItem){
                    await existingItem.update(item)
                }
                else{
                    await InvoiceItem.create({...item, invoiceId:id});
                }

                totalAmount += parseFloat(item.amount);
            }
        ));

        await Promise.all(invoiceBillSundrys.map(async sundry=>{
            const existingSundry = await InvoiceBillSundry.findOne({where :{id:sundry.id}})
            if (existingSundry){
                await existingSundry.update(sundry)
            }
            else{
                await InvoiceBillSundry.create({...sundry, invoiceId :id})
            }
            totalAmount += parseFloat(sundry.amount);

        }))
        invoice.totalAmount = totalAmount;
        await invoice.save();
        res.json(invoice)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
})

routes.delete("/:id", async (req, res) =>{
    try{
        const {id} = req.params;
        const invoice = await Invoice.findByPk(id);
        if(!invoice){
            return res.status(404).json({error:"not found"})
        }
        await invoice.destroy();
        res.status(204).send();
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
})


routes.get("/", async(req, res) => {
    try {
        const invoice = await Invoice.findAll({
            include : [InvoiceItem, InvoiceBillSundry]
        })
        res.json(invoice)
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
})

module.exports = routes