const quotes = [
    'Everything I know I learned from dogs',
    'Dogs do speak, but only to those who know how to listen',
    'Dogs lives are too short',
    'Every dog must have his day',
    'As wonderful as dogs can be, they are famous for missing the point',
];

const quote = document.getElementById('quote');
const input = document.getElementById('typed-value');
const start = document.getElementById('start');
const message = document.getElementById('message');
const gamername = document.getElementById('gamer-name');
const scores = getScores();
const scoresUnorderedList = document.getElementById("scores-unordered-list");

let wordQueue;
let highlightPosition;
let startTime;


function startGame(){
    console.log("Game started");
    const scoreItem = {
        name: gamername.value,
        milliseconds: 0
    };

    scores.push(scoreItem);

    document.body.className = "";
    start.className = "started";

    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quoteText = quotes[quoteIndex];

    // quoteText = "type me";
    wordQueue = quoteText.split(' ');
    quote.innerHTML = wordQueue.map(word => (`<span>${word}</span>`)).join('');

    highlightPosition = 0;
    quote.childNodes[highlightPosition].className = 'highlight';

    startTime = new Date().getTime();

    document.body.className = "";
    start.className = "started";
    setTimeout(() => {start.className = "button";}, 2000);
}
start.addEventListener('click', startGame);
input.addEventListener('input', checkInput);

function checkInput() {
    console.log("Checking", input.value);
    const currentWord = wordQueue[0].replaceAll(".", "").replaceAll(",", "");
    const typedValue = input.value.trim();

    if(currentWord !== typedValue){
        input.className = currentWord.startsWith(typedValue) ? "" : "error";
        return;
    }
    wordQueue.shift();
    input.value = "";

    quote.childNodes[highlightPosition].className = "";

    if(wordQueue.length === 0){
        gameOver();
        return;
    }
    highlightPosition++;
    quote.childNodes[highlightPosition].className = 'highlight';
}

function gameOver() {
    const elapsedTime = new Date().getTime() - startTime;
    document.body.className = "winner";
    message.innerHTML = `<span class="congrats">Congratulations!</span>
    <br>
    You finished in ${elapsedTime/1000} seconds`;

    const lastScoreItem = scores.pop();
    lastScoreItem.milliseconds = elapsedTime;
    scores.push(lastScoreItem);
    saveScores();

    //clear out the list
    while(scoresUnorderedList.firstChild){
        scoresUnorderedList.removeChild(scoresUnorderedList.firstChild);
    }

    for(let score of getScores()){
        const li = createElementForScore(score);
        scoresUnorderedList.appendChild(li);
    }
}

function getScores (){
    const noScoreFound = "[]";
    const scoresJSON = localStorage.getItem('scores') || noScoreFound;
    return JSON.parse(scoresJSON);
}

function saveScores(){
    const data = JSON.stringify(scores);
    localStorage.setItem('scores', data);
}

function createElementForScore(score) {
    const template = document.getElementById("score-item-template");
    const newListItem = template.content.cloneNode(true);

    const text = newListItem.querySelector(".score-text");
    text.innerText = score.name + "in" + score.milliseconds/1000 + "seconds.";
    return newListItem;
}

function removeSpecialChars(str) {
    return str.replace(/(?!\w|\s)./g, '')
      .replace(/\s+/g, ' ')
      .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
  }