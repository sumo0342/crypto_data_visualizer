const express = require('express')
const app = express()
const port = 3000
var request = require('request');
const bodyParser = require("body-parser");
var multer = require('multer');
var upload = multer();
const axios = require('axios');
const { resolve } = require('path');
const { rejects } = require('assert');


let obj;
let chartObj;
var coinName="bitcoin";



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(upload.array());



async function respondQuery(coinName) {

  var marketData = await new Promise((resolve,reject) => {
    const payload = {
      api_key: '79bb6690e81aa3d43933995d07883c28',
      url: 'https://api.coingecko.com/api/v3/coins/'+coinName
    };
    
    axios
      .get('http://api.scraperapi.com', { params: payload })
      .then((response) => {
        console.log(response.status);
        obj=response.data;
        console.log(typeof(response.data));
        resolve(obj);
      })
      .catch((error) => {
        console.error(error);
      });
  })

  if(marketData) {
    var marketChart = await new Promise((resolve,reject) => {
      const payload = {
        api_key: '79bb6690e81aa3d43933995d07883c28',
        url: 'https://api.coingecko.com/api/v3/coins/'+coinName+'/market_chart?vs_currency=usd&days=30'
      };
      
      axios
        .get('http://api.scraperapi.com', { params: payload })
        .then((response) => {
          console.log(response.status);
          chartObj=response.data;
          console.log(typeof(response.data));
          resolve(chartObj);
        })
        .catch((error) => {
          console.error(error);
        });
    })
  }


  
};



app.use(express.static("public"));
app.set('view engine', 'ejs');


app.get('/', async(req, res) => {
  await respondQuery(coinName);
  res.render('index',{obj,chartObj})
})

app.post('/', async(req, res) => {
  coinName = req.body.selectCoin;
  console.log(coinName);
  await respondQuery(coinName);
  res.render('index',{obj,chartObj,coinName})
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})