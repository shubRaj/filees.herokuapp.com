const cluster = require("cluster");
function startWorker() {
    const worker = cluster.fork()
    console.log(`Started Worker: ${worker.id}`)
}
if (cluster.isMaster) {
    require("os").cpus().forEach(startWorker);
    cluster.on("disconnect", worker => console.log(
        `
        CLUSTER: Worker ${worker.id} disconnected from the
        cluster.
        `
    ));
    cluster.on("exit", (worker, code, signal) => {
        console.log(
            `
            CLUSTER: Worker ${worker.id} died with exit ${code}
            (${signal})
            `
        );
        startWorker();
    });
} else {
    require("./app")(process.env.PORT||3000)
}