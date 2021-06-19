const sql = require('mysql')

const connect = sql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database: 'todo_list'
})

module.exports = function(req, res, next){
    const username = req.headers.username
    const password = req.headers.password

    connect.query("SELECT username FROM tbl_user WHERE username =? AND password =?",
    [username, password],function(err,rows){
        if(rows.length > 0){
            next()
        }
        else{
            res.send(401)
        }
    })
}