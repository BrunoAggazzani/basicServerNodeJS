//import {pool} from '../DB/connect';
//import CryptoJS from 'crypto-js';

export const getReports = (req, res)=>{
    res.status(200).render('Reports/reports.ejs');
};