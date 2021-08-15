const express = require("express");
const parseMagnet = require("./parseMagnet")
const app = express();
const { createWriteStream } = require("fs");
const morgan = require("morgan");
if (process.env.NODE_ENV === "production") {
    stream = createWriteStream(__dirname + "/access.logs", { flags: "a" });
    app.use(morgan("compiled", { stream }));
} else {
    app.use(morgan("dev"));
}
app.set("json spaces",4);
app.get("/",async (req,res)=>{
    const { magnet,hash } = req.query
    if ((magnet && magnet.startsWith("magnet:?xt=urn:btih:"))||(hash && hash.length===40)) {
        return res.json({status:"success",data:await parseMagnet(magnet||hash)})
    }
    return res.json({
        status: "error",
        info:"provide valid magnet uri"
    })
})
function startServer(port){
    app.listen(port,()=>{
        console.log("Listening on port 3000")
    })
}
if (require.main === module) {
    startServer(process.env.PORT||3000);
}
else {
    module.exports = startServer;
}
