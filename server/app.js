import express from "express";
import path from 'path';
import morgan from "morgan";

// import rutas
import productsRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, 'public')));

// middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// rutas
app.use('/api/products', productsRoutes);
app.use('/api/signin', authRoutes);

export default app;