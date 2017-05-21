var ray = new Sup.Math.Ray;

//Signs and its data about movement to show
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

const OPTIONS = new Array;
var timeStep = 1000/60
var questionNumber = 0;
var questionsToWin = 3;
var actualPlayer = 0;
var opacityMark = 0.651;
var waitTime = 400;
var fillGaugeTime = 600;
var goodMarks = 0
var badMarks = 0


namespace Game{
   
  export function startGame(characterNum=0){
    Sup.loadScene("Scenes/Game");
    actualPlayer=characterNum;
    Questions.selectedOption=-1;
    Questions.rightOption=-2;
    questionNumber = 0;
    Questions.clearOptionsArray();
    Sup.getActor("GoodBar").setLocalX(-2.65);
    Sup.getActor("BadBar").setLocalX(2.65);
    Questions.setOptionsArray();
    Questions.clearQuestion();
    Sup.setTimeout(1.5*waitTime, function(){
        Questions.showNewQuestion();
    })
  }
  
  export function nextTurn(){
    Questions.setOptionsArray();
    Questions.clearQuestion();
    Questions.showNewQuestion();
  }

  //fills good and bad scoregauges
  export function scoreMark(type? : string):number{
      
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
