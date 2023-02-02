const canvas = document.querySelector('#game')
const game = canvas.getContext('2d')

const btnUp = document.querySelector("#up")
const btnLeft = document.querySelector("#left")
const btnRight = document.querySelector("#right")
const btnDown = document.querySelector("#down")
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

window.addEventListener('load', setCanvasSize)
window.addEventListener('resize', setCanvasSize)

function setCanvasSize(){
 if(window.innerHeight > window.innerWidth){
    canvasSize = window.innerWidth *.8
  } else{ 
    canvasSize = window.innerHeight *.8
  }

  canvas.setAttribute('width', canvasSize)
  canvas.setAttribute('height', canvasSize)

  elementsSize = canvasSize / 10

  canvasLimit.left = elementsSize
  canvasLimit.top = elementsSize
  canvasLimit.right = elementsSize * 10
  canvasLimit.bottom = elementsSize * 10

  startGame()
}

function startGame(){

  game.font = elementsSize*0.8 + 'px arial'
  game.textAlign = 'end'

  //console.log(maps);

  //cleans first map (map[0]) and splits by \n
  const mapRows = maps[0].trim().split('\n')

  //cleans every row of strings then converts strings to array with map()  
  const mapRowCols = mapRows.map(function(row){
    return row.trim().split('')
  })

  //cleans all canvas
  game.clearRect(0,0,canvasSize, canvasSize)

  mapRowCols.forEach((row, rowIndex)=>{

    row.forEach((col, colIndex) =>{
  
      const emoji = emojis[col]
      const posX = elementsSize*(colIndex+1)
      const posY = elementsSize*(rowIndex+1)

      //renders emoji
      game.fillText(emoji, posX, posY)

      if(col == 'O'){
        if(!playerPosition.x && !playerPosition.y){
          playerPosition.x = posX
          playerPosition.y = posY
        }
      }
    })
  })

  movePlayer()
  console.log(canvasLimit);

}

function movePlayer(){
   console.log(playerPosition);
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y)
}

window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener("clik", moveUp)
btnLeft.addEventListener("clik", moveLeft)
btnRight.addEventListener("clik", moveRight)
btnDown.addEventListener("clik", moveDown)

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

