var connection  = require('../lib/db');

exports.userlogin = function(req, res, next) {
     res.render('userlogin.ejs');
  };

exports.userpage=function(req,res){
        var name=req.body.name;
        var password=req.body.password;

        if (name && password) {
		connection.query('SELECT * FROM userlog WHERE name = ? AND password = ?', [name, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.name = name;
				res.redirect('/info/userbooks');
			} else {
				res.send('Incorrect Username and/or Password!');
			}
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
};

exports.userbook_list=  function(req, res, next) {

       connection.query('SELECT * FROM books ORDER BY id desc',function(err,rows)     {

              if(err){
               req.flash('error', err);
               res.render('userebooklist.ejs',{page_title:"Ebook List",data:''});
              }else{

                  res.render('userebooklist.ejs',{page_title:"Ebook List",data:rows});
              }

               });

};
