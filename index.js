import  { bikesArray }  from "./data.js";


let orderedItems  = []
let totalStars = 0;
let totalRatings = 0;
let rate = 0.01.toFixed(1)
let starMessage = ['Your', 'order', 'is','on','it\'s', 'way!']

render()
//payment
document.addEventListener("submit", function(e){
    const successMessageEl = document.getElementById('success')
    if(e.target.id === 'submit-payment'){
        e.preventDefault()
        const paymentData = new FormData(document.getElementById('submit-payment'))
        const fullName = paymentData.get('fullName')
        setTimeout(function(){
            orderedItems = []
            toggleModal()
            render()
            successMessageEl.innerHTML = `<p>Thanks ${fullName}! <br>${[...starMessage].join(' ')}</p>`
        }, 1500)
        setTimeout(function(){
            successMessageEl.textContent = ``
        }, 5000)
    }
})

document.addEventListener('click', function(e){
    if(e.target.dataset.addItem){
        addItems(e.target.dataset.addItem)
    } else if(e.target.dataset.remove){
        removeItems(e.target.dataset)
    } else if(e.target.id === 'modal-outer'){
        toggleModal()
    } else if(e.target.id === 'complete-order'){
        toggleModal()
    } else if(e.target.dataset.modalStar){
         sendAndCalculateRate(e.target.dataset.modalStar)
    } else if(e.target.id === 'rate-modal-outer'){
        toggleRateModal()
    }
})

function sendAndCalculateRate(id){
    toggleRateMessage()
    setTimeout(toggleRateModal,1000)  
    totalStars += parseInt(id)
    totalRatings++
    rate = ((totalStars / (totalRatings * 5))*5).toFixed(1) 
    
    document.getElementById('rate-num-modal').innerHTML = `${rate} out of 5`
    document.getElementById('rate-num').innerHTML = `${rate}`
    document.getElementById('stars').innerHTML = renderSmallStars()
    document.getElementById('ratings').innerHTML = `${totalRatings} ratings`
}

document.addEventListener('mouseover', function(e){
    if(e.target.dataset.star){
        toggleRateModal()
    }
})

function addItems(itemId){
    let itemToAdd = bikesArray.filter(item=>item.id == itemId)
    orderedItems.push(itemToAdd[0])
    render()
}

function removeItems(itemId) {
    let index = orderedItems.findIndex(item => item.id === itemId)
    orderedItems.splice(index, 1)
    render()
}

function toggleModal(){
    document.getElementById('modal-outer').classList.toggle('hidden')
}

function toggleRateModal(){
    document.getElementById('rate-modal-outer').classList.toggle('hidden')
}
function toggleRateMessage(){
    document.getElementById('rate-message').innerHTML = `Your rating is sending...`
    setTimeout(() => {
        document.getElementById('rate-message').innerHTML = `Please rate our app`
    }, 1000);
}

function renderSmallStars(){
    let starsHtml = ``
    for (let i = 1; i < 6; i++) {
        if(rate - i >= 0){
            starsHtml += `<i class="fa-solid fa-star" data-star="${i}"></i>`
        } else if(rate - i < 0 && rate - i >= -1 ){
            starsHtml += `<i class="fa-regular fa-star-half-stroke" data-star="${i}"></i>`
        } else {
            starsHtml += `<i class="fa-regular fa-star" data-star="${i}"></i>`
        }
    }
    return starsHtml
}



function userExperienceRate(){
    let starsHtml = renderSmallStars()
    return `
        <div class="rate" id="rate">
            <p class="rate-num" id="rate-num">${rate}</p>

            <div class="stars" id="stars">` + starsHtml + `</div>
        
            <p class="ratings" id="ratings">${totalRatings} ratings</p>


            
        </div>
        <div class="rate-modal-outer hidden" id="rate-modal-outer">
        
            <div class="rate-modal" id=""rate-modal">
                <h3 id="rate-num-modal">${rate} out of 5</h3>
                <div class="rating-stars">
                    <span class="star" data-modal-star="1">&#9733;</span>
                    <span class="star" data-modal-star="2">&#9733;</span>
                    <span class="star" data-modal-star="3">&#9733;</span>
                    <span class="star" data-modal-star="4">&#9733;</span>
                    <span class="star" data-modal-star="5">&#9733;</span>
                </div>
                <h4 id="rate-message">Please rate our app</h4>
            </div>

        </div>
           `
}

function getBikesHtml() {

    return  bikesArray.map(function(bike){
    const { name, spec, id, price,  image } = bike

        return `
        <section class="card">
            <img src="images/${image}" alt="${name}-photo" class="bike-photo">
            <div class="card-center">
                <h2>${name}</h2>

                <p class="spec">${spec}</p>

                <h3>$${price}</h3>
            </div>
            <div class="card-right">
                <i class="fa-regular fa-plus" data-add-item="${id}"></i>
            </div>
        </section>
        `
    }).join('')    // join("") removes separators
}


function getYourOrder(items=orderedItems) {
    const orderPrice = items.reduce(function(total, item){
        let totalPrice = total + item.price
        if(totalPrice > 1000) {totalPrice = totalPrice * 0.95}
        return Math.floor(totalPrice)
    }, 0)

    const orderItemsEl = items.map(function(item){
        return`
            <div class="item">
                <p class="item-name">${item.name}:    <span data-remove="${item.id}">   remove</span></p>
                <p class="item-price">$${item.price}</p>
            </div>
        `
    }).join('')
    const toggle = orderedItems.length > 0 ? "" : "hidden"
    const toggleDiscount = orderPrice > 1000 ? "" : "hidden";
    return `
        <footer class="${toggle}">
            <h2>Your order</h2>
            <div class="my-items" id="my-items">
            ${orderItemsEl}
            </div>
            <div class="discount ${toggleDiscount}">
                <p>Deal! Discount 5% for orders more than $1000</p>
                <p>$${Math.floor(orderPrice*0.05)}</p>
            </div>
            <div class="total-price">
                <p class="item-name">Total price: </p>
                <p class="item-price">$${orderPrice}</p>
            </div>
            
            <button type="button"  id="complete-order">Complete order</button>
        </footer>`
}
function getModalHtml () {
    return `
            <form class="modal" id="submit-payment">
                <p>Enter card details</p>

                <input type="text" name="fullName" placeholder="Enter your name" area-label="Full name" required>

                <input type="text" name= "cardNumber" placeholder="Enter card number" area-label="Enter card number" required>

                <input type="text" name="cvv" placeholder="Enter CVV" area-label="Enter CVV" required>

                <button class="pay" type="submit">Pay</button>

            </form>
    `
}




function render() {
    const bikesAndOrder = getBikesHtml() + userExperienceRate() + getYourOrder()

    document.getElementById('bikes').innerHTML = bikesAndOrder
    document.getElementById('modal-outer').innerHTML = getModalHtml();
}
