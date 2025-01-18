import express, { json } from "express"
import cors from "cors"
import bodyParser from "body-parser";
// import MongoClient,ServerApiVersion from "mongodb";
import mongoose from "mongoose";
import { MongoClient, Timestamp } from "mongodb";
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
    oversplayed:Number,
    overs:Number,
    count1:Number,
    toss:Boolean
}
team22players=mongoose.model("team2players",schema)
 team11players=mongoose.model("team1players",schema)
 user=mongoose.model("userData",userSchema)
 teamsdata=mongoose.model("teamsData",matchschema)
 
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
let data999,data99
async function authenticate(req,res,next){
    try{
          data999=await user.find({mailId:req.query.mailId})   
         if(data999.length!==0){
            if(req.query.passcode!=data999[0].passcode){
                res.send("password is incorrect")
            }
            else{
                 next()
            }
         }
         else{
            res.send("user not found")
         }
     }
     catch(err){
        console.log(err)
     }
}
app.post("/sign_up",async(req,res)=>{
    console.log(req.body)
     data99=await user.find({mailId:req.body.mailId})   
    console.log("from signUp",data99)
    if(data99.length===0){
    const use=new user({
        username:req.body.username,
        mailId:req.body.mailId,
        passcode:req.body.passcode
    })
    use.save()
    res.send("registered succefully")
     }
    else{
    res.send("User already exists")
    }
})
app.get("/live",async (req,res)=>{
    let match=await teamsdata.find({}).sort({id:1})
    let team1players=await team11players.find({}).sort({id:1})
    let team2players=await team22players.find({}).sort({id:1})
     res.send([match,team1players,team2players])

})
app.get("/",authenticate,(req,res)=>{
    res.send(true)
    console.log("from get/",req.data)
})
app.post("/sign-user",async(req,res)=>{
    console.log("userrr",req.body)
    let data9=await user.find({mailId:req.body.mailId})
    console.log("user1",data9[0])
    team11players.deleteMany({}).then((res)=>{
    console.log(res)
    }).catch((err)=>{
    console.log(err)
    })
    team22players.deleteMany({}).then((res)=>{
        console.log(res)
        }).catch((err)=>{
        console.log(err)
        })
    teamsdata.deleteMany({}).then((res)=>{
            console.log(res)
            }).catch((err)=>{
            console.log(err)
            })
   res.send(data9[0])
})
app.patch("/sign",(req,res)=>{

}) 
app.get("/teams",async(req,res)=>{
    setTimeout(async()=>{ const team1data=await team11players.find({}).sort({id:1})
    const team2data=await team22players.find({}).sort({id:1})
    const team1=await teamsdata.find({id:0})
    const team2=await teamsdata.find({id:1})
    if(team1!==undefined&&team2!==undefined){
      res.send({teamname1:team1[0].name,teamname2:team2[0].name,team1players:team1data,team2players:team2data})
     }
      console.log("from get/teams")},4000)
   
})
app.post("/post",async(req,res)=>{
    data=(req.body)
    // console.log("from post/post",(data.team1))
    // console.log("from parseee post/post",data.team1)
    // console.log(JSON.parse(data.team1))
    team1={
        id:0,
        name:data.teamname1,
        overs:0,
        score:0,
        wickets:0,
        oversplayed:0,
        count1:0,
        toss:false

    }
    team2={
        id:1,
        name:data.teamname2,
        overs:0,
        score:0,
        wickets:0,
        oversplayed:0,
        count1:0,
        toss:false
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
    console.log("from post/toss",postdata,postdata.batting===data.teamname1,postdata.batting===data.teamname2)
    if(postdata.batting===data.teamname1){
        teamsdata.updateOne({id:0},{$set:{
            toss:true
        }})
        
    }
    else if(postdata.batting===data.teamname2){
        teamsdata.updateOne({id:1},{$set:{
            toss:true
        }})
    }
    console.log("from post/toss",postdata,postdata.batting===data.teamname1,postdata.batting===data.teamname2)

})

app.get("/toss",(req,res)=>{
    res.send(postdata)
    teamsdata.updateMany({},{$set:{
        overs:postdata.overs
    }}).then(res=>console.log("from get/toss",res))
    .catch(err=>console.log("from get/toss",err))
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


app.patch("/update/",async(req,res)=>{ 
     const team=req.params.team
     teamscore=req.body
     if(data.teamname1===teamscore.team){
           team1={...team1,score:teamscore.score,wickets:teamscore.wickets+1,oversplayed:teamscore.oversplayed}
     teamsdata.updateOne({id:0},{$set:{
        score:teamscore.score*1,
        wickets:teamscore.wickets*1,
        oversplayed:teamscore.oversplayed*1,
        count1:teamscore.count1*1
     }}).then(res=>console.log("from update",res))
     .catch(err=>console.log("from update",err))
     res.send(await teamsdata.find({id:0}))
        }
     if(data.teamname2===teamscore.team){
        team2={...team2,score:teamscore.score,wickets:teamscore.wickets+1,oversplayed:teamscore.oversplayed}
           teamsdata.updateOne({id:1},{$set:{
        score:teamscore.score*1,
        wickets:teamscore.wickets*1,
        oversplayed:teamscore.oversplayed*1,
        count1:teamscore.count1*1

     }}).then(res=>console.log("from update",res))
     .catch(err=>console.log("from update",err))
     res.send(await teamsdata.find({id:1})
)
    //  console.log("updateesddd2222")

    }
console.log("from patch/updateesddd",teamscore,team1,team2)
     
})
app.patch("/update/:id",async(req,res)=>{
    playerscore=req.body
    const id=req.params.id
   if(playerscore.team===data.teamname1)
    {
     team1players[id]={...team1players[id],score:playerscore.score,ballsplayed:playerscore.ballsplayed*1,wickets:playerscore.wickets,oversbowled:playerscore.oversbowled}
      team11players.updateOne({id:id},
        {$set:{
            score:playerscore.score*1,
            ballsplayed:playerscore.ballsplayed*1,
            wickets:playerscore.wickets*1,
            oversbowled:playerscore.oversbowled*1,
            scoregiven:(((playerscore.scoregiven)===undefined)?0:playerscore.scoregiven)
      }}).then((res)=>console.log(res)).
      catch(err=>console.log("from updte id",err))
     let players1=await team11players.find({}).sort({id: 1})
     let players2=await team22players.find({}).sort({id: 1})

     res.send({team1players:players1,team2players:players2})
    }
    else if(playerscore.team===data.teamname2){
        team2players[id]={...team2players[id],score:playerscore.score,ballsplayed:playerscore.ballsplayed*1,wickets:playerscore.wickets,oversbowled:playerscore.oversbowled}
         team22players.updateOne({id:id},
        {$set:{
            score:playerscore.score*1,
            ballsplayed:playerscore.ballsplayed*1,
          wickets:playerscore.wickets*1,
            oversbowled:playerscore.oversbowled*1,
            scoregiven:(((playerscore.scoregiven)===undefined)?0:playerscore.scoregiven)
      }}).then((res)=>console.log(res)).
      catch(err=>console.log("from updte id",err))
     let players1=await team11players.find({}).sort({"id": -1})
     let players2=await team22players.find({}).sort({"id": -1})

     res.send({team1players:players1,team2players:players2})
    }
    // console.log("from patch/id",playerscore,team1players[id],team2players[id],data)

})
// app.get("/updated",(req,res)=>{
//     res.send(team1players)
// })

app.listen(PORT,console.log("starrrtttt"))