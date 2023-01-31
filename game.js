const canvas = document.querySelector('#game')
const game = canvas.getContext('2d')

window.addEventListener('load', startGame)

function startGame(){
  let canvasSize;

  if(window.innerHeight > window.innerWidth){
    canvasSize = window.innerWidth *.8
  } else{ 
    canvasSize = window.innerHeight *.8
  }

  const elementsSize = canvasSize / 10
  
  canvas.setAttribute('width', canvasSize)
  canvas.setAttribute('height', canvasSize)
  
  game.font = elementsSize + 'px arial'
  game.textAlign = 'end'
  game.textAlign = 'end'
  


  console.log(elementsSize)

  for (let i = 1; i <= 10; i++) {
    game.fillText(emojis['X'], elementsSize*i, elementsSize)
  }

}