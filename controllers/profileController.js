const User = require("../models/user");
const UserPreference = require("../models/UserPreference");
const LoginSession = require("../models/LoginSession");
const AccountActivity = require("../models/AccountActivity");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
    try {
  
      const user = await User.findById(req.user.id).select("-password");
  
      const preference = await UserPreference.findOne({
        userId: req.user.id
      });
  
      const sessions = await LoginSession.countDocuments({
        userId: req.user.id,
        isActive: true
      });
  
      res.json({
        status: 1,
        data: {
          user,
          preference,
          activeSessions: sessions
        }
      });
  
    } catch (err) {
  
      res.status(500).json({
        status:0,
        message:err.message
      });
  
    }
  };


  exports.updateProfile = async (req,res)=>{

    try{
    
    const user=await User.findByIdAndUpdate(
    
    req.user.id,
    
    {
    
    name:req.body.name,
    
    phone:req.body.phone,
    
    designation:req.body.designation,
    
    companyName:req.body.companyName,
    
    gstin:req.body.gstin,
    
    country:req.body.country,
    
    city:req.body.city,
    
    address:req.body.address
    
    },
    
    {new:true}
    
    ).select("-password");
    
    await AccountActivity.create({
    
    userId:req.user.id,
    
    title:"Profile Updated",
    
    description:"User updated profile information",
    
    icon:"profile"
    
    });
    
    res.json({
    
    status:1,
    
    message:"Profile updated successfully",
    
    data:user
    
    });
    
    }catch(err){
    
    res.status(500).json({
    
    status:0,
    
    message:err.message
    
    });
    
    }
    
    };


    exports.uploadProfileImage = async(req,res)=>{

        try{
        
        const user=await User.findByIdAndUpdate(
        
        req.user.id,
        
        {
        
        profileImage:req.body.profileImage
        
        },
        
        {new:true}
        
        );
        
        await AccountActivity.create({
        
        userId:req.user.id,
        
        title:"Profile Image Updated",
        
        description:"User changed profile image",
        
        icon:"image"
        
        });
        
        res.json({
        
        status:1,
        
        data:user
        
        });
        
        }catch(err){
        
        res.status(500).json({
        
        status:0,
        
        message:err.message
        
        });
        
        }
        
        };


        exports.changePassword = async(req,res)=>{

            try{
            
            const user=await User.findById(req.user.id);
            
            const match=await bcrypt.compare(
            
            req.body.oldPassword,
            
            user.password
            
            );
            
            if(!match){
            
            return res.status(400).json({
            
            status:0,
            
            message:"Old password incorrect"
            
            });
            
            }
            
            const salt=await bcrypt.genSalt(10);
            
            user.password=await bcrypt.hash(
            
            req.body.newPassword,
            
            salt
            
            );
            
            await user.save();
            
            await AccountActivity.create({
            
            userId:req.user.id,
            
            title:"Password Changed",
            
            description:"Password updated successfully",
            
            icon:"lock"
            
            });
            
            res.json({
            
            status:1,
            
            message:"Password updated"
            
            });
            
            }catch(err){
            
            res.status(500).json({
            
            status:0,
            
            message:err.message
            
            });
            
            }
            
            };


            exports.getPreferences = async (req, res) => {
                try {
              
                  let preference = await UserPreference.findOne({
                    userId: req.user.id
                  });
              
                  // First time login
                  if (!preference) {
                    preference = await UserPreference.create({
                      userId: req.user.id
                    });
                  }
              
                  res.json({
                    status: 1,
                    data: preference
                  });
              
                } catch (err) {
              
                  res.status(500).json({
                    status: 0,
                    message: err.message
                  });
              
                }
              };




              exports.updatePreferences = async (req, res) => {

                try {
              
                  const preference = await UserPreference.findOneAndUpdate(
              
                    {
                      userId: req.user.id
                    },
              
                    req.body,
              
                    {
                      new: true,
                      upsert: true
                    }
              
                  );
              
                  await AccountActivity.create({
              
                    userId: req.user.id,
              
                    title: "Preferences Updated",
              
                    description: "Notification preferences updated",
              
                    icon: "settings"
              
                  });
              
                  res.json({
              
                    status: 1,
              
                    message: "Preferences updated",
              
                    data: preference
              
                  });
              
                } catch (err) {
              
                  res.status(500).json({
              
                    status: 0,
              
                    message: err.message
              
                  });
              
                }
              
              };


              exports.getLoginSessions = async (req, res) => {

                try {
              
                  const sessions = await LoginSession.find({
              
                    userId: req.user.id
              
                  }).sort({
              
                    lastLogin: -1
              
                  });
              
                  res.json({
              
                    status: 1,
              
                    data: sessions
              
                  });
              
                } catch (err) {
              
                  res.status(500).json({
              
                    status: 0,
              
                    message: err.message
              
                  });
              
                }
              
              };


              exports.getAccountActivities = async (req, res) => {

                try {
              
                  const activity = await AccountActivity.find({
              
                    userId: req.user.id
              
                  })
              
                    .sort({
              
                      createdAt: -1
              
                    })
              
                    .limit(20);
              
                  res.json({
              
                    status: 1,
              
                    data: activity
              
                  });
              
                } catch (err) {
              
                  res.status(500).json({
              
                    status: 0,
              
                    message: err.message
              
                  });
              
                }
              
              };


              exports.getProfileCompletion = async (req, res) => {

                try {
              
                  const user = await User.findById(req.user.id);
              
                  let total = 6;
                  let completed = 0;
              
                  if (user.name) completed++;
                  if (user.phone) completed++;
                  if (user.companyName) completed++;
                  if (user.gstin) completed++;
                  if (user.address) completed++;
                  if (user.profileImage) completed++;
              
                  const percentage = Math.round((completed / total) * 100);
              
                  const checklist = {
              
                    personalInformation: !!user.name,
              
                    companyInformation: !!user.companyName,
              
                    gstVerified: user.gstVerified,
              
                    contactVerified: user.phoneVerified,
              
                    businessAddress: !!user.address,
              
                    profileImage: !!user.profileImage
              
                  };
              
                  res.json({
              
                    status: 1,
              
                    data: {
              
                      percentage,
              
                      checklist
              
                    }
              
                  });
              
                } catch (err) {
              
                  res.status(500).json({
              
                    status: 0,
              
                    message: err.message
              
                  });
              
                }
              
              };


              