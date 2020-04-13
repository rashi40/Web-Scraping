const request =require('axios');
const cheerio =require('cheerio');
var express = require("express");
const fs=require('fs');
var app= express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended :true }));
 
app.set("view engine", "ejs");

const writeStream= fs.createWriteStream('Post.csv');
writeStream.write('product,average price\n');
const useragent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36';

app.get("/", function(req, res){
	res.render("index");
});

app.get('/results', function(req, res){
	var product = req.query.product;
	var singleproducts= product.split(',');
	 
		 async function main(){
			 var data=[];
			 singleproducts.forEach(async function(p){
		  p.replace(/ /,'+');
		 const url='https://www.amazon.com/s?k='+p;
	const response =await request.get(url,{
		headers: {
			"User-Agent": useragent
		}
	});
	
	const html=response.data;
	const $=cheerio.load(html);
	const priceElement =$(".a-price").text();
	/*var i=0;
	$(".a-price").each(function(el){
		if(i<20)
		console.log($(el).text());
		i++;
	});*/
	var i=0;
	var sum=0.0;
   
	var items=priceElement.split("$"); 
	items.forEach(function(el){
		if(i<20){
		console.log(i+" "+el+" "+sum+" ");
		 sum += parseFloat(el) || 0;
		i++;}
		
	});
				// console.log(sum+" "+i);
	sum=(sum/i).toFixed(2);
		console.log(sum+" "+p);
 data.push(sum);
	writeStream.write(p+","+"$"+sum+'\n');
}
	 );
		if(data !== "")	
	res.render("results",{data:data}); 
		 }
	
	
	main().catch(console.error);
});

//show();

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Server is Running!");});
