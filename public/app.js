const tg = window.Telegram.WebApp;

tg.expand();

const user = tg.initDataUnsafe?.user;

let telegram_id = 1;
let username = "guest";

if(user){
    telegram_id = user.id;
    username = user.username || user.first_name;
}

document.getElementById("user")
.innerHTML = "👤 " + username;

async function login(){

    const req = await fetch("/login", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            telegram_id,
            username
        })
    });

    const data = await req.json();

    updateUI(data);

    loadLeaderboard();
}

function updateUI(data){

    document.getElementById("balance")
    .innerHTML = data.balance;

    document.getElementById("level")
    .innerHTML = data.level;

    document.getElementById("power")
    .innerHTML = data.power;
}

async function mine(){

    const btn = document.getElementById("mineBtn");

    btn.disabled = true;

    btn.innerHTML = "⛏ Mining...";

    const req = await fetch("/mine", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            telegram_id
        })
    });

    const data = await req.json();

    updateUI(data);

    loadLeaderboard();

    setTimeout(() => {

        btn.disabled = false;

        btn.innerHTML = "⛏ START MINING";

    }, 300);
}

async function loadLeaderboard(){

    const req = await fetch("/leaderboard");

    const data = await req.json();

    const leaders = document.getElementById("leaders");

    leaders.innerHTML = "";

    data.forEach((user, index) => {

        leaders.innerHTML += `

        <div class="userRow">
            <span>#${index+1} ${user.username}</span>
            <span>${user.balance}</span>
        </div>

        `;
    });
}

login();
