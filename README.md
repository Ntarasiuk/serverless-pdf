# Lambda HTML to PDF + AWS S3 upload using Zeit Now
### I've looked far and wide for a simple solution to create a pdf and upload it, and haven't found anything off the shelf.
This uses Puppeteer-core in the background and is based off the lovely Now [Puppeteer-Screenshot](https://github.com/zeit/now-examples/tree/master/puppeteer-screenshot) example.

It's as simple as sending
```javascript
{
    "html": "<p>hello universe!</p>"
}
```
and the result will be the link to the upload
```javascript
{
    "url": "https://s3.us-west-2.amazonaws.com/pdf-bucket/pdfs/hello.pdf"
}
```
Fill in the env attribute on `now.json`
```javascript
// these are fake creds
        "env": {
            "ACCESS_ID": "XXXXXXXXJIURZLPS7B2M",
            "ACCESS_SECRET": "XXXXXMdUfFrkCO2GIoMkFXXXX1Jv+ZapFDeYIZhN",
            "REGION": "us-west-2",
            "BUCKET": "pdf-bucket"
        }
```

I've known about [Now](https://zeit.co/now), but until recently, I haven't used it. I tried multiple times to directly use AWS Lambda with Node or Python solutions but ultimately found them cumbersome --

* Pupeeteer
* WeasyPrint (looks pretty, but hard to impliment)
* wkhtmltopdf (had lots of trouble testing it)
* ReportLab (Uses another language)

`Now` is a really nice and easy way to get any sort of function or website up on Lambda super fast. You can test the code with
```javascript
now dev
```
(although in this case, pupeteer-core doesn't work on Windows)

## Steps to use:
if you don't have Now installed, you can install with
```javascript
npm install -g now
```

Then run
```javascript
now
```
You should get an alias url back with your endpoint.
To download, try a post request to your newly created endpoint + `/download` and get a PDF in return.


`https://serverless-pdf.yourname.now.sh/download`
with optional params:

    ?name=hello&type=A4

The `type` options are:

* `Letter`: 8.5in x 11in
* `Legal`: 8.5in x 14in
* `Tabloid`: 11in x 17in
* `Ledger`: 17in x 11in
* `A0`: 33.1in x 46.8in
* `A1`: 23.4in x 33.1in
* `A2`: 16.5in x 23.4in
* `A3`: 11.7in x 16.5in
* `A4`: 8.27in x 11.7in
* `A5`: 5.83in x 8.27in
* `A6`: 4.13in x 5.83in

for all the PDF options check out the [Puppeteer Docs](https://pptr.dev/#?product=Puppeteer&version=v1.17.0&show=api-pagepdfoptions)


To upload to AWS S3, try a post request to your newly created endpoint + `/upload`
provided you have the environment variables in place, you'll recieve a url in the response
```javascript
{ url: "https://s3.us-west-2.amazonaws.com/pdf-bucket/pdfs/hello.pdf" }
```

Try it out! have fun!