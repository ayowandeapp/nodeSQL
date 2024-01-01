import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const app = express()
const port = 3000;
app.set('view engine', 'ejs');
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true })
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(__dirname + "/public"));

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'node_sql'
});
  app.get('/', (req, res) => {
    const userQuery = 'SELECT count(*) AS total_users FROM users';
    connection.query(userQuery,
      async function(err, results) {
        console.log(results); // results contains rows returned by server
        const usersCount = results[0].total_users;
        // res.send(`Hello World!  ${usersCount}`)
        res.render('home', {count:usersCount, err:null});
      }
    );
    // connection.end();
  });
app.post('/register', urlencodedParser, (req, res)=>{
  console.log(req.body);
  const email = req.body.email;
  connection.query('INSERT INTO users SET ?', {email:email}, function(err, results){
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.redirect('/?err=EmailAlreadyExists');
      }
    } else {
      if (results.affectedRows > 0) {
        res.redirect('/');
      }
    }
  })

})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})