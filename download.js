const { parse } = require("url");
const { getPdf } = require("./chromium");
const AWS = require("aws-sdk");

module.exports = async function(req, res) {
  try {
    const { pathname = "/", query = {} } = parse(req.url, true);
    const { type = "A4", name = "output" } = query;
    if (!req.body || !req.body.html) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/html");
      res.end(
        "<h1>Bad Request</h1><p>you forgot to send the HTML attribute.</p>"
      );
    } else {
      const file = await getPdf(type, name, req);
      if (file) {
        res.setHeader("Content-Type", "application/pdf");
        res.end(file);
      }
    }
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end(
      `<h1>Server Error</h1><p>Sorry, there was a problem: ${e.message}</p>`
    );
    console.error(e.message);
  }
};
