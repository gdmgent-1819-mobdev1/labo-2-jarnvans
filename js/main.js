let Profile = function(id, name, age, city, picture) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.city = city;
    this.picture = picture;
}


let teller = 0;
let profileEl = document.querySelector('.tinder');
let dislikesEl = document.querySelector('.dislikes');
let likesEl = document.querySelector('.likes');
let profilesEl = document.querySelector('.profiles');

//Grabbing data and putting profiles in local storage
function grabData() {
    fetch('https://randomuser.me/api/?results=10')
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            if (localStorage.getItem('profile0') != null && localStorage.getItem('profile9')){
                localStorage.setItem('profile0', localStorage.getItem('profile9'));
            }
            for(let i = 0; i < data.results.length; i++){
                let profile = new Profile(data.results[i].login.uuid, data.results[i].name.first, data.results[i].dob.age, data.results[i].location.city, data.results[i].picture.large);

                // console.log(profile);
                if(localStorage.getItem('profile' + i) != null) {
                    if (i == 0) {
                        i = 1;
                    }
                    localStorage.setItem('profile' + i, JSON.stringify(profile));
                }
                else {
                    localStorage.setItem('profile' + i, JSON.stringify(profile));
                }
            }
            runProfiles();
        })
}

//Show profile on screen and like or dislike
function runProfiles() {
    let likes = JSON.parse(localStorage.getItem('likes'));
    let dislikes = JSON.parse(localStorage.getItem('dislikes'));
    let profile = JSON.parse(localStorage.getItem('profile' + teller))
    let exists = false;
    let tempStr = '';
    
    if (likes != null || dislikes != null){
        exists = checkExists(likes, dislikes, profile);
    }

    if (teller <= 8) {
        if(exists == false){
            tempStr = `
                <div class="profile__picture">
                    <img src="${profile.picture}">
                </div>
                <div class="profile__info">
                    <h1 class="name">${makeFirstCapital(profile.name)}</h1>
                    <p class="age">${profile.age}</p>
                    <p class="city">${makeFirstCapital(profile.city)}</p>
                <div>
                <hr>
                <div class="choices">
                    <button class="choices__dislike"><i class="fas fa-times"></i></button>
                    <button class="choices__like"><i class="fas fa-heart"></i></button>
                </div>
            `
            profileEl.innerHTML = tempStr;

            let likeProfileEl = document.querySelector('.choices__like');
            let dislikeProfileEl = document.querySelector('.choices__dislike'); 
            
            likeProfileEl.addEventListener('click', function(){
                if (likes != null) {
                    likes.push(profile);
                    localStorage.setItem('likes', JSON.stringify(likes));
                    teller++;
                    runProfiles();
                }
                else {
                    likes = [];
                    likes.push(profile);
                    localStorage.setItem('likes', JSON.stringify(likes));
                    teller++;
                    runProfiles();
                }
            })

            dislikeProfileEl.addEventListener('click', function(){
                if (dislikes != null) {
                    dislikes.push(profile);
                    localStorage.setItem('dislikes', JSON.stringify(dislikes));
                    teller++;
                    runProfiles();
                }
                else {
                    dislikes = [];
                    dislikes.push(profile);
                    localStorage.setItem('dislikes', JSON.stringify(dislikes));
                    teller++;
                    runProfiles();
                }
            })
        }
        else {
            teller++;
            runProfiles();
        }
    }
    else {
        teller = 0;
        grabData();
    }
}

function checkExists(likes, dislikes, profile) {
    let exists = false;
    
    if (likes != null){
        for(let i = 0; i < likes.length; i++){
            if(profile.id == likes[i].id){
                exists = true;
                console.log('je hebt dit profiel al geliked')
            }
        }
    }
    if (dislikes != null){
        for(let i = 0; i < dislikes.length; i++){
            if(profile.id == dislikes[i].id){
                exists = true;
                console.log('je hebt dit profiel al gedisliked')
            }
        }
    }
    console.log(exists)
    return exists;
}

function makeFirstCapital(word) {
    let words = [];
    let capitalWord = '';
    words = word.split(" ");

    for(let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    capitalWord = words.join(' ');
    return capitalWord;
}

function listLikesDislikes(list){
    let tempStr = '';
    let listProfiles = JSON.parse(localStorage.getItem(list));
    if (listProfiles != null) {
        for(let i = 0; i < listProfiles.length; i++){
            tempStr += `
                <div class="profile">
                    <div class="profiles-list__picture">
                        <img src="${listProfiles[i].picture}">
                    </div>
                    <div class="profile__name">
                        <h1>${makeFirstCapital(listProfiles[i].name)}</h1>
                    </div>
                </div>
            `
        }
    }
    else {
        tempStr = `
            <div class="message">
                Geen profielen om weer te geven
            </div>
        `
    }

    profileEl.innerHTML = tempStr;
}

profilesEl.addEventListener('click', function(e){
    e.preventDefault();
    runProfiles();
})

dislikesEl.addEventListener('click', function(e){
    e.preventDefault();
    listLikesDislikes('dislikes');
})

likesEl.addEventListener('click', function(e){
    e.preventDefault();
    listLikesDislikes('likes');
})

window.onload = grabData();