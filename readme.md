# _{Website_Scraper_Faculty_Guide}_

#### _{Goal of the project is to scrape the Brandeis Faculty Guide for data that will be used in our Ex Libris Espoloro Implementation }, {2/28/2020}_

#### By _**{Chris Underwood, Library Applicaiton Developer, Brandeis University}**_

## Description

_{The application goes to each page in a queue that is provided, scrapes the sections defined in the body of a callback function and prints the XML in the saved.xml file. There is cleanup done on most sections to remove/modify the 5 reserved XML symbols (&, <,>, ', "). Title of selected sections are also removed. XML definition and root element are provided automatically.  }_

## Setup/Installation Requirements
* Make sure you have Node.js installed globally
* Clone or fork the files to a location of your choice
* Go to the folder/location of the download or where you have moved the files
* Run npm i
* Make sure saved.xml is empty
* In index.js go to c.queue and put in the sites that you want to scape
* In index.js in the else of the callback function customize what part of the webpages you want to
* On the command line run node index.js
* Go to saved.xml to see your scraping results.


## Known Bugs

_{
  The code is not designed to break out multiple items in the same section. The pages we are scraping does not have tags around each item so they just come across as a plain text string. We would need to extract HTML and this would require a significant rewrite and it is questionable.
 }_

## Support and contact details

_{
  npm crawler documentation: https://www.npmjs.com/package/crawler,
  libsys-group at brandeis dot edu
}_

## Technologies Used

_{Crawler (via NPM), cheerio, Node.js, vanilla JavaScript, XML, and Regular Expressions }_

### License

*{MIT License

Copyright (c) [2020] [Brandeis University Library]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.}*

Copyright (c) 2020 **_{Chris Underwood, Library Applicaiton Developer, Brandeis University}_**
