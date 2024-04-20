const express = require("express");
const { Invoice, InvoiceItem, InvoiceBillSundry } = require('./models');
const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express(); 
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/invoice", invoiceRoutes); 

app.listen(PORT, () => {
    console.log("Server started on port", PORT);
});
