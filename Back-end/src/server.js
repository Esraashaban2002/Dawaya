const app = require("./app");
const http = require("http");
const connection = require("./config/db");

const PORT = process.env.PORT || 3000;

connection();
console.log()
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});