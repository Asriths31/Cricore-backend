import express, { json } from "express"
import cors from "cors"
import bodyParser from "body-parser";
import mysql from "mysql2"
import mongoose from "mongoose";

const app=express()
const PORT = process.env.PORT || 2001;
var data,postdata,team1players,team2,team2players,team1,playerscore,teamscore
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))

// app.use(express.urlencoded({extended:true}))


// team2players=team2.map((players,index)=>{
//     return({
//         id:index,
//         name:players,
//         score:0,
//         wickets:0,
//         balls:0
//     })
// })
// console.log(team2players)

let con=mysql.createConnection({
    host:"localhost",
    port:"3306",
    database:"cricket",
    user:"root",
    password:"admin"
})
let con1=mysql.createConnection({
    host:"localhost",
    // port:"3306",
    // database:"cricket",
    user:"root",
    password:"admin"
})
mongoose.connect("mongodb://localhost:27017/mydb",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
let schema={
    id:Number,
    name:String,
    score:Number,
    wickets:Number,
    ballsplayed:Number,
    oversbowled:Number,
    scoregiven:Number
}       

const crict=mongoose.model("cricket",schema)

const player=new crict(newplayer)



con.connect((err)=>{
    if(err) throw(err)
    else console.log("connected")
})
con1.connect((err)=>{
    if(err) throw(err)
    else console.log("connected")
})


con.query('delete from data where id<14',(err,res)=>{
       if(err) console.log(err)
       else console.log(res)
})
con.query('delete from team2 where id<14',(err,res)=>{
    if(err) console.log(err)
    else console.log(res)
})
con.query('delete from teamsdata where id<14',(err,res)=>{
    if(err) console.log(err)
    else console.log(res)
})
function authenticate(req,res,next){
    con.query('select * from users where mail_id=?',[req.query.mail_id],(err,res1)=>{
        if(err) console.log(err,"errr")
        else {
    
            console.log(res1,req.query,"from res")
            if(res1.length===0) {
                console.log("user not found")
                return res.send([0,"user not found"]);
            }
            else{
             if(res1[0].passcode===req.query.passcode){
                console.log("authenticated")
                // res.send(true)
                return next()
             }
             else{
                console.log("password is incorrect")
                return res.send([0,"password is incorrect"])
             }
        
        
            }
        }
    })


}
app.post("/signup",(req,res)=>{
    con.query(`insert into users set ?`,[req.body],(err,res1)=>{
        if(err) console.log("from signup",err)
        console.log("signup",res1)
    })
    const username=req.body.username
    con1.query(`CREATE DATABASE ${username}
                 `,(err,res)=>{
        if(err){ 
            console.log(username)
            console.log(err)}
        else console.log("database created")
    })
    // con1.query(`use ${username}
    //             create table matches(
    //             matchno int auto_increment primary key,
    //             match varchar(20),
    //             won varchar(20),
    //             lose varchar(20)
    //             );
    //             `)
})
app.get("/",authenticate,(req,res)=>{
    var resut
    // console.log(req,"--",res,"frommmmmmmmmm")
    con.query(`select count(*) from data`,async(err,res1)=>{
        if(err) throw(err)
        else {
     resut= res1[0]['count(*)']
    res.send([{resut},true])
}

    })
    console.log("from get123e/")
// res.send({})
   
})
app.get("/teams",(req,res)=>{

      con.query(`select * from data`,(err,resp)=>{
        if(err) throw(err)
        else{
    con.query(`select * from team2`,(err,resp1)=>{
        if(err) throw(err)
        else{
            con.query(` select * from teamsdata`,(err,resp2)=>{
                if(err) throw(err)
                else{
                    res.send({teamname1:resp2[0].teamName,teamname2:resp2[1].teamName,team1players:resp,team2players:resp1})
                }
            })
        }
    })

        }
      })

      console.log("from get/teams")
    
})
app.post("/post",(req,res)=>{
    data=(req.body)
    console.log("from post/post",(data))
    // console.log("from parseee post/post",data.team1)
    // console.log(JSON.parse(data.team1))
    team1={
        id:0,
        name:data.teamname1,
        team:(data.team1),
        score:0,
        wickets:0,
        oversplayed:0

    }
    team2={
        id:1,
        name:data.teamname2,
        team:(data.team2),
        score:0,
        wickets:0,
        oversplayed:0
    }
    console.log("from damnnnn post/post",team1,team2)
    team1players=((data.team1)).map((players,index)=>{
        return({
            id:index+1,
            name:players,
            score:0,
            wickets:0,
            ballsplayed:0,
            oversbowled:0,
            scoregiven:0

        })
    })
    team2players=(team2.team).map((players,index)=>{
        return({
            id:index+1,
            name:players,
            score:0,
            wickets:0,
            ballsplayed:0,
            oversbowled:0,
            scoregiven:0
        })
    })
    data={...data,team1players,team2players}
    // console.log("from mannnnnn post/post",data)
    team1players.map(player=>{con.query("insert into data set ?",[player],(err,res)=>{
        if(err) console.log(err)
        // console.log(res)
    })})
    team2players.map(player=>{con.query("insert into team2 set ?",[player],(err,res)=>{
        if(err) console.log(err)
        // console.log(res)
    })})
    con.query(`insert into teamsdata(id,teamName,score,wickets,oversplayed)
        values(?,?,?,?,?)`,[1,team1.name,team1.score,team1.wickets,team1.oversplayed],(err,re)=>{
            if(err) throw(err)
            console.log("teamnames inserted")

        })  
  con.query(`insert into teamsdata(id,teamName,score,wickets,oversplayed)
            values(?,?,?,?,?)`,[2,team2.name,team2.score,team2.wickets,team2.oversplayed],(err,re)=>{
                if(err) throw(err)
                console.log("teamnames inserted")
    
            })
    team1players.map(playeree=>{
        const player=new crict(playeree)
        player.save().
        then((data)=>console.log(data)).
        catch((err)=>console.log(err))


    })
    res.status(200).send({team1players,team2players}) 

    

})

app.post("/toss",(req,res)=>{
    postdata=(req.body)
    
    con.query(`update teamsdata
        set totalovers=?,toss=? where teamName=?`,[postdata.overs,true,postdata.batting],(err,re)=>{
            if(err) throw(err)
            else console.log("toss updated")
        })
        con.query(`update teamsdata
            set totalovers=?,toss=? where teamName=?`,[postdata.overs,false,postdata.bowling],(err,re)=>{
                if(err) throw(err)
                else console.log("toss updated")
            })
     console.log("from post/toss",postdata)
})

app.get("/toss",(req,res)=>{
    res.send(postdata)
    console.log("from get/toss",postdata)

})

app.patch("/toss",(req,res)=>{
    console.log(req.body)
    postdata={...postdata, batting: req.body.batting,
        bowling:  req.body.bowling,
        striker:  req.body.striker,
        nonstriker:  req.body.nonstriker,
        bowler:  req.body.bowler,
        overs:  req.body.overs}
        console.log(postdata)
})


app.patch("/update/",(req,res)=>{ 
     const team=req.params.team
     teamscore=req.body
     if(data.teamname1===teamscore.team){
           team1={...team1,score:teamscore.score,wickets:teamscore.wickets+1,oversplayed:teamscore.oversplayed}
     
     res.send(team1)
        }
     if(data.teamname2===teamscore.team){
        team2={...team2,score:teamscore.score,wickets:teamscore.wickets+1,oversplayed:teamscore.oversplayed}
     res.send(team1)
    //  console.log("updateesddd2222")

    }
console.log("from patch/updateesddd",teamscore,team1,team2)
     
})
app.patch("/update/:id",(req,res)=>{
    playerscore=req.body
    const id=req.params.id-1
    var reddy,reddy1
   if(playerscore.team===data.teamname1)
    {
     team1players[id]={...team1players[id],score:playerscore.score,ballsplayed:playerscore.ballsplayed*1,wickets:playerscore.wickets,oversbowled:playerscore.oversbowled,scoregiven:0}
     con.query(`update data set ? where name=?`,[team1players[id],team1players[id].name],(err,res)=>{
        if(err) console.log(err)
        else console.log("updatedd")
     })

     
     con.query(`select * from data`,(err,re)=>{
        if(err) console.log(err)
        else {
            reddy=re
            con.query(`select * from team2`,(err,re1)=>{
            if(err) console.log(err)
            else {
        reddy1=re1;
    //     console.log(reddy)
    //  console.log(reddy1)
        res.send({reddy,reddy1})}

         })}
     })
     
     
    }
    else if(playerscore.team===data.teamname2){
        team2players[id]={...team2players[id],score:playerscore.score,ballsplayed:playerscore.ballsplayed*1,wickets:playerscore.wickets,oversbowled:playerscore.oversbowled,scoregiven:playerscore.scoregiven*1}
        con.query(`update team2 set ? where name=?`,[team2players[id],team2players[id].name],(err,res)=>{
            if(err) console.log(err)
            else console.log("updatedd")
         })
         con.query(`select * from data`,(err,re)=>{
            if(err) console.log(err)
            else {
                reddy=re
                con.query(`select * from team2`,(err,re1)=>{
                if(err) console.log(err)
                else {
            reddy1=re1;
        //     console.log(reddy)
        //  console.log(reddy1)
            res.send({reddy,reddy1})}
    
             })}
         })   
        }
    // console.log("from patch/id",playerscore,team1players[id],team2players[id],data)

})
// app.get("/updated",(req,res)=>{
//     res.send(team1players)
// })

app.listen(PORT,console.log("starrrtttt"))