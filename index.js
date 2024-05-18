import axios from 'axios';
import chalk from 'chalk';
import _ from 'lodash';
import express from 'express';
import moment from 'moment';
import { nanoid } from 'nanoid';
import { engine } from 'express-handlebars';
import path from 'path';
import Jimp from 'jimp';

const __dirname = import.meta.dirname;
const app = express()
app.use(express.static(path.join(__dirname, '/public')));

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,'./views'));


app.get('/', async(req, res) => {
    res.render('home')
});

app.get('/image', async(req, res) => {
    const url = req.query.imagen_url
    const image = await Jimp.read(url)
    const buffer = await image
        .resize(500, 350)
        .grayscale()
        .quality(60)
        .getBufferAsync(Jimp.MIME_JPEG)
    const dirname = __dirname + `/public/img/image-${nanoid()}.jpg`
    await image.writeAsync(dirname)
    res.set("Content-Type", "image/jpeg")
    return res.send(buffer)
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor se inicio en http://localhost:${PORT}`)
})