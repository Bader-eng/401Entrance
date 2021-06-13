
'use strict';

require('dotenv').config();

const express= require('express');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
//const client = new pg.Client( { connectionString: process.env.DATABASE_URL, ssl: process.env.LOCALLY ? false : {rejectUnauthorized: false}} );
//const client = new pg.Client( { connectionString: process.env.DATABASE_URL, ssl: process.env.LOCALLY ? false : {rejectUnauthorized: false}} );
const methodOverride = require('method-override');

const superagent= require ('superagent');

const PORT=process.env.PORT || 3000;

const server = express();
server.use(express.static('./public'));

server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));

//server.set('view engine','ejs');
//server.set('view engine','ejs');
server.set('view engine', 'ejs');

server.get('/',(req,res)=>{
    res.render('HomePage')
})

server.post('/price',serachHandler)
server.get('/all',allproduct)
server.post('/add',addtomycard)
server.get('/MyCard',all)
server.get('/Details/:id',details)
server.put('/update/:id',update)
function serachHandler(req,res){
    let greaterPrice=req.body.priceHigh
    let lessPrice=req.body.priceLow
let url=`http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline&price_greater_than=${greaterPrice}&price_less_than=${lessPrice}`;
superagent.get(url)
.then(val=>{
    console.log(val)
    let data=val.body
    let newdata=data.map((val)=>{
        return new Maybelline(val)
    })
    res.render('myprice',{data:newdata})
})
}
function allproduct(req,res){
    let url = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline`
    superagent.get(url)
.then(val=>{
    console.log(val)
    let data=val.body
    let newdata=data.map((val)=>{
        return new Maybelline(val)
    })
    res.render('Maybelline',{data:newdata})
})
}


function addtomycard(req,res){
    let sql=`INSERT INTO jop (name,price,image_link,description) VALUES ($1,$2,$3,$4) RETURNING *;`
    let safevalue=[req.body.name,req.body.price,req.body.image_link,req.body.description]
    client.query(sql,safevalue)
    .then(val=>{
        res.redirect('/MyCard')
    })
}
function all(req,res){
    let sql =`SELECT * FROM jop`;
    client.query(sql)
    .then(val=>{
        res.render('MyCard',{data:val.rows})
    })
}
function details(req,res){
    let sql=`SELECT * FROM jop WHERE id=$1;`
    let safevalue=[req.params.id]
    client.query(sql,safevalue)
    .then(val=>{
        res.render('Details',{data:val.rows[0]})
    })
}

function update(req,res){
let sql=`UPDATE jop SET name=$1,price=$2,image_link=$3,description=$4 WHERE id =$5;`
let safevalue=[req.body.name,req.body.price,req.body.image_link,req.body.description,req.params.id]
client.query(sql,safevalue)
    .then(val=>{
        res.redirect(`/Details/${req.params.id}`)
    })

}

function Maybelline(new1){
this.name=new1.name
this.price=new1.price
this.image_link=new1.image_link
this.description=new1.description
}

client.connect()
.then(()=>{
    server.listen(PORT,()=> console.log(`lesning to the ${PORT}`))
})
















