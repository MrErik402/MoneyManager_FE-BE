const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { query } = require("../utils/database");
const logger = require("../utils/logger");

// REGISZTRÁCIÓ
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: "Név, email és jelszó kötelező" });
  }

  query("SELECT id FROM users WHERE email = ?", [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length) return res.status(409).json({ message: "Ez az email már regisztrálva van" });

    const id = uuidv4();
    const hashed = await bcrypt.hash(password, 10);
    const role = "user";
    const status = 1;

    query(
      "INSERT INTO users (id, name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, email, hashed, role, status],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        logger.verbose(`[AUTH /register] user létrehozva: ${email}`);
        res.status(201).json({ message: "Sikeres regisztráció" });
      },
      req
    );
  }, req);
});

// BEJELENTKEZÉS
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email és jelszó kötelező" });

  query("SELECT id, name, email, password, role, status FROM users WHERE email = ? LIMIT 1", [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(400).json({ message: "Hibás email vagy jelszó" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Hibás email vagy jelszó" });
    if (user.status !== 1) return res.status(403).json({ message: "A fiók nincs aktiválva" });

    // session
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.role = user.role;
    req.session.name = user.name;

    logger.verbose(`[AUTH /login] bejelentkezve: ${email}`);
    res.json({ message: "Sikeres bejelentkezés", user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }, req);
});

// KIJELENTKEZÉS
router.post("/logout", (req, res) => {
  const email = req.session?.email;
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    if (email) logger.verbose(`[AUTH /logout] kijelentkezve: ${email}`);
    res.json({ message: "Kijelentkezve" });
  });
});

// AKTUÁLIS USER
router.get("/me", (req, res) => {
  if (!req.session.userId) return res.json({ loggedIn: false });
  res.json({
    loggedIn: true,
    user: {
      id: req.session.userId,
      email: req.session.email,
      role: req.session.role,
      name: req.session.name
    }
  });
});

// PROFIL ADATOK MÓDOSÍTÁSA
router.patch("/update-profile", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Nincs bejelentkezve" });
  }

  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Név és email kötelező" });
  }

  // Email validáció
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Érvényes email címet adjon meg" });
  }

  // Ellenőrizzük, hogy az email már létezik-e másik felhasználónál
  query(
    "SELECT id FROM users WHERE email = ? AND id != ?",
    [email, req.session.userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (rows.length > 0) {
        return res.status(409).json({ message: "Ez az email cím már használatban van" });
      }

      // Frissítjük a felhasználó adatait
      query(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, req.session.userId],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          
          // Frissítjük a session adatokat is
          req.session.name = name;
          req.session.email = email;
          
          logger.verbose(`[AUTH /update-profile] profil frissítve: ${req.session.userId}`);
          res.status(200).json({ 
            message: "Profil sikeresen frissítve",
            user: {
              id: req.session.userId,
              name: name,
              email: email,
              role: req.session.role
            }
          });
        },
        req
      );
    },
    req
  );
});

// FIOK TÖRLÉSE
router.delete("/delete-account", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Nincs bejelentkezve" });
  }

  const userId = req.session.userId;
  const userEmail = req.session.email;

  // Töröljük a felhasználót az adatbázisból
  query(
    "DELETE FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Session törlése
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        logger.verbose(`[AUTH /delete-account] fiók törölve: ${userEmail}`);
        res.status(200).json({ message: "Fiók sikeresen törölve" });
      });
    },
    req
  );
});

// JELSZÓ MÓDOSÍTÁS
router.post("/change-password", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Nincs bejelentkezve" });
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Jelenlegi jelszó és új jelszó kötelező" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Az új jelszó legalább 6 karakter hosszú legyen" });
  }

  query(
    "SELECT id, password FROM users WHERE id = ? LIMIT 1",
    [req.session.userId],
    async (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length) return res.status(404).json({ message: "Felhasználó nem található" });

      const user = rows[0];
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Hibás jelenlegi jelszó" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
      query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedNewPassword, req.session.userId],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          logger.verbose(`[AUTH /change-password] jelszó megváltoztatva: ${req.session.email}`);
          res.status(200).json({ message: "Jelszó sikeresen módosítva" });
        },
        req
      );
    },
    req
  );
});

module.exports = router;
