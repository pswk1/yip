//5b9c13f9e30c6d6bcd91ac54f9a8bf91
let categories = [["Delivery", 1], ["Dine-out", 2], ["Nightlife", 3], ["Carching-up", 4], ["Takeaway", 5], ["Cafes", 6], ["Daily Menus", 7], ["Breakfast", 8], ["Lunch", 9], ["Dinner", 10], ["Pubs & Bars", 11], ["Pocket Friendly Delivery", 13], ["Clubs & Lounges", 14]];
// let city = "Turlock";
// let userCuisine = "Burger";
// let cityId;
// let cuisineCheck = false;
// let establishmentCheck = false;





//Initial query, gets id of city from Zomato
// $('#someButton').on("click", function() {

let userCategories = "";
let categoriesId = "";
let city = "Los Angeles";
let cityId = "";
let userCuisine = "Italian";
let cuisineId = "";
let establishment = "";
let establishmentId = "";

let cuisineArr = [];
let establishmentArr = [];



$.ajax({
    url: `https://developers.zomato.com/api/v2.1/cities?q=${city}`,
    method: "GET",
    headers: {
        "user-key" : "5b9c13f9e30c6d6bcd91ac54f9a8bf91"
    }
}).then(function(response) {
    //Stores City id
    cityId = response.location_suggestions[0].id;
    $.ajax({
        url: `https://developers.zomato.com/api/v2.1/establishments?city_id=${cityId}`,
        method: "GET",
        headers: {
            "user-key" : "5b9c13f9e30c6d6bcd91ac54f9a8bf91"
        }
    }).then(function(response) {
        establishmentArr = makeEstablishmentArray(response);
    })
    //This one funcions to find the cuisine id
    $.ajax({
        url: `https://developers.zomato.com/api/v2.1/cuisines?city_id=${cityId}`,
        method: "GET",
        headers: {
            "user-key" : "5b9c13f9e30c6d6bcd91ac54f9a8bf91"
        }
    }).then(function(response) {
        cuisineId = findCuisineId(response, userCuisine);
        cuisineArr = makeCuisineArray(response);
        //Returns results for city and cuisine search
    })
})

// })




$('#finalSearch').on('click', function() {
    
    let queryURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city`;
    if(userCategories !== "") {
        categotiesId = getIdFromArr(categories, userCategories);
        queryURL += `&category=${categoriesId}`;
    }
    if(userCuisine !== "") {
        cuisineId = getIdFromArr(cuisineArr, userCuisine);
        queryURL += `&cuisines=${cuisineId}`;
    }
    if(establishment !== "") {
        establishmentId = getIdFromArr(establishmentArr, establishment);
        queryURL += `&establishment_type=${establishmentId}`;
    }
    
        $.ajax({
            url: queryURL,
            method: "GET",
            headers: {
                "user-key" : "5b9c13f9e30c6d6bcd91ac54f9a8bf91"
            }
        }).then(function(response) {
            for (let i = 0; i < 6; i++) {
                console.log(response);
                printInformation(response, i);
            }
        })
})

function getIdFromArr(Arr, choice) {
    for(let i = 0; i < Arr.length; i++) {
        if (Arr[i].includes(choice)) {
            return Arr[i][1];
        }
    }
}



function makeEstablishmentArray (Obj) {
    let retArr = [];

    for (let i=0; i<Obj.establishments.length; i++) {
        retArr.push([Obj.establishments[i].establishment.name, Obj.establishments[i].establishment.id]);
    }
    return retArr;
}

function makeCuisineArray (Obj) {
    let retArr = [];

    for (let i=0; i<Obj.cuisines.length; i++) {
        retArr.push([Obj.cuisines[i].cuisine.cuisine_name, Obj.cuisines[i].cuisine.cuisine_id]);
    }
    return retArr;
}

function findCuisineId(Obj, request) {
    let cuisine = Obj.cuisines;
    for (let i = 0; i < cuisine.length; i++) {
        if (cuisine[i].cuisine.cuisine_name === request) {
            return cuisine[i].cuisine.cuisine_id;
        }
    }
    return "";
}

function populateDropdown(Arr, target) {
    let currentOption;

    for (let i = 0; i < Arr.length; i++) {
        currentOption = $(`<option value="${Arr[i][0]}">`)
        target.append(currentOption);
    }
}

function printInformation(Obj, index) {
    let restaurant = Obj.restaurants[index].restaurant;
    let name = restaurant.name;
    let address = restaurant.location.address;
    let menuLink = restaurant.menu_url;
    let phoneNumber = restaurant.phone_numbers;
    $('#list').append($(`
        <p>Name: ${name}</p>
        <p>Address: ${address}</p>
        <p>Phone Number: ${phoneNumber}</p>
        <a href="${menuLink}">Menu</a>
        <hr>
    `))
}

