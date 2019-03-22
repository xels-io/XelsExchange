var connection = require('../config/config');
const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports.login = function(req,res){
  // let query = 'SELECT * FROM userauth WHERE email = ?' + [req.body.email];
  // console.log(query);
    connection.query('SELECT * FROM userauth WHERE email = ?',[req.body.email], (err,rows) => {
      if(err)
      {
        res.json({
          status:false,
          message:'There are some error with query'
          })
      }
      else
      {
        if(rows.length >0) {
          bcrypt.compare(req.body.password, rows[0].password, (err,match ) => {
            if(match) {
                // passwords match
                res.json({
                  status:true,
                  message:'successfully authenticated'
              })
            } else {
                // passwords do not match
                res.json({
                  status:false,
                  message:"Password does not match"
                 });
               // callback('Invalid password match', null);
            }
          });
        }
        else{
          res.json({
              status:false,
              message:"Email does not exist"
          });
        }

      }
    });

};



