const Setting = require("../models/Setting");
const User = require("../models/user");
const Activity = require("../models/Activity");

exports.getSettings = async (req, res) => {
    try {
  
      const settings = await Setting.findOne({
        userId: req.user._id
      });
  
      res.json({
        status: 1,
        data: settings
      });
  
    } catch (error) {
  
      res.status(500).json({
        status: 0,
        message: error.message
      });
  
    }
  };

  exports.updateGeneral = async (req, res) => {
    try {
  
      const settings = await Setting.findOneAndUpdate(
  
        {
          userId: req.user._id
        },
  
        {
          language: req.body.language,
          timezone: req.body.timezone,
          currency: req.body.currency,
          theme: req.body.theme,
          dashboardLayout: req.body.dashboardLayout,
          units: req.body.units
        },
  
        {
          new: true,
          upsert: true
        }
  
      );
  
      res.json({
        status: 1,
        message: "General settings updated",
        data: settings
      });
  
    } catch (error) {
  
      res.status(500).json({
        status: 0,
        message: error.message
      });
  
    }
  };

  exports.updatePreferences = async (req, res) => {
    try {
  
      const settings = await Setting.findOneAndUpdate(
  
        {
          userId: req.user._id
        },
  
        {
          defaultCountry: req.body.defaultCountry,
          defaultPage: req.body.defaultPage,
          itemsPerPage: req.body.itemsPerPage
        },
  
        {
          new: true
        }
  
      );
  
      res.json({
        status: 1,
        data: settings
      });
  
    } catch (error) {
  
      res.status(500).json({
        status: 0,
        message: error.message
      });
  
    }
  };

  exports.updateNotifications = async (req, res) => {
    try {
  
      const settings = await Setting.findOneAndUpdate(
  
        {
          userId: req.user._id
        },
  
        {
          emailNotification: req.body.emailNotification,
          pushNotification: req.body.pushNotification,
          smsNotification: req.body.smsNotification
        },
  
        {
          new: true
        }
  
      );
  
      res.json({
        status: 1,
        data: settings
      });
  
    } catch (error) {
  
      res.status(500).json({
        status: 0,
        message: error.message
      });
  
    }
  };

  exports.updateSecurity = async (req, res) => {
    try {
  
      const settings = await Setting.findOneAndUpdate(
  
        {
          userId: req.user._id
        },
  
        {
          twoFactorAuth: req.body.twoFactorAuth,
          sessionTimeout: req.body.sessionTimeout
        },
  
        {
          new: true
        }
  
      );
  
      res.json({
        status: 1,
        data: settings
      });
  
    } catch (error) {
  
      res.status(500).json({
        status: 0,
        message: error.message
      });
  
    }
  };

  exports.updateBilling = async (req, res) => {
    try {
  
      const settings = await Setting.findOneAndUpdate(
  
        {
          userId: req.user._id
        },
  
        {
          billingEmail: req.body.billingEmail,
          gstNumber: req.body.gstNumber,
          companyName: req.body.companyName
        },
  
        {
          new: true
        }
  
      );
  
      res.json({
        status:1,
        message:"Billing updated successfully",
        data:settings
      });
  
    } catch (error) {
  
      res.status(500).json({
        status:0,
        message:error.message
      });
  
    }
  };

  exports.updateTheme = async(req,res)=>{

    try{
    
    const settings=await Setting.findOneAndUpdate(
    
    {
    userId:req.user._id
    },
    
    {
    theme:req.body.theme
    },
    
    {
    new:true
    }
    
    );
    
    res.json({
    
    status:1,
    
    message:"Theme updated successfully",
    
    data:settings
    
    });
    
    }catch(error){
    
    res.status(500).json({
    
    status:0,
    
    message:error.message
    
    });
    
    }
    
    };

    const bcrypt=require("bcryptjs");

exports.changePassword=async(req,res)=>{

try{

const{

oldPassword,

newPassword

}=req.body;

const user=await User.findById(req.user._id);

const match=await bcrypt.compare(

oldPassword,

user.password

);

if(!match){

return res.status(400).json({

status:0,

message:"Old password is incorrect"

});

}

const hash=await bcrypt.hash(newPassword,10);

user.password=hash;

await user.save();

res.json({

status:1,

message:"Password changed successfully"

});

}catch(error){

res.status(500).json({

status:0,

message:error.message

});

}

};

exports.getActivity=async(req,res)=>{

    try{
    
    const activity=await Activity.find({
    
    userId:req.user._id
    
    })
    
    .sort({
    
    createdAt:-1
    
    })
    
    .limit(10);
    
    res.json({
    
    status:1,
    
    data:activity
    
    });
    
    }catch(error){
    
    res.status(500).json({
    
    status:0,
    
    message:error.message
    
    });
    
    }
    
    };

    exports.getAccountSummary=async(req,res)=>{

        try{
        
        const user=await User.findById(req.user._id)
        
        .select(
        
        "name email role createdAt lastLogin"
        
        );
        
        const settings=await Setting.findOne({
        
        userId:req.user._id
        
        });
        
        res.json({
        
        status:1,
        
        data:{
        
        user,
        
        theme:settings?.theme,
        
        language:settings?.language,
        
        currency:settings?.currency,
        
        timezone:settings?.timezone
        
        }
        
        });
        
        }catch(error){
        
        res.status(500).json({
        
        status:0,
        
        message:error.message
        
        });
        
        }
        
        };

        