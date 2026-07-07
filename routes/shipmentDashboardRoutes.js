const express=require("express");
const router=express.Router();

const{

getDashboard,
getShipments,
getShipmentTracker,
getShipmentStatusOverview,
getShipmentsByMode,
getTopOriginCountries,
getRecentAlerts,
getTopDestinationCountries,
getFilterOptions

}=require("../controllers/shipmentDashboardController");

router.get("/dashboard",getDashboard);

router.get("/shipments",getShipments);

router.get("/tracker/:id",getShipmentTracker);

router.get("/status-overview",getShipmentStatusOverview);

router.get("/shipment-modes",getShipmentsByMode);

router.get("/origin-countries",getTopOriginCountries);

router.get("/recent-alerts",getRecentAlerts);

router.get("/destination-countries",getTopDestinationCountries);

router.get("/filters",getFilterOptions);

module.exports=router;