import express, { json } from "express"
import cors from "cors"
import bodyParser from "body-parser";
// import MongoClient,ServerApiVersion from "mongodb";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import dotenv from "dotenv"
const app=express()
const PORT = process.env.PORT || 2001;
var data,postdata,team1players,team2,team2players,team1,playerscore,teamscore
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
dotenv.config()
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
// const mongoose = require('mongoose');

 const uri=process.env.MONGO_URI||"mongodb+srv://asrithsai840:20911a04d2@cluster0.sazwe.mongodb.net/cricore?retryWrites=true&w=majority&appName=Cluster0"
//  console.log(uri)
 let teamsdata,user,team11players,team22players 
mongoose.connect(uri,{
   
    serverSelectionTimeoutMS: 30000, // Increase timeout
})
.then(res=>console.log("connected"))
let schema={
    id:Number,
    name:String,
    score:Number,
    wickets:Number,
    ballsplayed:Number,
    oversbowled:Number,
    scoregiven:Number
}
let userSchema={
    username:String,
    mailId:String,
    passcode:String
}
let matchschema={
    id:Number,
    name:String,
    score:Number,
    wickets:Number,
    oversplayed:Number
}
team22players=mongoose.model("team2players",schema)
 team11players=mongoose.model("team1players",schema)
 user=mongoose.model("userData",userSchema)
 teamsdata=mongoose.model("teamsData",matchschema)
team22players.deleteMany({}).then((res)=>{
    console.log(res)
}).catch((err)=>{
    console.log(err)
})
team11players.deleteMany({}).then((res)=>{
    console.log(res)
}).catch((err)=>{
    console.log(err)
})
teamsdata.deleteMany({}).then((res)=>{
    console.log(res)
}).catch((err)=>{
    console.log(err)
})
 
// user.deleteMany({}).then((res)=>{
//     console.log(res)
// }).catch((err)=>{
//     console.log(err)
// })

// const player=new crict(newplayer)
// player.save()

// crict.createCollection().then((col)=>{
//     console.log(col)
// })
// const userSchema = new mongoose.Schema({
//     id:Number,
//         name:String,
//         score:Number,
//         wickets:Number,
//         ballsplayed:Number,
//         oversbowled:Number,
//         scoregiven:Number  
//     });
//     const User = mongoose.model('User', userSchema);
    
//     new User(newplayer)
async function authenticate(req,res,next){
    try{
         const data=await user.find({mailId:req.query.mailId})   
         if(data.length!==0){
            if(req.query.passcode!=data[0].passcode){
                res.send("password is incorrect")
            }
            else{
                return next()
            }
         }
         else{
            res.send("user not found")
         }
     console.log(data,req.query)}
     catch(err){
        console.log(err)
     }
}
app.post("/sign_up",(req,res)=>{
    console.log(req.body)
    const use=new user({
        username:req.body.username,
        mailId:req.body.mailId,
        passcode:req.body.passcode
    })
    use.save()
    res.send("registered succefully")
})
app.get("/",authenticate,(req,res)=>{
    res.send(true)
    console.log("from get/")

})
app.get("/teams",async(req,res)=>{
    setTimeout(async()=>{ const team1data=await team11players.find({})
    const team2data=await team22players.find({})
    const team1=await teamsdata.find({id:0})
    const team2=await teamsdata.find({id:1})
    if(team1!==undefined&&team2!==undefined){
      res.send({teamname1:team1[0].name,teamname2:team2[0].name,team1players:team1data,team2players:team2data})
     }
      console.log("from get/teams")},10000)
   
})
app.post("/post",async(req,res)=>{
    data=(req.body)
    // console.log("from post/post",(data.team1))
    // console.log("from parseee post/post",data.team1)
    // console.log(JSON.parse(data.team1))
    team1={
        id:0,
        name:data.teamname1,
     
        score:0,
        wickets:0,
        oversplayed:0

    }
    team2={
        id:1,
        name:data.teamname2,
        
        score:0,
        wickets:0,
        oversplayed:0
    }
    // console.log("from damnnnn post/post",team1.name,team2)
    team1players=(data.team1).map((players,index)=>{
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
    team2players=(data.team2).map((players,index)=>{
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
    const teamdata1=new teamsdata(team1)
    const teamdata2=new teamsdata(team2)
    teamdata1.save()
    teamdata2.save()
    // console.log("from post/post",team2data)
    console.log("from mannnnnn post/post",data)
    team1players.map((player)=>{
        const player1=new team11players(player)
        player1.save().then("saved succefully")
    }) 
     team2players.map((player)=>{
        const player2=new team22players(player)
        player2.save()
    })
    // data1={data,team1data,team2data}

 
    res.status(200).send({}) 

    

})

app.post("/toss",(req,res)=>{
    postdata=(req.body)
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
app.patch("/update/:id",async(req,res)=>{
    playerscore=req.body
    const id=req.params.id
   if(playerscore.team===data.teamname1)
    {
     team1players[id]={...team1players[id],score:playerscore.score,ballsplayed:playerscore.ballsplayed*1,wickets:playerscore.wickets,oversbowled:playerscore.oversbowled,scoregiven:playerscore.scoregiven*1+team1players[id].scoregiven}
      team11players.updateOne({id:id},
        {$set:{
            score:playerscore.score*1,
            ballsplayed:playerscore.ballsplayed*1,
            wickets:playerscore.wickets*1,
            oversbowled:playerscore.oversbowled*1,
            scoregiven:0
      }}).then((res)=>console.log(res)).
      catch(err=>console.log("from updte id",err))
     let players1=await team11players.find({})
     let players2=await team22players.find({})

     res.send({players1,players2})
    }
    else if(playerscore.team===data.teamname2){
        team2players[id]={...team2players[id],score:playerscore.score,ballsplayed:playerscore.ballsplayed*1,wickets:playerscore.wickets,oversbowled:playerscore.oversbowled,scoregiven:playerscore.scoregiven*1}
        res.send({team1players,team2players})
    }
    // console.log("from patch/id",playerscore,team1players[id],team2players[id],data)

})
// app.get("/updated",(req,res)=>{
//     res.send(team1players)
// })

app.listen(PORT,console.log("starrrtttt"))