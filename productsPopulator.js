import FormData from 'form-data'
import fsSync from 'fs'
import path from 'path'
import axios from 'axios'
import products from './products'
import authToken from './token'

const uploadToServer = true

const productsPath = uploadToServer ? 'https://site202129.tw.cs.unibo.it/api/articles/' : 'http://localhost:8000/api/articles/'

for(const product of products){
    const urlImage = product.img
    delete product.img
    let toSend = new FormData()
    for ( var key in product ) {
        toSend.append(key, product[key]);
    }
    if(urlImage !== '')
        toSend.append('img', fsSync.readFileSync(urlImage), path.basename(urlImage))
    axios.post(productsPath, toSend, { headers: { ...toSend.getHeaders(), 'authority': JSON.stringify(authToken)}})
    .then(res => console.log(res.data))
    .catch(err => console.log(err.data))
}