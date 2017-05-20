var ray = new Sup.Math.Ray;

var timeStep = 1000/60

var RightTime = 700
var RightInitialXPos = -2
var RightInitialZDegree = -70
var RightFinalXPos = -5.22

var WrongTime = 700
var WrongInitialXPos = 3.4
var WrongInitialZDegree = -55
var WrongFinalXPos = 5.27

var QuestionTime = 600
var QuestionInitialXPos = 8
var QuestionInitialZDegree = -20
var QuestionFinalXPos = 0

var NextTime = 500
var NextInitialXPos = 5.5
var NextInitialZDegree = -30
var NextFinalXPos = 3.65


var ColorTextBlack = new Sup.Color(0.278,0.259,0.259);
var ColorTextGray = new Sup.Color(0.494,0.461,0.461);
var ColorTextGreen = new Sup.Color(0.333,0.729,0.043);
var ColorTextLightGreen = new Sup.Color(0.706,0.878,0.576);
var ColorTextRed = new Sup.Color(0.996,0.016,0.043);
var ColorTextDarkRed = new Sup.Color(0.749,0.110,0.129);


const OPTIONS = new Array;
var questionNumber = 0;
var actualPlayer = 0;
var opacityMark = 0.651;
var waitTime = 400;


namespace Game{
  
  export function resetGame(){
    
    Questions.clearOptionsArray();
    Questions.selectedOption=-1;
    Questions.rightOption=-2;
    questionNumber = 0;
      
  }
  
  export function backToMenu(){
    resetGame();
    Sup.loadScene("Scenes/Menu");
  }
  
  export function startGame(){
    Questions.setOptionsArray();
    Questions.clearQuestion();
    Questions.showNewQuestion();
  }
  
  export function nextTurn(){
    Questions.setOptionsArray();
    Questions.clearQuestion();
    Questions.showNewQuestion();
  }
  
}

/*
[ ] Troca de personagem
[ ] Barras
[ ] Verificar se já não excedeu limite de erro ou acerto
[ ] Game over e game win
*/