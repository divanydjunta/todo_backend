const my_sql = require('mysql')
var express = require('express')
var cors = require('cors')
var md5 = require('md5')
var app = express()
var authen = require('./middleware/auth.js')
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const connect = sql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database: 'todo_list'
})
connect.connect(function(err){
    if(err){
        console.log(err);}
    else {
        console.log("Connected")
    }
})

app.get('/',(req,res)=>{
    res.end(
    `<html>
        <div>
            <form method="post" action="/todo">
                <input type="text" name="desc">
                    <button type="submit">Add</button>
                </input>
            </form>
        </div>
    </html>`)
})
app.post('/todo',authen,(req,res)=>{
    var my_data = req.body.desc
    var insert="INSERT INTO tbl_todo(desc) VALUES('"+my_data+"')"
    connect.query(insert,my_data,function(err,data){
        if(err)throw err
        console.log("DATA INSERTED");
    })
    res.end()
})
app.get('/todo',authen,(req,res)=>{
    var select = "SELECT * from tbl_todo"
    connect.query(select,(err,rows,field)=>{
        if(!err)
            res.send(rows)
        else
            console.log(err);
    })
})
app.delete('/todo/:id',authen, (req, res)=>{
    var del = "DELETE from tbl_todo WHERE id='"+req.params.id+"'"
    connect.query(del,(err, rows, field)=>{
        if(!err)
            res.send(rows)
        else
            console.log(err);
    })
})

app.post('/user', (req,res,next)=>{
    connect.query('SELECT COUNT(*) as jumlah_user FROM tbl_user',(err,result)=>{
        var hsl = Object.values(result)
        if(hasil[0].jumlah_user > 0){
            authen(req,res,next)
        }
        else{
            next()
        }
    })
},(req,res)=>{
    var data_name = req.body.username
    var data_password = req.body.password

    data_name = md5(data_password)

    connect.query("SELECT username FROM tbl_user WHERE username =?", [data_name], (err, rows, field) =>{
        if(rows.length >1)
            res.send(404)
    })
    connect.query("INSERT into tbl_user(username, password) VALUES (?,?)", [data_name, data_password], function(err){
        if(err){
            res.send(500)
            return
        }
    })
    connect.query("SELECT id_user, username FROM tbl_user ORDER BY id_user DESC LIMIT 1",(err, rows, field)=>{res.send(rows)})
})


app.get('/user',authen,(req,res)=>{
    connect.query("SELECT id_user, username from user",(err,rows,field)=>{
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err);
        }
    })
})

app.delete('/user/:id_user',authen, (req,res,next)=>{
    connect.query("SELECT COUNT(*) as jumlah_user FROM tbl_user", (err, result)=>{
        var hsl = Object.values(result)
        if(hsl[0].jumlah_user <=1){
            res.send(404)
        }
        else{
            next()
        }
    })
},(req, res)=>{
    connect.query("DELETE from tbl_user WHERE id_user = '"+req.params.id_user+"'", (err, rows, field)=>{
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err);
        }
    })
})

app.listen(3000)