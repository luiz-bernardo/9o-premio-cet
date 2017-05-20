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
var questionsToWin = 3;
var actualPlayer = 0;
var opacityMark = 0.651;
var waitTime = 400;
var fillGaugeTime = 600;
var goodMarks = 0
var badMarks = 0


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
    Sup.getActor("GoodBar").setLocalX(-2.65);
    Sup.getActor("BadBar").setLocalX(2.65);
  }
  
  export function nextTurn(){
    Questions.setOptionsArray();
    Questions.clearQuestion();
    Questions.showNewQuestion();
  }

  //fills good and bad scoregauges
  export function scoreMark(type : string):number{
      
      let posLocalX = 0;
      let xLocalStep = 0;
      let totalMoved = 0;
      if(type == "good"){
            posLocalX = Sup.getActor("GoodBar").getLocalX();
            xLocalStep = ((2.65/questionsToWin)/(60*fillGaugeTime/1000));
            var localMovementInterval = Sup.setInterval(timeStep, function(){

                if(totalMoved < (2.65/questionsToWin)){
                    Sup.getActor("GoodBar").moveLocalX(xLocalStep);
                    totalMoved = totalMoved + xLocalStep;
                }
                else{
                    Sup.getActor("GoodBar").setLocalX(posLocalX+(2.65/questionsToWin));
                    Sup.clearInterval(localMovementInterval);
                }
            })
            goodMarks++;
      }
      else if(type == "bad"){
            posLocalX = Sup.getActor("BadBar").getLocalX();
            xLocalStep = (-(2.65/questionsToWin))/(60*fillGaugeTime/1000);
            var localMovementInterval = Sup.setInterval(timeStep, function(){

                if(totalMoved > -(2.65/questionsToWin)){
                    Sup.getActor("BadBar").moveLocalX(xLocalStep);
                    totalMoved = totalMoved + xLocalStep;
                }
                else{
                    Sup.getActor("BadBar").setLocalX(posLocalX -(2.65/questionsToWin));
                    Sup.clearInterval(localMovementInterval);
                }
            })
            badMarks++;
      }
      //player won this character game
      if(goodMarks==questionsToWin){
          return 1;
      }
      //player lose this caracter game
      if(badMarks==questionsToWin){
          return -1;
      }
      //there is still some game to go
      return 0;
  }
}

function MoveObject(nameActor: string, movementTime : number, degrees : number, moveX : boolean, endingX: number){

    var xStep = 0;
    var totalRotated = 0;

    var radiansFinal = Sup.Math.toRadians(degrees);
    var radians = radiansFinal-Sup.getActor(nameActor).getEulerZ();
    var radianStep = (1000/60)*radians/movementTime;

    if(moveX){
        xStep = (endingX-Sup.getActor(nameActor).getX())/(60*movementTime/1000);
    }

    var movementInterval = Sup.setInterval(timeStep, function(){

        if(totalRotated < radians){
            Sup.getActor(nameActor).rotateEulerZ(radianStep);
            if(moveX){Sup.getActor(nameActor).moveX(xStep);}
            totalRotated = totalRotated + radianStep;
        }
        else{
            Sup.getActor(nameActor).setEulerZ(radiansFinal);
            Sup.getActor(nameActor).setX(endingX);
            Sup.clearInterval(movementInterval);
        }
    })
}

/*
[ ] Troca de personagem
[ ] Barras
[ ] Verificar se já não excedeu limite de erro ou acerto
[ ] Game over e game win
*/