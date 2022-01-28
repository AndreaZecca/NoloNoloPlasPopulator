import axios from 'axios'
import authToken from './token'

const uploadToServer = true
const userPath = uploadToServer ? 'https://site202129.tw.cs.unibo.it/api/users/' : 'http://localhost:8000/api/users/'
const staffPath = uploadToServer ? 'https://site202129.tw.cs.unibo.it/api/staff/' : 'http://localhost:8000/api/staff/'
const articlesPath = uploadToServer ? 'https://site202129.tw.cs.unibo.it/api/articles/' : 'http://localhost:8000/api/articles/'
const rentalPath = uploadToServer ? 'https://site202129.tw.cs.unibo.it/api/rentals/' : 'http://localhost:8000/api/rentals/'

const STARTING_DATE = new Date("2018-01-01");
const ENDING_DATE = Date.now() - (1000*60*60*24*40)
const stateRental = 'ended'

// const STARTING_DATE=  Date.now() + (1000*60*60*24*10)
// const ENDING_DATE = Date.now() + (1000*60*60*24*40)
// const stateRental = 'pending'


// const STARTING_DATE = new Date(new Date().toISOString().split('T')[0]);
// const ENDING_DATE = Date.now() + (1000*60*60*24*1)
// const stateRental = 'approved'

let usersId = []
let staffsId = []
let productsId = []


function random(min, max) { return Math.floor(Math.random() * (max - min + 1) + min) }

function randomUser() { return usersId[random(0,usersId.length-1)] }

function randomFunctionary() { return staffsId[random(0,staffsId.length-1)] }

function randomProduct() { return productsId[random(0,productsId.length-1)] }

function randomDate(start =  STARTING_DATE, end = ENDING_DATE, startHour = 0, endHour = 0) {
    var date = new Date(+start + Math.random() * (end - start));
    var hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    return date.toISOString().split('T')[0];
}

function afterNDays(startingDate, days) {
    return new Date(Date.parse(startingDate) + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

(async function start(){
    await fetchUserId()
    await fetchStaffId()
    await fetchProductId()
    await generateRentals()
})()

async function fetchUserId(){
    const response = (await axios.get(userPath, { headers: {'authority': JSON.stringify(authToken)}})).data
    for(const user of response) usersId.push(user._id)
}

async function fetchStaffId(){
    const response = (await axios.get(staffPath, { headers: {'authority': JSON.stringify(authToken)}})).data
    for(const staff of response) staffsId.push(staff._id)
}

async function fetchProductId(){
    const response = (await axios.get(articlesPath, { headers: {'authority': JSON.stringify(authToken)}})).data
    for(const article of response) productsId.push(article._id)
}

async function generateRentals(){
    let max = 7
    const maxDays = 13
    while(max > 0){
        const userId = randomUser()
        const functionaryId = randomFunctionary()
        const productId = randomProduct()
        const start_date = randomDate()
        const end_date = afterNDays(start_date, random(1, maxDays))
        const path = articlesPath+productId+`/available?start=${start_date}&end=${end_date}`

        const availability = (await axios.get(path, { headers: {'authority': JSON.stringify(authToken)}})).data
        console.log(availability)

        if(availability.available){
            await createRental(userId, functionaryId, productId, start_date, end_date)
        }
        max--
    }
}

async function createRental(userId, functionaryId, object_id, date_start, date_end){
    const rental = {userId, functionaryId, object_id, date_start, date_end, 'state': stateRental}
    axios.post(rentalPath, rental, { headers: {'authority': JSON.stringify(authToken)}})
    .then(res => console.log(res.data))
    .catch(err => console.log(err))
}
