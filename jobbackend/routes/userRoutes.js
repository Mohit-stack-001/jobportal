const express = require("express");

const router = express.Router();

router.get("/profile", (req, res) => {

  res.json({
    message: "Profile Route Working",
  });

});

module.exports = router;