require("dotenv").config();

const app = require("./app");

const port = process.env.PORT || 5002;

const listener = app.listen(port, () => {
  console.log(`Flier server running on port ${port}`);
});

module.exports = {
  close: () => listener.close(),
};