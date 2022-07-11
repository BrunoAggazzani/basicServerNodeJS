import express from "express";
import path from 'path';
import morgan from "morgan";
import cors from 'cors';
import i18n from './i18n';
import helmet from "helmet";
import compression from "compression";
// import rutas
import abmenuRoutes from './routes/abmenu.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, 'public')));

// middlewares
app.use(express.json({limit: "100mb"}));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: '*'}));
app.use(i18n);
// middleware de seguridad
app.use(helmet());
// middleware de compresion http
app.use(compression());

// rutas principales
app.use('', authRoutes);
app.use('/api/signin', authRoutes);
app.use('/api/abmenu', abmenuRoutes);


export default app;