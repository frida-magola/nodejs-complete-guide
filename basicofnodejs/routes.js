const fs = require('fs');

const requestHandler = (req,res) => {
    const url = req.url;
    const method = req.method;
    
    if (url === '/') {
        res.write('<html>');
        res.write('<header><title>send message</title></header>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">send</button></form></body>')
        res.write('</html>');
        return res.end();  
    }
    
    if (url === '/message' && method === 'POST') {
        
        //create an event
        const body = [];
        
        req.on('data', (chunck) => {
            console.log(chunck);
            body.push(chunck);
        })
        
        return req.on('end', () => {
            const bodyParser = Buffer.concat(body).toString();
            // console.log(bodyParser);
            const message = bodyParser.split('=')[1];
            // fs.writeFileSync('message.txt',message);
            // res.statusCode = 302;
            // res.setHeader('Location', '/');
            // return res.end();
            
            //another for creating file with writeFile()
            fs.writeFile('message.txt',message, err => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            })
        })
    
    }
    
    res.setHeader('Content-Type','text/html');
    res.write('<html>');
    res.write('<header><title>nodejs N-1</title></header>');
    res.write('<body><h1>Hello from Nodejs</h1></body>')
    res.write('</html>');
    res.end(); 
}

//1rst method for exporting file
// module.exports = requestHandler;

//second method multiple functions
module.exports = {
    handler: requestHandler,
    someText: "Hello from nodejs developer"
}

//third method multiple functions
// module.exports.handler = requestHandler;
// module.exports.someText = "Hello from Nyira web developer";

// fourth
// exports.handler = requestHandler;
// exports.someText = "Hello from Nyira web developer";

