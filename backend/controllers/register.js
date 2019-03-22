var connection = require('../config/config');
const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports.register = function(req,res){
    var today = new Date();
    const users={
        "userName":req.body.username,
        "email":req.body.email,
        "password":req.body.password,
        "created_at":today,
        "updated_at":today
    }
    let checkIfExists = "select * from userauth where email ='" + req.body.email + "'";
    //console.log(checkIfExists);
    connection.query(checkIfExists, (err,rows) => {
        console.log(rows);
        if(rows.length)
        {
            res.json({
              status:false,
              message:'This email already exists'
          })
        }
        else
        {
           let results = registerEntry(req);
           res.json({
            status: true,
            data: results,
            message:'User registered sucessfully'
        })
        }

    });

};
function registerEntry(req)
{
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if(err)
        {
           return err;
        }
        else
        {
            let insertQuery = "INSERT INTO userauth(userName,email,password ) values ('" + req.body.username +"', '" + req.body.email +"', '" + hash +"')";

            connection.query(insertQuery , (err,rows) => {
                    if (rows) {
                        console.log(rows);
                        return rows;
                    }
                    else
                    {
                        console.log(err);
                        return err;
                    }
                  });
        }
    });
}


