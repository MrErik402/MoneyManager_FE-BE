const express = require("express");
const router = express.Router();
const {query} = require("../utils/database");
const logger = require("../utils/logger")
const { v4: uuidv4 } = require("uuid");

function ensureAuthenticated(req, res) {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

// Select ALL RECORD FROM TABLE
router.get("/:table", (req, res) => {
  const table = req.params.table;
  
  if (table === "wallets") {
    if (!ensureAuthenticated(req, res)) return;
    query(`SELECT * FROM ${table} WHERE userID = ?`, [req.session.userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(`[GET /${table}] -> ${results.length} rekord küldve válaszként`)
      res.status(200).send(results);
    }, req);
    return;
  }
  
  if (table === "transactions") {
    if (!ensureAuthenticated(req, res)) return;
    query(`SELECT t.* FROM ${table} t INNER JOIN wallets w ON t.walletID = w.id WHERE w.userID = ?`, [req.session.userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(`[GET /${table}] -> ${results.length} rekord küldve válaszként`)
      res.status(200).send(results);
    }, req);
    return;
  }
  
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
  const createdID = uuidv4();
  data.id = createdID;

  if (table === "wallets") {
    if (!ensureAuthenticated(req, res)) return;
    data.userID = req.session.userId;
    query(`INSERT INTO ${table} SET ?`, [data], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(`[POST /${table}] -> ${results.length} rekord küldve válaszként`)
      res.status(201).send(results);
    }, req);
    return;
  }
  
  if (table === "transactions") {
    if (!ensureAuthenticated(req, res)) return;
    if (!data.walletID) {
      return res.status(400).json({ error: "walletID is required" });
    }
    // Verify wallet belongs to user
    query(`SELECT id FROM wallets WHERE id = ? AND userID = ?`, [data.walletID, req.session.userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(403).json({ error: "Wallet does not belong to user" });
      }
      query(`INSERT INTO ${table} SET ?`, [data], (err2, results2) => {
        if (err2) {
          return res.status(500).json({ error: err2.message });
        }
        logger.verbose(`[POST /${table}] -> ${results2.length} rekord küldve válaszként`)
        res.status(201).send(results2);
      }, req);
    }, req);
    return;
  }

  console.log(data)
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
  
  if (table === "wallets") {
    if (!ensureAuthenticated(req, res)) return;
    query(`SELECT id FROM ${table} WHERE id = ? AND userID = ?`, [id, req.session.userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(403).json({ error: "Wallet does not belong to user" });
      }
      query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id], (err2, results2) => {
        if (err2) {
          return res.status(500).json({ error: err2.message });
        }
        logger.verbose(`[PATCH /${table}] -> ${results2.length} rekord küldve válaszként`)
        res.status(200).send(results2);
      }, req);
    }, req);
    return;
  }
  
  if (table === "transactions") {
    if (!ensureAuthenticated(req, res)) return;
    query(`SELECT t.id FROM ${table} t INNER JOIN wallets w ON t.walletID = w.id WHERE t.id = ? AND w.userID = ?`, [id, req.session.userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(403).json({ error: "Transaction does not belong to user" });
      }
      query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id], (err2, results2) => {
        if (err2) {
          return res.status(500).json({ error: err2.message });
        }
        logger.verbose(`[PATCH /${table}] -> ${results2.length} rekord küldve válaszként`)
        res.status(200).send(results2);
      }, req);
    }, req);
    return;
  }
  
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
  
  if (table === "wallets") {
    if (!ensureAuthenticated(req, res)) return;
    query(`SELECT id FROM ${table} WHERE id = ? AND userID = ?`, [id, req.session.userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(403).json({ error: "Wallet does not belong to user" });
      }
      query(`DELETE FROM ${table} WHERE id = ?`, [id], (err2, results2) => {
        if (err2) {
          return res.status(500).json({ error: err2.message });
        }
        logger.verbose(`[DELETE /${table}] -> törölve`)
        res.status(200).send(results2);
      }, req);
    }, req);
    return;
  }
  
  if (table === "transactions") {
    if (!ensureAuthenticated(req, res)) return;
    query(`SELECT t.id FROM ${table} t INNER JOIN wallets w ON t.walletID = w.id WHERE t.id = ? AND w.userID = ?`, [id, req.session.userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(403).json({ error: "Transaction does not belong to user" });
      }
      query(`DELETE FROM ${table} WHERE id = ?`, [id], (err2, results2) => {
        if (err2) {
          return res.status(500).json({ error: err2.message });
        }
        logger.verbose(`[DELETE /${table}] -> törölve`)
        res.status(200).send(results2);
      }, req);
    }, req);
    return;
  }
  
  query(`DELETE FROM ${table} WHERE id = ?`, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    logger.verbose(`[DELETE /${table}] -> törölve`)
    res.status(200).send(results);
  }, req);
});


module.exports = router;

/*
http://localhost:3000/user
*/