

const mysql = require('mysql');
const axios = require('axios');





exports.expenseForm = function(req, res){

    res.render('layout.pug');
    //res.redirect('/list')
}

exports.saveExpense = function(req, res){
    //interact with db and save expense data
    //console.log(req.body.amount, req.body.date, req.body.remark)
    const regex = /eUr$/i
    let query;
    let amount_eur;
    let amount;
    let amount_str =req.body.amount;
    let date  = req.body.date;
    let remark = req.body.remark;
    //console.log(typeof amount)
    //test if the user enter expense in euros, if so, check public API for latest exchange rate
    const connection = mysql.createConnection({
      host     : process.env.DB_HOST,
      user     : process.env.DB_USER,
      password : process.env.DB_PASS,
      port     : process.env.DB_PORT,
      database : process.env.DB_NAME
    });
    connection.connect((err) => {
      if(err){
        console.log('Error connecting to Db');
        return;
      }
      console.log('Connection established');
    });
   
    let amount_match = amount_str.match(regex)// returns an array or null

    if (amount_match !== null){
       // if user enters amount in EUROS, convert it to pounds.
       //hit  1Forge.com public API for forex data
       console.log('inside if, before Number')
       amount_eur = Number.parseFloat(amount_str);
       console.log('inside if after Number')
       //asynchronous network call
       axios.get('https://forex.1forge.com/1.0.3/convert?from=EUR&to=GBP&quantity=1&api_key=sfi5B1lpJcqu2GhTIMM93bs7yxlsTF0Q')
       .then(function (response) {
              console.log(response.data.value);
              amount = amount_eur * (response.data.value);
               query = `INSERT INTO getdev (amount, date, remark) VALUES(${amount}, "${date}", "${remark}")`;
               connection.query(query, function (error, results, fields) {
                if (error) throw error;
                console.log( results.insertId);
                res.redirect('/list')
              });
              connection.end((error)=>{
                if (error) throw error
                console.log("all queued queries successfully execute. database connection closed...")
              });
            })
        .catch(function (error) {
            console.log(error);
      });
    }else{
        amount = Number(amount_str);
        query = `INSERT INTO getdev (amount, date, remark) VALUES(${amount}, "${date}", "${remark}")`;
      
        connection.query(query, function (error, results, fields) {
           if (error) throw error;
           console.log( results.insertId);
           res.redirect('/list')
        });
        connection.end((error)=>{
            if (error) throw error
            console.log("all queued queries successfully executed. server shutting down...")
       });
    }
  
      
  



}


exports.listExpense=function(req, res){

  const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    port     : process.env.DB_PORT,
    database : process.env.DB_NAME
  });
       
      connection.connect((err) => {
          if(err){
            console.log('Error connecting to Db');
            return;
          }
          console.log('Connection established on list');
        });
       
        var query6 = "SELECT amount, ROUND(0.2/1.2*amount, 2) as VAT, date_format(date, '%a %M %e, %Y')as dat, remark from getdev ORDER BY date DESC";
    connection.query(query6, function (error, results, fields) {
        if (error) throw error;
        //console.log( results[1].date, results[1].amount);
        /*
        const date = results[1].date;
        const amount = results[1].amount;
        const remark = results[1].remark;

        const date_obj= new Date(date);
        const dYear = date_obj.getFullYear();
        const dMonth = date_obj.getMonth() + 1;
        const dDay = date_obj.getDate()
        */
       //select amount, 0.2/1.2*amount as VAT, date_format(date, '%a %M %m, %Y')as date, remark from getdev ORDER BY date DESC;
        res.render('list', {results})

      });
      connection.end((error)=>{
        if (error) throw error
        console.log("all queued queries successfully executed. server shutting down...")
  });
         


  console.log('i am after connection.end call')
}