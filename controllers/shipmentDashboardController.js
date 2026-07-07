const Shipment = require("../models/Shipment");
const ShipmentAlert = require("../models/ShipmentAlert");

exports.getDashboard=async(req,res)=>{
    try{
    
    const totalShipments=await Shipment.countDocuments();
    
    const inTransit=await Shipment.countDocuments({
    status:"In Transit"
    });
    
    const delivered=await Shipment.countDocuments({
    status:"Delivered"
    });
    
    const delayed=await Shipment.countDocuments({
    status:"Delayed"
    });
    
    const exception=await Shipment.countDocuments({
    status:"Exception"
    });
    
    const shipmentValue=await Shipment.aggregate([
    {
    $group:{
    _id:null,
    total:{
    $sum:"$cargo.value"
    }
    }
    }
    ]);
    
    res.json({
    status:1,
    data:{
    totalShipments,
    inTransit,
    delivered,
    delayed,
    exception,
    shipmentValue:shipmentValue[0]?.total||0
    }
    });
    
    }catch(error){
    
    res.status(500).json({
    status:0,
    message:error.message
    });
    
    }
    };

    exports.getShipments=async(req,res)=>{
        try{
        
        const shipments=await Shipment.find()
        .populate("cargo.hsCode","hsCode productName")
        .sort({
        shipmentDate:-1
        });
        
        res.json({
        status:1,
        data:shipments
        });
        
        }catch(error){
        
        res.status(500).json({
        status:0,
        message:error.message
        });
        
        }
        };

        exports.getShipmentTracker=async(req,res)=>{
            try{
            
            const shipment=await Shipment.findById(req.params.id)
            .populate("cargo.hsCode","hsCode productName");
            
            res.json({
            status:1,
            data:shipment
            });
            
            }catch(error){
            
            res.status(500).json({
            status:0,
            message:error.message
            });
            
            }
            };

            exports.getShipmentStatusOverview=async(req,res)=>{
                try{
                
                const overview=await Shipment.aggregate([
                {
                $group:{
                _id:"$status",
                count:{
                $sum:1
                }
                }
                }
                ]);
                
                res.json({
                status:1,
                data:overview
                });
                
                }catch(error){
                
                res.status(500).json({
                status:0,
                message:error.message
                });
                
                }
                };

                exports.getShipmentsByMode=async(req,res)=>{
                    try{
                    
                    const modes=await Shipment.aggregate([
                    {
                    $group:{
                    _id:"$route.mode",
                    count:{
                    $sum:1
                    },
                    value:{
                    $sum:"$cargo.value"
                    }
                    }
                    },
                    {
                    $sort:{
                    count:-1
                    }
                    }
                    ]);
                    
                    res.json({
                    status:1,
                    data:modes
                    });
                    
                    }catch(error){
                    
                    res.status(500).json({
                    status:0,
                    message:error.message
                    });
                    
                    }
                    };

                    exports.getTopOriginCountries=async(req,res)=>{
                        try{
                        
                        const countries=await Shipment.aggregate([
                        {
                        $group:{
                        _id:"$route.origin",
                        shipments:{
                        $sum:1
                        },
                        tradeValue:{
                        $sum:"$cargo.value"
                        }
                        }
                        },
                        {
                        $sort:{
                        shipments:-1
                        }
                        },
                        {
                        $limit:10
                        }
                        ]);
                        
                        res.json({
                        status:1,
                        data:countries
                        });
                        
                        }catch(error){
                        
                        res.status(500).json({
                        status:0,
                        message:error.message
                        });
                        
                        }
                        };

                        exports.getRecentAlerts=async(req,res)=>{
                            try{
                            
                            const alerts=await ShipmentAlert.find()
                            .populate("shipment","sbNumber status")
                            .sort({
                            createdAt:-1
                            })
                            .limit(10);
                            
                            res.json({
                            status:1,
                            data:alerts
                            });
                            
                            }catch(error){
                            
                            res.status(500).json({
                            status:0,
                            message:error.message
                            });
                            
                            }
                            };

                            exports.getTopDestinationCountries=async(req,res)=>{
                                try{
                                
                                const countries=await Shipment.aggregate([
                                {
                                $group:{
                                _id:"$route.destination",
                                shipments:{
                                $sum:1
                                },
                                tradeValue:{
                                $sum:"$cargo.value"
                                }
                                }
                                },
                                {
                                $sort:{
                                shipments:-1
                                }
                                },
                                {
                                $limit:10
                                }
                                ]);
                                
                                res.json({
                                status:1,
                                data:countries
                                });
                                
                                }catch(error){
                                
                                res.status(500).json({
                                status:0,
                                message:error.message
                                });
                                
                                }
                                };

                                exports.getFilterOptions=async(req,res)=>{
                                    try{
                                    
                                    const status=await Shipment.distinct("status");
                                    
                                    const modes=await Shipment.distinct("route.mode");
                                    
                                    const origins=await Shipment.distinct("route.origin");
                                    
                                    const destinations=await Shipment.distinct("route.destination");
                                    
                                    const hsCodes=await Shipment.distinct("cargo.productName");
                                    
                                    res.json({
                                    status:1,
                                    data:{
                                    status,
                                    modes,
                                    origins,
                                    destinations,
                                    hsCodes
                                    }
                                    });
                                    
                                    }catch(error){
                                    
                                    res.status(500).json({
                                    status:0,
                                    message:error.message
                                    });
                                    
                                    }
                                    };