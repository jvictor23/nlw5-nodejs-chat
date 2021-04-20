import express from 'express';

const app = express();

app.use('/',(req,res)=>{
    res.send("Olá Mundo")
})

app.listen(3000, ()=> console.log("Server is running on port 3000"));

