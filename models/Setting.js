const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },

    // General
    language:{
        type:String,
        default:"English"
    },

    timezone:{
        type:String,
        default:"Asia/Kolkata"
    },

    currency:{
        type:String,
        default:"INR"
    },

    theme:{
        type:String,
        enum:["Light","Dark","System"],
        default:"Light"
    },

    dashboardLayout:{
        type:String,
        default:"Default"
    },

    units:{
        type:String,
        default:"Metric"
    },

    // System
    defaultCountry:String,

    defaultPage:{
        type:String,
        default:"Dashboard"
    },

    itemsPerPage:{
        type:Number,
        default:25
    },

    // Notifications
    emailNotification:{
        type:Boolean,
        default:true
    },

    pushNotification:{
        type:Boolean,
        default:true
    },

    smsNotification:{
        type:Boolean,
        default:false
    },

    // Security
    twoFactorAuth:{
        type:Boolean,
        default:false
    },

    sessionTimeout:{
        type:Number,
        default:30
    },

    apiKey:String

},{
    timestamps:true
});

module.exports=mongoose.model("Setting",settingSchema);