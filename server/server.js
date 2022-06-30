import app from './app';


/*
// Configuración
app.set('view engine', 'ejs');
app.set('views', join(__dirname, './views'));

// middlewares
app.use(json({limit:"100mb"}));
app.use(morgan('dev'));
app.use(urlencoded({ extended: true }));
app.use(cors({origin: '*'}));

//rutas
app.use('/', router);
*/
// Puerto de escucha servidor
app.listen(4007, () => {
    console.log("server is running in port " + 4007);
})
