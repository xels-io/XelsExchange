const express = require("express"),
      cors = require("cors"),
      app = express(),
      bodyParser = require("body-parser"),
      bcrypt = require('bcrypt');
      const port = 5000;
      //var db = require('../models');
      var connection = require('./config/config');
const saltRounds = 10;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var idRows ;
const registerController = require('./controllers/register');
const authController = require('./controllers/authenticate');
const cryption = require('./controllers/encryptdecrypt');

function encryptData (pvt)
{
  let m = cryption.encrypt(pvt);
  return m;
}

app.post('/saveTransaction', (req,res) => {
    let encrypt = encryptData(req.body.ethPvt);
    let insertTransaction = "INSERT INTO xelschangedetails(xels_address, eth_address, eth_pvt, xels_amount, eth_amount, status ) values ('" + req.body.xelsAddress +"', '" + req.body.ethAddress +"', '" + JSON.stringify(encrypt) +"','" + req.body.xelsAmount +"','" + req.body.ethAmount +"', 0)";
    connection.query(insertTransaction , (err, rows) => {
      if(err)
      {
        res.json({
          status:false,
          message: err
      });
      }
      else {
        idRows = rows.insertId;
        res.json({
          status:true,
          message: "Transaction Saved",
          data: idRows
      });
      }
    })
});

app.post('/updateTransaction',  (req, res) => {
    let updateTransaction = "UPDATE xelschangedetails set status = 1 WHERE id='"+ idRows +"'" ;
    //console.log(updateTransaction);
     connection.query(updateTransaction , (err, rows) => {
      if(err)
      {
        res.json({
          status:false,
          message: err
      });
      }
      else {
        res.json({
          status:true,
          message: "Transaction Updated"
      });
      }
    })
})
app.get('/', (req,res) => {

});
//register: storing name, email and password and redirecting to login page after signup
app.post('/user/create',  (req, res) => {
  bcrypt.hash(req.body.passwordsignup, saltRounds, function (err,   hash) {
  connection.User.create({
   name: req.body.usernamesignup,
   email: req.body.emailsignup,
   password: hash
   }).then(function(data) {
    if (data) {
    res.redirect('/login');
    }
  });
 });
});



app.post('/register',  registerController.register);
app.post('/login', authController.login );
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {

      return next();
  }
  req['header']['Referrer']=req.url
  console.log( req['header']['Referrer'])
  res.redirect('/login');
}
app.post('/auth', (request, response) => {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

//login page: storing and comparing email and password,and redirecting to home page after login
app.post('/user', function (req, res) {
  db.User.findOne({
       where: {
           email: req.body.email
              }
  }).then(function (user) {
      if (!user) {
         res.redirect('/');
      } else {
bcrypt.compare(req.body.password, user.password, function (err, result) {
     if (result == true) {
         res.redirect('/home');
     } else {
      res.send('Incorrect password');
      res.redirect('/');
     }
   });
  }
});
});

// set the app to listen on the port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

