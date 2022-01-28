import FormData from 'form-data'
import fsSync from 'fs'
import path from 'path'
import axios from 'axios'
import users from './users'

const uploadToServer = false

const customerPath = uploadToServer ? 'https://site202129.tw.cs.unibo.it/api/users/' : 'http://localhost:8000/api/users/'

console.log(customerPath)

for(const user of users){
    const urlImage = user.avatar
    delete user.avatar
    let toSend = new FormData()
    for ( var key in user ) {
        toSend.append(key, user[key]);
    }
    if(urlImage !== '')
        toSend.append('avatar', fsSync.readFileSync(urlImage), path.basename(urlImage))
    axios.post(customerPath, toSend, { headers: toSend.getHeaders()})
    .then(res => console.log(res.data))
    .catch(err => console.log(err.data))
}