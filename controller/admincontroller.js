var connection  = require('../lib/db');



exports.index = function(req, res, next) {
     res.render('index.ejs');
  };

  exports.adminlogin = function(req, res, next) {
       res.render('adminlogin.ejs');
    };

  exports.adminpage=function(req,res){
        var name=req.body.name;
        var password=req.body.password;

        if (name && password) {
		connection.query('SELECT * FROM adminlog WHERE name = ? AND password = ?', [name, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.name = name;
				res.redirect('/info/books');
			} else {
				res.send('Incorrect Username and/or Password!');
			}
			res.end();
		});
	}
};

exports.book_list=  function(req, res, next) {

       connection.query('SELECT * FROM books ORDER BY id desc',function(err,rows)     {

              if(err){
               req.flash('error', err);
               res.render('ebooklist.ejs',{page_title:"Ebook List",data:''});
              }else{

                  res.render('ebooklist.ejs',{page_title:"Ebook List",data:rows});
              }

               });

          };

          exports.book_create_get = function(req, res, next) {
               res.render('bookcreate.ejs');
            };



      // ADD NEW USER POST ACTION
      exports.book_create_post= function(req, res, next){
        req.assert('name', 'Title is required').notEmpty()
        req.assert('author', 'Author is required').notEmpty()
        req.assert('genre', 'Genre is required').notEmpty()
        req.assert('year','Year is required').notEmpty()

          var errors = req.validationErrors()

          if( !errors ) {   //No errors were found.  Passed Validation!


              var user = {
                  name: req.sanitize('name').escape().trim(),
                  author: req.sanitize('author').escape().trim(),
                  genre: req.sanitize('genre').escape().trim(),
                  year: req.sanitize('year').escape().trim()



              }

           connection.query('INSERT INTO books SET ?', user, function(err, result) {
                      //if(err) throw err
                      if (err) {
                          req.flash('error', err)

                          // render to views/user/add.ejs
                          res.render('bookcreate.ejs', {
                            title: 'Add New Book',
                            name: req.body.name,
                            author: req.body.author,
                            genre: req.body.genre,
                            year: req.body.year
                          })
                      } else {
                          req.flash('success', 'Data added successfully!');
                          res.redirect('/info/books');
                      }
                  })
          }
          else {   //Display errors to user
              var error_msg = ''
              errors.forEach(function(error) {
                  error_msg += error.msg + '<br>'
              })
              req.flash('error', error_msg)

              /**
               * Using req.body.name
               * because req.param('name') is deprecated
               */
              res.render('bookcreate.ejs', {
                  title: 'Add New Book',
                  name: req.body.name,
                  author: req.body.author,
                  genre: req.body.genre,
                  year: req.body.year

              })
          }
      }

      // SHOW EDIT USER FORM
      exports.book_edit_get= function(req, res, next){

      connection.query('SELECT * FROM books WHERE id = ' + req.params.id, function(err, rows, fields) {
                  if(err) throw err

                  // if user not found
                  if (rows.length <= 0) {
                      req.flash('error', 'Customers not found with id = ' + req.params.id)
                      res.redirect('/books')
                  }
                  else { // if user found
                      // render to views/user/edit.ejs template file
                      res.render('bookedit.ejs', {
                          title: 'Edit book',
                          //data: rows[0],
                          id: rows[0].id,
                          name: rows[0].name,
                          author: rows[0].author,
                          genre: rows[0].genre,
                          year: rows[0].year

                      })
                  }
              })

      };

      // EDIT USER POST ACTION
      exports.book_edit_post = function(req, res, next) {
        req.assert('name', 'Title is required').notEmpty()
        req.assert('author', 'Author is required').notEmpty()
        req.assert('genre', 'Genre is required').notEmpty()
        req.assert('year','Year is required').notEmpty()
          var errors = req.validationErrors()

          if( !errors ) {

              var user = {
                name: req.sanitize('name').escape().trim(),
                author: req.sanitize('author').escape().trim(),
                genre: req.sanitize('genre').escape().trim(),
                year: req.sanitize('year').escape().trim()
              }

      connection.query('UPDATE books SET ? WHERE id = ' + req.params.id, user, function(err, result) {
                      //if(err) throw err
                      if (err) {
                          req.flash('error', err)

                          // render to views/user/add.ejs
                          res.render('bookedit.ejs', {
                              title: 'Edit Customer',
                              id: req.params.id,
                              name: req.body.name,
                              author: req.body.author,
                              genre: req.body.genre,
                              year: req.body.year
                          })
                      } else {
                          req.flash('success', 'Data updated successfully!');
                          res.redirect('/info/books');
                      }
                  })

          }
          else {   //Display errors to user
              var error_msg = ''
              errors.forEach(function(error) {
                  error_msg += error.msg + '<br>'
              })
              req.flash('error', error_msg)

              /**
               * Using req.body.name
               * because req.param('name') is deprecated
               */
              res.render('bookedit.ejs', {
                  title: 'Edit Book',
                  id: req.params.id,
                  name: req.body.name,
                  author: req.body.author,
                  genre: req.body.genre,
                  year: req.body.year

              })
          }
      };

      // DELETE USER
      exports.book_delete= function(req, res, next) {
          var user = { id: req.params.id }

      connection.query('DELETE FROM books WHERE id = ' + req.params.id, user, function(err, result) {
                  //if(err) throw err
                  if (err) {
                      req.flash('error', err)
                      // redirect to users list page
                      res.redirect('/info/books')
                  } else {
                      req.flash('success', 'Customer deleted successfully! id = ' + req.params.id)
                      // redirect to users list page
                      res.redirect('/info/books')
                  }
              })
         };
