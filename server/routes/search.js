const express = require("express");
const router = express.Router();
const searchCtrl = require("../controllers/search");

// not get because of how I passed data?
router.post("/listings", searchCtrl.getListings);
router.get("/", searchCtrl.getSearches);
router.post("/", searchCtrl.createSearch);
router.put("/update", searchCtrl.updateSearch);
router.delete("/delete", searchCtrl.deleteSearch);

module.exports = router;
