const { City } = require("country-state-city");

exports.searchCity = (req, res) =>
{
  const q = req.query.q?.toLowerCase() || "";

  const cities = City.getAllCities()
    .filter(c => c.name.toLowerCase().startsWith(q))
    .slice(0, 20); // limit results

  res.json(cities);
};
