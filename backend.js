import express from "express"
import cors from "cors"
const app=express()
const PORT = process.env.PORT || 2001;
let data,data1
app.use(cors())
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.send("hi")
})
app.get("/teams",(req,res)=>{
      res.send(data)
      console.log("data2",data)
})
app.post("/post",(req,res)=>{
    data=req.body
    console.log(data)

})
app.post("/toss",(req,res)=>{
    data1=req.body
     console.log(data1)
})
app.get("/toss",(req,res)=>{
    res.send(data1)
})


app.listen(PORT,console.log("starrrtttt"))