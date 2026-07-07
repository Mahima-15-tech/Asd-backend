const TradeInvoice = require("../models/TradeInvoice");

exports.getDashboard = async (req,res)=>{
    try{
    
    const totalInvoices=await TradeInvoice.countDocuments();
    
    const paidInvoices=await TradeInvoice.countDocuments({
    status:"Paid"
    });
    
    const pendingInvoices=await TradeInvoice.countDocuments({
    status:"Pending"
    });
    
    const overdueInvoices=await TradeInvoice.countDocuments({
    status:"Overdue"
    });
    
    const invoiceStats=await TradeInvoice.aggregate([
    {
    $group:{
    _id:null,
    totalValue:{$sum:"$invoiceValue"},
    averageValue:{$avg:"$invoiceValue"}
    }
    }
    ]);
    
    res.json({
    status:1,
    data:{
    totalInvoices,
    paidInvoices,
    pendingInvoices,
    overdueInvoices,
    totalInvoiceValue:invoiceStats[0]?.totalValue||0,
    averageInvoiceValue:invoiceStats[0]?.averageValue||0
    }
    });
    
    }catch(error){
    
    res.status(500).json({
    status:0,
    message:error.message
    });
    
    }
    };

    exports.getInvoices=async(req,res)=>{
        try{
        
        const {search,status,type,country}=req.query;
        
        let filter={};
        
        if(search){
        
        filter.$or=[
        {
        invoiceNumber:{
        $regex:search,
        $options:"i"
        }
        },
        {
        party:{
        $regex:search,
        $options:"i"
        }
        }
        ];
        
        }
        
        if(status) filter.status=status;
        
        if(type) filter.type=type;
        
        if(country) filter.country=country;
        
        const invoices=await TradeInvoice.find(filter)
        .sort({
        createdAt:-1
        });
        
        res.json({
        status:1,
        data:invoices
        });
        
        }catch(error){
        
        res.status(500).json({
        status:0,
        message:error.message
        });
        
        }
        };

        exports.getStatusSummary=async(req,res)=>{
            try{
            
            const data=await TradeInvoice.aggregate([
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
            data
            });
            
            }catch(error){
            
            res.status(500).json({
            status:0,
            message:error.message
            });
            
            }
            };

            exports.getValueTrend=async(req,res)=>{
                try{
                
                const trend=await TradeInvoice.aggregate([
                {
                $group:{
                _id:{
                month:{
                $month:"$invoiceDate"
                }
                },
                value:{
                $sum:"$invoiceValue"
                }
                }
                },
                {
                $sort:{
                "_id.month":1
                }
                }
                ]);
                
                res.json({
                status:1,
                data:trend
                });
                
                }catch(error){
                
                res.status(500).json({
                status:0,
                message:error.message
                });
                
                }
                };

                exports.getRecentInvoices=async(req,res)=>{
                    try{
                    
                    const invoices=await TradeInvoice.find()
                    .sort({
                    invoiceDate:-1
                    })
                    .limit(10);
                    
                    res.json({
                    status:1,
                    data:invoices
                    });
                    
                    }catch(error){
                    
                    res.status(500).json({
                    status:0,
                    message:error.message
                    });
                    
                    }
                    };

                    exports.getTopParties=async(req,res)=>{
                        try{
                        
                        const parties=await TradeInvoice.aggregate([
                        {
                        $group:{
                        _id:"$party",
                        total:{
                        $sum:"$invoiceValue"
                        }
                        }
                        },
                        {
                        $sort:{
                        total:-1
                        }
                        },
                        {
                        $limit:5
                        }
                        ]);
                        
                        res.json({
                        status:1,
                        data:parties
                        });
                        
                        }catch(error){
                        
                        res.status(500).json({
                        status:0,
                        message:error.message
                        });
                        
                        }
                        };

                        exports.getOverdueInvoices=async(req,res)=>{
                            try{
                            
                            const invoices=await TradeInvoice.find({
                            status:"Overdue"
                            })
                            .sort({
                            dueDate:1
                            });
                            
                            res.json({
                            status:1,
                            data:invoices
                            });
                            
                            }catch(error){
                            
                            res.status(500).json({
                            status:0,
                            message:error.message
                            });
                            
                            }
                            };

                            exports.getInsights=async(req,res)=>{
                                try{
                                
                                const paid=await TradeInvoice.countDocuments({
                                status:"Paid"
                                });
                                
                                const overdue=await TradeInvoice.countDocuments({
                                status:"Overdue"
                                });
                                
                                const pendingAmount=await TradeInvoice.aggregate([
                                {
                                $match:{
                                status:"Pending"
                                }
                                },
                                {
                                $group:{
                                _id:null,
                                amount:{
                                $sum:"$invoiceValue"
                                }
                                }
                                }
                                ]);
                                
                                res.json({
                                status:1,
                                data:{
                                paidInvoices:paid,
                                overdueInvoices:overdue,
                                pendingAmount:pendingAmount[0]?.amount||0
                                }
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
                                    
                                    const countries=await TradeInvoice.distinct("country");
                                    
                                    const types=await TradeInvoice.distinct("type");
                                    
                                    const statuses=await TradeInvoice.distinct("status");
                                    
                                    res.json({
                                    status:1,
                                    data:{
                                    countries,
                                    types,
                                    statuses
                                    }
                                    });
                                    
                                    }catch(error){
                                    
                                    res.status(500).json({
                                    status:0,
                                    message:error.message
                                    });
                                    
                                    }
                                    };

                                    