const canvas = document.querySelector('#game')
const game = canvas.getContext('2d')
let canvasSize
let elementsSize

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

  startGame()
}

function startGame(){

  game.font = elementsSize + 'px arial'
  game.textAlign = 'end'

  console.log(maps);

  //cleans first map (map[0]) and splits by \n
  const mapRows = maps[0].trim().split('\n')

  //cleans every row of strings then converts strings to array with map()  
  const mapRowCols = mapRows.map(function(row){
    return row.trim().split('')
  })

  //console.log(mapRowCols);

  mapRowCols.forEach((row, rowIndex)=>{

    row.forEach((col, colIndex) =>{
  
      const emoji = emojis[col]
      const posX = elementsSize*(colIndex+1)
      const posY = elementsSize*(rowIndex+1)

      //renders emoji
      game.fillText(emoji, posX, posY)
    })
  })

}

