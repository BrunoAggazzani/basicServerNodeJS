import express from "express";
import path from 'path';
import morgan from "morgan";
import cors from 'cors';
import i18n from './i18n';
import helmet from "helmet";
import compression from "compression";
// import rutas
import menuRoutes from './routes/menu.routes';
import loginRoutes from './routes/login.routes';
//import menuPriceRoutes from './routes/menu.prices.routes';
import menuAbmRoutes from './routes/menu.abm.routes';
import menuReportRoutes from './routes/menu.reports.routes';
import menuSettingRoutes from './routes/menu.settings.routes';

const app = express();

// motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(__dirname+'/public'));

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
app.use('', loginRoutes);
app.use('/api/signin', loginRoutes);
app.use('/api/menu', menuRoutes);
//app.use('/api/menu/prices', menuPriceRoutes);
app.use('/api/menu/abm', menuAbmRoutes);
app.use('/api/menu/reports', menuReportRoutes);
app.use('/api/menu/settings', menuSettingRoutes);


export default app;