import  express  from "express";
import morgan from "morgan";
import pkgjson from '../package.json';
import productsRoutes from './routes/product.routes';
const app = express();

app.set('pkg', pkgjson);

app.use(morgan('dev'));

app.get('/', (req, res)=>{
    res.json({
        Name: app.get('pkg').name,
        Version: app.get('pkg').version,
        Author: app.get('pkg').author 
    });
})

app.use('/products', productsRoutes);

export default app;