const {Sequelize, DataTypes, Model} = require('sequelize')

const sequelize = new Sequelize('test', 'postgres', '1723119503', {
    host: 'localhost',
    dialect:  'postgres'
  });

const Invoice = sequelize.define('Invoice',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    date:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    invoiceNumber:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        unique: true
    },
    customName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    BillingAddress:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ShippingAddress:{
        type:DataTypes.STRING,
        allowNull:false
    },
    GSTIN:{
        type:DataTypes.STRING,
        allowNull:false
    },
    TotalAmount:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    },
},{
    timestamps:false,
});


const InvoiceItem = sequelize.define('InvoiceItem',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    itemName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Quantity:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false,
        validate:{
            min:0
        }
    },
    Price:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false,
        validate:{
            min:0
        }
    },
    Amount:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false,
        validate:{
            min:0
        }
    },
},
{
    timestamps:false
});

const InvoiceBillSundry = sequelize.define('InvoiceBillSundry',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    billSundryName:{
        type:DataTypes.STRING,
        allowNull:false
    },Amount:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false,
        validate:{
            min:0
        }
    },
},
{
    timestamps:false,
});


Invoice.hasMany(InvoiceItem,{foreignKey:'invoiceId',onDelete:'CASCADE'})

InvoiceItem.belongsTo(Invoice,{foreignKey:'invoiceId'})

Invoice.hasMany(InvoiceBillSundry,{foreignKey:'invoiceId',onDelete:'CASCADE'})

InvoiceItem.belongsTo(Invoice,{foreignKey:'invoiceId'})


module.exports={
    sequelize,
    Invoice,
    InvoiceItem,
    InvoiceBillSundry
};