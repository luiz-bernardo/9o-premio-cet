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

var ColorTextBlack = new Sup.Color(0.278,0.259,0.259);
var ColorTextGray = new Sup.Color(0.494,0.461,0.461);
var ColorTextGreen = new Sup.Color(0.333,0.729,0.043);
var ColorTextLightGreen = new Sup.Color(0.706,0.878,0.576);
var ColorTextRed = new Sup.Color(0.996,0.016,0.043);
var ColorTextDarkRed = new Sup.Color(0.749,0.110,0.129);

const OPTIONS = new Array;
var NEXTQUESTION = [0,0,0];
var questionNumber = 0;
var actualPlayer = 0;


class SignBehavior extends Sup.Behavior {

    time: number;
    degrees : number;
    moveX : boolean;
    endingX: number;
    scenetoLoad : string;
    scenetoload : string;
    sceneToLoad : string;
    
    awake() {

    }

    start(){
        
        SetSign("ResetAll");
        SetSign("Question");
    }

    update() {

    }
}
Sup.registerBehavior(SignBehavior);


function SetSign(whichOne : string){

    function RotateMoveObject(nameActor: string, movementTime : number, degrees : number, moveX : boolean, endingX: number){

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
    
    if(whichOne == "ResetAll"){
        
        Sup.getActor("WrongSign").setEulerZ(Sup.Math.toRadians(WrongInitialZDegree));
        Sup.getActor("WrongSign").setX(WrongInitialXPos);
        Sup.getActor("RightSign").setEulerZ(Sup.Math.toRadians(RightInitialZDegree));
        Sup.getActor("RightSign").setX(RightInitialXPos);
        Sup.getActor("QuestionSign").setEulerZ(Sup.Math.toRadians(QuestionInitialZDegree));
        Sup.getActor("QuestionSign").setX(QuestionInitialXPos);
    }
    else{
        
        RotateMoveObject(whichOne+"Sign", eval(whichOne+"Time"), 0, true, eval(whichOne+"FinalXPos"));
    }
    
}


namespace Game{
  
  export function resetGame(){

    NEXTQUESTION = [0,0,0];
    
    Questions.clearOptionsArray();
    Questions.selectedOption=-1;
    Questions.rightOption=-2;
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
}
