import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2"

const app=express()
app.use(bodyParser.urlencoded({extended:true}))

var con=mysql.createConnection({
    host:"localhost",
    port:"3306",
    database:"cricket",
    user:"root",
    password:"admin"
})


con.connect(function(err){
    if(err) throw err
    else{
        console.log("connected")
        // con.query(`SHOW DATABASES`,
        //     function (err, result) {
        //         if (err)
        //             console.log(`Error executing the query - ${err}`)
        //         else
        //             console.log("Result: ", result)
        //     })
    }
})

const newplayer={
    playername:"dhoni",
    runs:"140",
    ballsplayed:0,
    runsgiven:0,
    wickets_taken:0,
    overs_bowled:0
}

// con.query(`update data set ? where playername=?`,[newplayer,newplayer.playername],(err,result)=>{
//     if(err) console.log(err)
//     else{
//       console.log("data inserted successfully",result)
//       con.query(`select * from data`,(err,result)=>{
//         if(err) console.log(err)
//         else{
//       console.log(result)
//         }
//       })
// }
// })
let resul
con.query(`select count(*) from team2`,(err,result)=>{
  if(err) throw(err)
    else {resul=result[0]['count(*)']
  console.log(resul)}
})
app.listen(1000,console.log("staredddd"))