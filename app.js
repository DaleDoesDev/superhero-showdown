let express = require('express');
app = express();
app.use(express.static(__dirname + '/public'));

let PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`App running on port: ${PORT}.`)
