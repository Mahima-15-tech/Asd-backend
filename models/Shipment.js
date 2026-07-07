  const mongoose = require("mongoose");

  const shipmentSchema = new mongoose.Schema({

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  
    sbNumber: {
      type: String,
      unique: true
    },
  
    exporter: {
      companyName: String,
      iecNumber: String,
      contactPerson: String,
      mobile: String
    },
  
    importer: {
      companyName: String,
      iecNumber: String,
      contactPerson: String,
      mobile: String
  },

  supplier: {
    companyName: String,
    country: String
},


buyer:{

  buyerId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Buyer"
  },

  companyName:String,

  country:String

},

    cargo: {
      productName: String,
      hsCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HSCode"
      },
      weight: Number,
      quantity: Number,
      value: Number
    },
    route: {

      origin:String,
  
      destination:String,
  
      portOfLoading:String,
  
      portOfDischarge:String,
  
      carrier:String,
  
      mode:{
          type:String,
          enum:["Air","Sea","Road"]
      }
  
  },
  leadTime:{
    type:Number,
    default:0
},

shipmentDate:{
  type:Date,
  default:Date.now
},


  
    etd: Date,
    eta: Date,
  
    status: {
      type: String,
      enum: ["Pending", "In Transit", "Delayed", "Delivered"],
      default: "Pending"
    },
  
    docsPending: {
      type: Boolean,
      default: true
    },
  
    amount: Number,
    vendor: String,
    estimatedCost: {
      type: Number,
      default: 0
    },
    
    paidAmount: {
      type: Number,
      default: 0
    },
    
    balanceAmount: {
      type: Number,
      default: 0
    },
    
    paymentStatus: {
      type: String,
      enum: ["Pending","Partial","Paid"],
      default: "Pending"
    },
    
    supplier:{

      supplierId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Supplier"
      },
  
      companyName:String,
  
      country:String
  
  },
  notes:{
    type:String,
    default:""
    },

    additionalInformation:{

      packagingType:String,
      
      packages:Number,
      
      marksNumbers:String,
      
      dangerousGoods:{
      type:Boolean,
      default:false
      },
      
      specialHandling:{
      type:Boolean,
      default:false
      },
      
      temperatureControl:{
      type:Boolean,
      default:false
      }
      
      },

      
  

    awbNumber: String,
    
    incoterm: String,
    
    totalVolume: Number,
    
    transitTime: String,
    
    lastUpdated: Date,
  
  }, { timestamps: true });

  module.exports = mongoose.model("Shipment", shipmentSchema);