const express = require('express');
const router = express.Router();

router.get("/", (request, response) => {
    response.send("Hello World desde la ruta")
})

router.get("/about", (request, response) => {
    response.send("desde el about")
})

module.exports = router; 