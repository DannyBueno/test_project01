const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8'); 

// stores all the objects for each laptop 
const laptopData = JSON.parse(json);
 
//create server
const server = http.createServer((req, res) => {
   //read path name  & id from url
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;
    
    //checking the page to route user
    //Product verview
    if (pathName === '/products' || pathName === '/') {
        //header on the browser
         res.writeHead(200, { 'Content-type': 'text/html'}); 
         // Read tamplate-overview data
         fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => { 
            let overviewOutput = data; 

             // Read card-tempalte data
             fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => { 

                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}',cardsOutput);
                res.end(overviewOutput);
             });    
         });    

       
    } 
        // Laptop detail
    else if (pathName === '/laptop' && id < laptopData.length)  {  
        res.writeHead(200, { 'Content-type': 'text/html'}); 

        // reads the file data and replaces string values 
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => { 
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
       }); 
    }

      //Images route
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        // test if img path contains jpg, jpeg, png, gif
        // if it contains the img read and send back as response
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg'}); 
            res.end(data); 
         
        });

      }

    //  URL not found 404 error
    else {
        res.writeHead(404, { 'Content-type': 'text/html'}); 
        res.end('URL was not found on the server!');
    }

});

// Server listens for request 
server.listen(1337, '127.0.0.1', () => {
    console.log('Listen for request now');
}); 

//Replaces html code from template file
function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output; 
};