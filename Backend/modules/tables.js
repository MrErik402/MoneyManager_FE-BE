const express = require("express");
const router = express.Router();
const {query} = require("../utils/database");
const logger = require("../utils/logger")

// Select ALL RECORD FROM TABLE
router.get("/:table", (req, res) => {
  const table = req.params.table;
  query(`SELECT * FROM ${table}`, [], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    logger.verbose(`[GET /${table}] -> ${results.length} rekord küldve válaszként`)
    res.status(200).send(results);
  }, req);
});

//SELECT ONE RECORD BY ID FROM TALBE
router.get("/:table/:id", (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  query(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    logger.verbose(`[GET /${table}] -> ${results.length} rekord küldve válaszként`)
    res.status(200).send(results);
  }, req); 
});


//POST ONE RECORD TO TABLE
router.post("/:table", (req, res) => {
  const table = req.params.table;
  const data = req.body;
  query(`INSERT INTO ${table} SET ?`, [data], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    logger.verbose(`[POST /${table}] -> ${results.length} rekord küldve válaszként`)
    res.status(201).send(results);
  }, req);
});

//PATCH ONE RECORD BY ID FROM TABLE
router.patch("/:table/:id", (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const data = req.body;
  query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    logger.verbose(`[PATCH /${table}] -> ${results.length} rekord küldve válaszként`)
    res.status(200).send(results);
  }, req);
});


//DELETE ONE RECORD BY ID FROM TALBE
router.delete("/:table/:id", (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  query(`DELETE FROM ${table} WHERE id = ?`, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    logger.verbose(`[GET /${table}] -> ${results.length} rekord küldve válaszként`)
    res.status(200).send(results);
  }, req);
});


module.exports = router;

/*
http://localhost:3000/user
*/