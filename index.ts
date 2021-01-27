// require("dotenv").config();

import server from "./server";

// require("debug")("server");

const port = process.env.PORT || 4000;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log("Server running on port", `${port}`);
});
