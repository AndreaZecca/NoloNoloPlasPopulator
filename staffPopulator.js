import FormData from 'form-data'
import fsSync from 'fs'
import path from 'path'
import axios from 'axios';
import staffs from './employees'
import authToken from './token'

const uploadToServer = false

const staffPath = uploadToServer ? 'https://site202129.tw.cs.unibo.it/api/staff/' : 'http://localhost:8000/api/staff/'

for(const staff of staffs){
    const urlImage = staff.avatar
    delete staff.avatar
    let toSend = new FormData()
    for ( var key in staff ) {
        toSend.append(key, staff[key]);
    }
    if(urlImage !== '')
        toSend.append('avatar', fsSync.readFileSync(urlImage), path.basename(urlImage))
    axios.post(staffPath, toSend, { headers: { ...toSend.getHeaders(), 'authority': JSON.stringify(authToken)}})
    .then(res => console.log(res.data))
    .catch(err => console.log(err.data))
}