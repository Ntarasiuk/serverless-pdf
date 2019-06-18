const { parse } = require("url");
const { getPdf } = require("./chromium");
const AWS = require("aws-sdk");

module.exports = async function(req, res) {
  try {
    const { BUCKET, REGION, ACCESS_ID, ACCESS_SECRET } = process.env;
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
        if (BUCKET && ACCESS_ID && ACCESS_SECRET) {
          AWS.config.update({
            accessKeyId: ACCESS_ID,
            secretAccessKey: ACCESS_SECRET
          });
          var s3bucket = new AWS.S3({
            params: { Bucket: BUCKET, region: REGION }
          });
          var params = {
            Key: `invoices/${name}.pdf`,
            Body: file,
            ACL: "public-read",
            ContentType: "application/pdf" // required
          };
          await s3bucket.putObject(params, function(err, item) {
            if (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "text/html");
              res.end(
                `<h1>Server Error</h1><p>Error in uploading file on s3 due to : ${err}</p>`
              );
            } else {
              console.log(item);
              res.setHeader("Content-Type", "application/json");
              res.status(200).send({
                url: `https://s3.${REGION}.amazonaws.com/${BUCKET}/invoices/${name}.pdf`
              });
              return item;
            }
          });
        }
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
