const infoBox = document.querySelector(".main-item-2")
infoBox.classList.toggle("hidden");

const getJSONData = async () => {
  
  jsonFull = {
    "dictionary": [
      {
        "word": "Arya",
        "hint": "Game of Thrones character."
      },
      {
        "word": "Gojo",
        "hint": "Jujutsu Kaisen character."
      },
      {
        "word": "Eren",
        "hint": "Attack on Titan character."
      },
      {
        "word": "Link",
        "hint": "Zelda character."
      },
      {
        "word": "Saul",
        "hint": "Better Call Saul character."
      },
    ]
  }

  const jsonDict = jsonFull.dictionary;
  return jsonDict;
}

getJSONData().then((wordsDict) => {

  const wordDict = wordsDict

    const startButton = document.getElementById("start-button")
    startButton.innerHTML = "Start over (or refresh the page)";
    startButton.style.backgroundColor = "darkgreen";
    startButton.style.borderColor = "darkgreen";
    startButton.addEventListener("click", function()
    {
      clearGrid()
      const hintButton = document.getElementById("hint-button")
      hintButton.disabled = false;
      wordle(wordDict)
    }
    );

  nightModeButton()

  infoButton()

  wordle(wordDict)
  
});

function wordle(dict) {

  const randomIndex = Math.floor(Math.random() * dict.length);
  const target = dict[randomIndex];
  const targetWord = target.word;
  const hint = target.hint;

  console.log(targetWord)

  const lowerTargetWord = targetWord.toLowerCase()

  const grid = document.querySelector('.grid')

  hintButton(hint)
  
  startWordle()
  
  function startWordle() {
    document.addEventListener("keyup", keyPress);
  }

  function stopWordle() {
    document.removeEventListener("keyup", keyPress);
  }

  function keyPress(e) {

    if (e.key === "Enter" || e.key === "Return") {
      submitWord()
      return
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      deleteLetter()
      return
    }

    if (e.key.match(/^[a-z]$/)) {
      pressedLetterKey(e.key)
      return
    }

  }

  function deleteLetter() {
    const activeTiles = getActiveTiles()
    const lastActiveTile = activeTiles[activeTiles.length - 1]
    if (lastActiveTile == null) return
    lastActiveTile.textContent = ""
    delete lastActiveTile.dataset.state
    delete lastActiveTile.dataset.letter
  }

  function submitWord() {
    const activeTiles = [...getActiveTiles()]

    if (activeTiles.length !== 4) {
      window.alert("You must complete the word first.")
      return
    }

    const guessedWord = activeTiles.reduce((guess, tile) => {
      return guess + tile.dataset.letter
    }, "")

    stopWordle()

    activeTiles.forEach((...params) => submitTile(...params, guessedWord))

    startWordle()
    checkWinLose(guessedWord)

  }

  function submitTile(tile, tileIndex, tileArray, guess) {

    const letter = tile.dataset.letter
    if (lowerTargetWord[tileIndex] === letter) {
      tile.dataset.state = "right"
    }
    else if (lowerTargetWord.includes(letter)) {
      tile.dataset.state = "wrong-pos"
    }
    else {
      tile.dataset.state = "wrong"
    }

  }

  function checkWinLose(guess) {

    if (guess === lowerTargetWord) {
      if (document.getElementById("hint-message")) {
        var hintElement = document.getElementById("hint-message")
        hintElement.remove()
      }
      var winMessage = "You guessed the word " + targetWord + " correctly!";
      var winElement = document.createElement("div")
      winElement.id = "win-message"
      winElement.textContent = winMessage
      winElement.style.backgroundColor = "lightgreen"
      winElement.style.color = "black"
      winElement.style.fontSize = "200%"
      winElement.style.width = "100%";
      winElement.style.height = "150%";
      winElement.style.textAlign = "center";
      winElement.style.padding = "20px";
      var messageElement = document.querySelector(".message")
      messageElement.appendChild(winElement)
      var wordleGrid = document.querySelector(".wordle")
      wordleGrid.innerHTML = '<img src="https://res.cloudinary.com/mkf/image/upload/v1675467141/ENSF-381/labs/congrats_fkscna.gif" alt="Congratulations!">'
      wordleGrid.style.textAlign = "center";
      const parentElement = document.querySelector(".message");
      const childElements = parentElement.querySelectorAll(":not(:first-child)");
      childElements.forEach(childElement => childElement.remove());
      stopWordle()
      return
    }

    const remainingTiles = grid.querySelectorAll(":not([data-letter])")
    if (remainingTiles.length === 0) {
      if (document.getElementById("hint-message")) {
        var hintElement = document.getElementById("hint-message")
        hintElement.remove()
      }
      var loseMessage = "You missed the word " + targetWord + " and lost!";
      var loseElement = document.createElement("div")
      loseElement.id = "lose-message"
      loseElement.textContent = loseMessage
      loseElement.style.backgroundColor = "red"
      loseElement.style.color = "black"
      loseElement.style.fontSize = "200%"
      loseElement.style.width = "100%";
      loseElement.style.height = "150%";
      loseElement.style.textAlign = "center";
      loseElement.style.padding = "20px";
      var messageElement = document.querySelector(".message")
      messageElement.appendChild(loseElement)
       const parentElement = document.querySelector(".message");
       const childElements = parentElement.querySelectorAll(":not(:first-child)");
       childElements.forEach(childElement => childElement.remove());
      stopWordle()
      return
    }

    return

  }

  function pressedLetterKey(letter) {
    const activeTiles = getActiveTiles()
    if (activeTiles.length >= 4) return
    const nextTile = grid.querySelector(":not([data-letter])")
    nextTile.dataset.letter = letter.toLowerCase()
    nextTile.textContent = letter
    nextTile.dataset.state = "active"
  }

  function getActiveTiles() {
    return grid.querySelectorAll('[data-state="active"]')
  }

}

function clearGrid() {
  var wordle = document.querySelector(".wordle")
  wordle.innerHTML = "";
  const grid = document.createElement('div');
  grid.classList.add('grid');
  for (let i = 0; i < 16; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    grid.appendChild(tile);
  }
  wordle.append(grid)
  var message = document.querySelector(".message")
  message.innerHTML = ""
}

function nightModeButton() {
  const darkModeButton = document.getElementById("dark-mode-button");
  darkModeButton.innerHTML = "&#9680;";
  darkModeButton.addEventListener("click", function()
  {
    document.body.classList.toggle("dark-mode");
  }
  );
}

function infoButton() {
  const infoButton = document.getElementById("info-button")
  const infoBox = document.querySelector(".main-item-2")
  infoButton.innerHTML = "&#9432;"
  infoButton.addEventListener("click", function()
  {
    infoBox.classList.toggle("hidden");
  }
  );
}

function hintButton(hint) {
  if (document.getElementById("hint-message")) {
    var hintElement = document.getElementById("hint-message")
    hintElement.remove()
  }

  const hintButton = document.getElementById("hint-button")
  hintButton.innerHTML = "&#63;"
  hintButton.addEventListener("click", function()
  {

    var hintElement = document.createElement("div")
    hintElement.id = "hint-message"
    hintElement.innerHTML = "<i>Hint:</i> " + hint + ".";
    hintElement.style.backgroundColor = "beige"
    hintElement.style.color = "black"
    hintElement.style.fontSize = "200%"
    hintElement.style.width = "100%";
    hintElement.style.height = "150%";
    hintElement.style.textAlign = "center";
    hintElement.style.padding = "20px";
    var messageElement = document.querySelector(".message")
    messageElement.appendChild(hintElement)
    hintButton.disabled = true;
    const hintMessages = document.querySelectorAll(".message > #hint-message");
    for (let i = 0; i < hintMessages.length - 1; i++) {
      hintMessages[i].remove();
    }
  }
  );
}

