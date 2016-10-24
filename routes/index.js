var express = require('express');
var mock = require('mockjs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.redirect('../html/index.html');
});
router.get('/')
router.route('/hello')
	.get(function(req, res, next) {
	    console.log(req.url);
	    var body = 'Hello World';
	    // res.setHeader('Content-Type', 'text/plain');
	    // res.setHeader('Content-Length', body.length);
	    // res.end(body);
	    res.send(body);
	})
	.post(function(req, res, next) {
	    // console.log(req.method);
	    if (Object.getOwnPropertyNames(req.body).length) {
		    console.log("req.body",req.body);
		    console.log('req.body.key',req.body.key);
	    } else {
	    	var buffers = [];
            req.on('data', function (chunk) {
               buffers.push(chunk); //读取参数流转化为字符串
            }).on('end', function () {
			var buffer = Buffer.concat(buffers);
				bufferStr = buffer.toString('utf-8');
			console.log("buffer",bufferStr);
            });
	    }

	    var body = [];
	    body.push({'name':'张三'});
	    body.push({'name':'李四'});
	    body.push({'name':'王二'});
	    return;
	    // res.setHeader('Content-Type', 'text/plain');
	    // res.setHeader('Content-Length', body.length);
	    // res.end(body);
	    res.send(body);
	});
router.route('/test')
	.get(function(req,res,next) {
		var data = mock.mock({
		    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
		    'list|1-10': [{
		        // 属性 id 是一个自增数，起始值为 1，每次增 1
		        'id|+1': 1
		    }]
		});
		res.send(data);
	})
module.exports = router;
