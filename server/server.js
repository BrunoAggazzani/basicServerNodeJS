import app from './app';

// Puerto de escucha servidor
let port = 2417 || process.env.PORT;
app.listen(port, () => {
    console.log("server is running in port " + port);
});
