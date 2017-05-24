var ray = new Sup.Math.Ray;

var timeBase = 100
//Signs and its data about movement to show
var RightTime = 6.5*timeBase;
var RightInitialXPos = -2
var RightInitialZDegree = -70
var RightFinalXPos = -5.22

var WrongTime = 6.5*timeBase;
var WrongInitialXPos = 3.4
var WrongInitialZDegree = -55
var WrongFinalXPos = 5.27

var QuestionTime = 5.5*timeBase;
var QuestionInitialXPos = 8
var QuestionInitialZDegree = -20
var QuestionFinalXPos = 0

var NextTime = 4.5*timeBase;
var NextInitialXPos = 5.5
var NextInitialZDegree = -30
var NextFinalXPos = 3.65

//Time related variables
var timeStep = 1000/40;
var waitTime = 4*timeBase;
var fillGaugeTime = 6*timeBase;
var bushAppearanceTime = 9*timeBase;
var backgroundPeriod = 15000;

//Question and characters related variables
var questionNumber = 0;
var questionsToWin = 3;

//Music and sound related variables
var Music = 1;  //First music to play
var AllMusics=3;
let inGameMusicPlayer = new Sup.Audio.SoundPlayer("Sounds/Music"+Music, 1.0);

//Other
const OPTIONS = new Array;
var actualPlayer = 0;
var starredPlayers = 0;
var opacityMark = 0.651;
var goodMarks = 0;
var badMarks = 0;
var completedChar = [false,false,false,false];

namespace Game{
   
  export function startGame(characterNum=0){
      
    var i;
    
    Sup.loadScene("Scenes/Game");
    actualPlayer=characterNum;
    Questions.selectedOption=-1;
    Questions.rightOption=-2;
    questionNumber = 0;
    goodMarks = 0;
    badMarks = 0;
    Questions.clearOptionsArray();
    Sup.getActor("GoodBar").setLocalX(-2.65);
    Sup.getActor("BadBar").setLocalX(2.65);
    Sup.getActor("Bush").setLocalX(9.5);
    Sup.getActor("AnimatedBackground").setX(-6.86);
    Sup.getActor("PlayTrack").getBehavior(SoundButtonBehavior).automaticPlay();
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
            xLocalStep = ((2.65/questionsToWin)/(fillGaugeTime/timeStep));
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
            xLocalStep = (-(2.65/questionsToWin))/(fillGaugeTime/timeStep);
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
          if(!completedChar[actualPlayer]){
             starredPlayers++;
          }
          completedChar[actualPlayer]=true;
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

function PrepareChoiceScreen(){
    
    var i;
    
    for (i=0;i<=3;i++){
        if(completedChar[i]){
            Sup.getActor("Star"+i).setVisible(true);
        }
    }
}

function MoveObject(nameActor: string, movementTime : number, degrees : number, moveX : boolean, endingX: number){

    var xStep = 0;
    var totalRotated = 0;

    var radiansFinal = Sup.Math.toRadians(degrees);
    var radians = radiansFinal-Sup.getActor(nameActor).getEulerZ();
    var radianStep = (timeStep)*radians/movementTime;

    if(moveX){
        xStep = (endingX-Sup.getActor(nameActor).getX())/(movementTime/timeStep);
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

class animatedBackgroundBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button

      
    xLocalStep: number= 0;
    totalMoved: number = 0;
    
  awake(){

    this.xLocalStep = ((-59.94+6.86)/(backgroundPeriod/timeStep));
        
  }  
    
  update(){

        if(this.totalMoved > (-59.94+6.86)){
            Sup.getActor("AnimatedBackground").moveX(this.xLocalStep);
            this.totalMoved = this.totalMoved + this.xLocalStep;
        }
        else{
            Sup.getActor("AnimatedBackground").setX(-6.86);
            this.totalMoved = 0;
        }
  }

}
Sup.registerBehavior(animatedBackgroundBehavior);
