import express from "express"
import cors from "cors"
const app=express()
const PORT = process.env.PORT || 2001;
let data,postdata,team1players,team2,team2players,team1,playerscore,teamscore
app.use(cors())
app.use(express.urlencoded({extended:true}))


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


app.get("/",(req,res)=>{
    res.send("hi")
    console.log("from get/")

})
app.get("/teams",(req,res)=>{
      res.send(data)
      console.log("from get/teams",data)
})
app.post("/post",(req,res)=>{
    data=req.body
    console.log("from post/post",data.team1)
    team1={
        id:0,
        name:data.teamname1,
        team:JSON.parse(data.team1),
        score:0,
        wickets:0,
        oversplayed:0
    }
    team2={
        id:1,
        name:data.teamname2,
        team:JSON.parse(data.team2),
        score:0,
        wickets:0,
        oversplayed:0
    }
    console.log("from post/post",team1players)
    team1players=team1.team.map((players,index)=>{
        return({
            id:index,
            name:players,
            score:0,
            wickets:0,
            ballsplayed:0,
            oversbowled:0
        })
    })
    team2players=team2.team.map((players,index)=>{
        return({
            id:index,
            name:players,
            score:0,
            wickets:0,
            ballsplayed:0,
            oversbowled:0
        })
    })
    data={...data,team1players,team2players}
    console.log("from post/post",team1players,data)


    res.send({team1players,team2players}) 

    

})

app.post("/toss",(req,res)=>{
    postdata=req.body
     console.log("from post/toss",postdata)
})
app.get("/toss",(req,res)=>{
    res.send(postdata)
    console.log("from get/toss",postdata)

})
app.patch("/update/",(req,res)=>{ 
     const team=req.params.team
     teamscore=req.body
     if(data.teamname1===teamscore.team){
           team1={...team1,score:teamscore.score,wickets:teamscore.wickets,oversplayed:teamscore.oversplayed}
     
     res.send(team1)
        }
     if(data.teamname2===teamscore.team){
        team2={...team2,score:teamscore.score,wickets:teamscore.wickets,oversplayed:teamscore.oversplayed}
     res.send(team2)
    //  console.log("updateesddd2222")

    }
console.log("from patch/updateesddd")
     
})
app.patch("/update/:id",(req,res)=>{
    playerscore=req.body
    const id=req.params.id
    console.log("from patch/id")
   if(playerscore.team===data.teamname1)
    {
     team1players[id]={...team1players[id],score:playerscore.score,ballsplayed:playerscore.ballsplayed,wickets:playerscore.wickets,oversbowled:playerscore.oversbowled}
    res.send(team1players[id])
    }
    else if(playerscore.team===data.teamname2){
        team2players[id]={...team2players[id],score:playerscore.score,ballsplayed:playerscore.ballsplayed,wickets:playerscore.wickets,oversbowled:playerscore.oversbowled}
        res.send(team2players[id])
    }
})
// app.get("/updated",(req,res)=>{
//     res.send(team1players)
// })

app.listen(PORT,console.log("starrrtttt"))