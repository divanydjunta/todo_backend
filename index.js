const my_sql = require('mysql')
var express = require('express')
var cors = require('cors')
var app = express()
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
app.post('/todo',(req,res)=>{
    var my_data = req.body.desc
    var insert="INSERT INTO tbl_todo(desc) VALUES('"+my_data+"')"
    connect.query(insert,my_data,function(err,data){
        if(err)throw err
        console.log("DATA INSERTED");
    })
    res.end()
})
app.get('/todo',(req,res)=>{
    var select = "SELECT * from tbl_todo"
    connect.query(select,(err,rows,field)=>{
        if(!err)
            res.send(rows)
        else
            console.log(err);
    })
})
app.delete('/todo/:id', (req, res)=>{
    var del = "DELETE from tbl_todo WHERE id='"+req.params.id+"'"
    connect.query(del,(err, rows, field)=>{
        if(!err)
            res.send(rows)
        else
            console.log(err);
    })
})
app.listen(3000)