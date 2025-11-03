const express = require("express");
const router = express.Router();
const { query } = require("../utils/database");
const logger = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");

router.post("/process-recurring", async (req, res) => {
  const now = new Date();

  query(
    `SELECT * FROM transactions WHERE isRecurring = 1 AND nextRecurrenceDate <= ?`,
    [now],
    async (err, transactions) => {
      if (err) {
        logger.error(
          `[RECURRING] Hiba az ismétlődő tranzakciók lekérdezésekor: ${err.message}`
        );
        return res.status(500).json({ error: err.message });
      }

      if (transactions.length === 0) {
        return res
          .status(200)
          .json({
            message: "Nincs feldolgozandó ismétlődő tranzakció",
            processed: 0,
          });
      }

      let processed = 0;
      let errors = 0;

      for (const transaction of transactions) {
        try {
          const newTransaction = {
            id: uuidv4(),
            walletID: transaction.walletID,
            amount: transaction.amount,
            categoryID: transaction.categoryID,
            type: transaction.type,
            isRecurring: 1,
            recurrenceFrequency: transaction.recurrenceFrequency,
            originalTransactionID:
              transaction.originalTransactionID || transaction.id,
          };

          let nextDate = new Date(now);
          if (transaction.recurrenceFrequency === "daily") {
            nextDate.setDate(nextDate.getDate() + 1);
          } else if (transaction.recurrenceFrequency === "weekly") {
            nextDate.setDate(nextDate.getDate() + 7);
          } else if (transaction.recurrenceFrequency === "monthly") {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }
          newTransaction.nextRecurrenceDate = nextDate;

          query(
            `INSERT INTO transactions SET ?`,
            [newTransaction],
            (err2, results2) => {
              if (err2) {
                logger.error(
                  `[RECURRING] Hiba az ismétlődő tranzakció létrehozásakor: ${err2.message}`
                );
                errors++;
                return;
              }

              query(
                `UPDATE transactions SET nextRecurrenceDate = ? WHERE id = ?`,
                [nextDate, transaction.id],
                (err3) => {
                  if (err3) {
                    logger.error(
                      `[RECURRING] Hiba a következő ismétlődés dátumának frissítésekor: ${err3.message}`
                    );
                  } else {
                    processed++;

                    query(
                      `SELECT balance FROM wallets WHERE id = ?`,
                      [transaction.walletID],
                      (err4, walletResults) => {
                        if (!err4 && walletResults.length > 0) {
                          let newBalance = walletResults[0].balance;
                          if (transaction.type === "bevétel") {
                            newBalance += transaction.amount;
                          } else {
                            newBalance -= transaction.amount;
                          }

                          query(
                            `UPDATE wallets SET balance = ? WHERE id = ?`,
                            [newBalance, transaction.walletID],
                            (err5) => {
                              if (err5) {
                                logger.error(
                                  `[RECURRING] Hiba a pénztárca egyenlegének frissítésekor: ${err5.message}`
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          );
        } catch (error) {
          logger.error(
            `[RECURRING] Hiba a ${transaction.id} tranzakció feldolgozásakor: ${error.message}`
          );
          errors++;
        }
      }

      setTimeout(() => {
        res.status(200).json({
          message: "Ismétlődő tranzakciók feldolgozva",
          processed: processed,
          errors: errors,
          total: transactions.length,
        });
      }, 1000);
    }
  );
});

module.exports = router;
