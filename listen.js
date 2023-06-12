const app = require("./app.js");

// default to 9090 if port not in environment variable
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}...`));
