const gameContainer = document.querySelector("#game-container");
const playerPointsh3 = document.querySelector("#player-points");
const resultText = document.querySelector("#result-text");
const gamerName = document.querySelector("input");
const startBtn = document.querySelector("#start-btn");


let playerPoints = 0;
let computerPoints = 0;
const array = ["sten", "sax", "påse"];

const baseUrl = "https://js2-miniprojekt1-3cfcc-default-rtdb.europe-west1.firebasedatabase.app/";
getAll();

document.querySelector("#game-container").style.display = "none";
document.querySelector("#computer-wins").style.display = "none";

startBtn.addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector("#game-container").style.display = "block";
    let playerText = document.querySelector("#player-text");
    let computerText = document.querySelector("#computer-text");



    gameContainer.addEventListener("click", function (event) {
        let randomNumber = Math.floor(Math.random() * array.length);
        const userChoice = event.target.id;
        const computerChoice = array[randomNumber];

        if (event.target.tagName === "BUTTON") {
            playerText.innerText = gamerName.value + ":" + userChoice;
            computerText.innerText = "Dator val: " + computerChoice;
            if (
                (userChoice == "sten" && computerChoice == "sax") ||
                (userChoice == "sax" && computerChoice == "påse") ||
                (userChoice == "påse" && computerChoice == "sten")
            ) {
                playerPoints++;
                resultText.innerText = "Du fick poäng!";
            } else if (
                (computerChoice == "påse" && userChoice == "sten") ||
                (computerChoice == "sten" && userChoice == "sax") ||
                (computerChoice == "sax" && userChoice == "påse")
            ) {
                computerPoints++;

                resultText.innerText = "Datorn vann, spelet är över!";
            } else if (userChoice == computerChoice) {
                resultText.innerText = "Ingen fick poäng!";
            }
        }

        playerPointsh3.innerText = "Din poäng är: " + playerPoints;

        if (computerPoints == 1) {
            document.querySelector("#computer-wins").style.display = "block";
            document.querySelector("#computer-wins").innerText =
                "Du fick!! " + playerPoints;
            vinare();
            getScore();
        }
    });
});


function vinare() {
    computerPoints = 0;
    const btns = document.querySelectorAll(".g-btns");
    for (let i = 0; i < btns.length; i++) {
        btns[i].style.display = "none";
    }
    const restartBtn = document.createElement("button");
    gameContainer.appendChild(restartBtn);
    restartBtn.innerText = "Spelaigen!!";
    restartBtn.addEventListener("click", function () {
        location.reload();
    });
}




//firebase/highscore
function getScore() {
    const newScore = {
        name: gamerName.value,
        score: playerPoints,
    };
    compareScore(newScore);
}

async function compareScore(userScore) {
    const url = baseUrl + "/4.json";

    const response = await fetch(url);
    const data = await response.json();

    if (userScore.score <= data.score) {
        console.log("did not make the scoreboard");
    } else {
        console.log("points added to database and scoreboard");
        putScore(userScore).then(getAll);
    }
}
async function putScore(obj) {
    const url = baseUrl + "/4.json";
    const init = {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    };

    const response = await fetch(url, init);
    const data = await response.json();
}

//Största värde ligger längst upp!
async function getAll() {
    const url = baseUrl + ".json";

    const response = await fetch(url);
    const data = await response.json();

    const sortData = data.sort(function (a, b) {
        return b.score - a.score;
    });
    putSortedData(sortData);
}

async function putSortedData(obj) {
    const url = baseUrl + ".json";

    const init = {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    };

    const response = await fetch(url, init);
    const data = await response.json();

    showScoreboard(data);
}

function showScoreboard(info) {
    const infoCard = document.querySelector("#scoreboard");
    infoCard.innerText = "";
    const scoreBoard = document.createElement("ol");
    scoreBoard.classList.add("scoreboard-header");
    infoCard.append(scoreBoard);
    scoreBoard.innerText = "Resultattavlan!";
    let counter = 0;

    info.forEach((element) => {
        counter++;
        const { name, score } = element;

        const h1 = document.createElement("p");
        h1.innerText = counter + ". " + name;
        h1.classList.add("gamername");

        const h2 = document.createElement("p");
        h2.innerText = score;

        infoCard.append(h1, h2);
        
    });
}