const canvas = document.querySelector('#game')
const container = document.querySelector('.game-container')
const message = document.querySelector('#messages')
const spanLives = document.querySelector('#lives')
const spanTime = document.querySelector('#time')
const spanRecord = document.querySelector('#record')
const startBtn = document.querySelector('#start')
const restartBtn = document.querySelector('#restart')
const overlay = document.querySelector('.overlay')

const btnUp = document.querySelector("#up")
const btnLeft = document.querySelector("#left")
const btnRight = document.querySelector("#right")
const btnDown = document.querySelector("#down")
window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener("click", moveUp)
btnLeft.addEventListener("click", moveLeft)
btnRight.addEventListener("click", moveRight)
btnDown.addEventListener("click", moveDown)

startBtn.addEventListener("click", start)

const game = canvas.getContext('2d')

const canvasLimit = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0
}

let canvasSize
let elementsSize

const playerPosition = {
  x: undefined,
  y: undefined
}

const giftPosition = {
  x: undefined,
  y: undefined
}

let bombPositions = []
let level = 0
let lives = 3
let timeStart
let timeInterval
let dificultyBg = ['normal', 'hard', 'final']


function start(){
  overlay.classList.add("hide")
  startGame()
}

//set canvas size on load/resize
window.addEventListener('load', setCanvasSize)
window.addEventListener('resize', setCanvasSize)

function setCanvasSize(){
 if(window.innerHeight > window.innerWidth){
    canvasSize = window.innerWidth *.6
  } else{ 
    canvasSize = window.innerHeight *.6
  }

  canvas.setAttribute('width', canvasSize)
  canvas.setAttribute('height', canvasSize)

  elementsSize = canvasSize / 10

  canvasLimit.left = elementsSize
  canvasLimit.top = elementsSize
  canvasLimit.right = elementsSize * 10
  canvasLimit.bottom = elementsSize * 10

  playerPosition.x = undefined
  playerPosition.y = undefined

  //startGame()
}

function gameWin(){
  console.log("You Won")
  //cleanCanvas()
  clearInterval(timeInterval)
  const FinalTime = spanTime.textContent
  message.innerHTML= `You won! your time was: ${FinalTime}`

  const recordTime = localStorage.getItem('record_time')
  const playerTime = Date.now() - timeStart

  if(recordTime){
    if (recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime)
      message.innerHTML = "New Record 🤩 Play again?"
    } else {
      message.innerHTML= "You didn't beat the record 🤔 Try again!"
    }
  } else{
    localStorage.setItem('record_time', playerTime)
    message.innerHTML= "You made a decent time 🧐 Play again to beat it"
  }

  console.log({recordTime, playerTime});
}

function levelWin(){
  console.log("Next Level =)");
  level++
  startGame()
}


function levelFail(){
  if(lives>0){
    if (lives==1) {
      message.innerHTML= "It's your last live 😬 Play wisely"
    }
      playerPosition.x = undefined
      playerPosition.y = undefined
      startGame()
    
  } else if(lives==0){
    clearInterval(timeInterval)
    spanLives.innerHTML = ""
    message.innerHTML= "You lost all your lives 😖 Try again?"
    //startOver()
    startGame()
    playerPosition.x = undefined
    playerPosition.y = undefined
  }
}

function startOver(){
  playerPosition.x = undefined
  playerPosition.y = undefined
  giftPosition.x = undefined
  giftPosition.y = undefined
  lives = 3
  level = 0
  timeStart = Date.now()
  startGame()
}

function showLives(){
  let heartsArray = Array(lives).fill(emojis['HEART'])

  spanLives.innerHTML = ""
  heartsArray.forEach(heart=>{
    spanLives.append(heart)
  })
}

function showTime(){
  spanTime.innerHTML = Date.now() - timeStart
}

function showRecord(){
  spanRecord.innerHTML = localStorage.getItem('record_time')
}

function killTime(){

}

function cleanCanvas(){
    game.clearRect(0,0,canvasSize, canvasSize)
}

function startGame(){

  game.font = elementsSize*0.8 + 'px arial'
  game.textAlign = 'end'

  bgColor = dificultyBg.length - lives
  game.canvas.className = dificultyBg[bgColor]

  const map = maps[level]
  //console.log(map);

  if(!map){
    gameWin()
    return
  }

  if(!timeStart){
    timeStart = Date.now()
    timeInterval = setInterval(showTime, 100)
    showRecord()
  }

  showLives()

  //cleans first map (map[0]) and splits by \n
  const mapRows = map.trim().split('\n')

  //cleans every row of strings then converts strings to array with map()  
  const mapRowCols = mapRows.map(function(row){
    return row.trim().split('')
  })

  //cleans all canvas
  cleanCanvas()

  // cleans ememyPosition array
  bombPositions = []

  mapRowCols.forEach((row, rowIndex)=>{
    row.forEach((col, colIndex) =>{
  
      const emoji = emojis[col]
      const posX = elementsSize*(colIndex+1)
      const posY = elementsSize*(rowIndex+1)

      //renders emoji
      game.fillText(emoji, posX, posY)
      
      //final screen
      if (lives==0) {
        game.fillText('🔥', posX, posY)
        playerPosition.x = -100
        playerPosition.y = -100
        container.classList.add('finalMsg')
        return
      }

      if(col == 'O'){
        if(!playerPosition.x && !playerPosition.y){
          playerPosition.x = posX
          playerPosition.y = posY
        }
      } else if(col == 'I'){
        giftPosition.x = posX
        giftPosition.y = posY
      } else if(col == 'X'){
        bombPositions.push({x:posX, y:posY})
      }

    })
  })

  movePlayer()
  //console.log(canvasLimit);

}

function movePlayer(){
   //console.log(playerPosition);
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y)

    const giftCollisionX = playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2)
    const giftCollisionY = playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2)
    const isGiftCollision = giftCollisionX && giftCollisionY
    if(isGiftCollision){
      levelWin()
    }

    const bombCollision = bombPositions.find(bomb =>{
      const bombCollisionX = bomb.x.toFixed(2) == playerPosition.x.toFixed(2)
      const bombCollisionY = bomb.y.toFixed(2) == playerPosition.y.toFixed(2)
      return bombCollisionX && bombCollisionY
    })

    if(bombCollision){
      console.log('Colission =(');
      lives--
      levelFail()
    }

 
}

function moveByKeys(e){
  if(e.key == 'ArrowUp') moveUp()
  else if(e.key == 'ArrowRight') moveRight() 
  else if(e.key == 'ArrowDown') moveDown() 
  else if(e.key == 'ArrowLeft') moveLeft()
}

function moveUp(){
  if(playerPosition.y>canvasLimit.top){
    console.log("moving Up");
    playerPosition.y -= elementsSize
    startGame()
  }
}

function moveLeft(){
  if(playerPosition.x>canvasLimit.left){
    console.log("moving Left");
    playerPosition.x -= elementsSize
    startGame()
  }
}

function moveRight(){
  if(playerPosition.x<canvasLimit.right){
    console.log("moving Right");
    playerPosition.x += elementsSize
    startGame()
  }
}

function moveDown(){
  if(playerPosition.y<canvasLimit.bottom){
    console.log("moving Down");
    playerPosition.y += elementsSize
    startGame()
  }
}


restartBtn.addEventListener("click", function(){
  window.location.reload()
  start()
})
