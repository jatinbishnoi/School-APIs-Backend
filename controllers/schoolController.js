const db = require('../db');

exports.addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  db.query(
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
    [name, address, latitude, longitude],
    (err) => {
      if (err) return res.status(500).json({ message: "DB Error" });
      res.status(201).json({ message: "School added" });
    }
  );
};

exports.listSchools = (req, res) => {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: "Coordinates required" });
  }

  db.query("SELECT * FROM schools", (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const toRad = (val) => (val * Math.PI) / 180;
    const calcDist = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const sorted = results.map((school) => ({
      ...school,
      distance: calcDist(userLat, userLon, school.latitude, school.longitude)
    })).sort((a, b) => a.distance - b.distance);

    res.json(sorted);
  });
};
