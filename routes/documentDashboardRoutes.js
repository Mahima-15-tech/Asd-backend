const express=require("express");
const router=express.Router();

const{

getDashboard,
getDocuments,
getDocumentsByType,
getDocumentStatusOverview,
getDocumentInsights,
getExpiringDocuments,
getRecentUploads,
getFilterOptions

}=require("../controllers/documentDashboardController");

router.get("/dashboard",getDashboard);

router.get("/documents",getDocuments);

router.get("/documents-by-type",getDocumentsByType);

router.get("/status-overview",getDocumentStatusOverview);

router.get("/insights",getDocumentInsights);

router.get("/expiring",getExpiringDocuments);

router.get("/recent-uploads",getRecentUploads);

router.get("/filters",getFilterOptions);

module.exports=router;