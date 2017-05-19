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


class SignBehavior extends Sup.Behavior {

    time: number;
    degrees : number;
    moveX : boolean;
    endingX: number;
    
    awake() {

    }

    start(){
        
        SetSign("Question")
    }

    update() {

    }
}
Sup.registerBehavior(SignBehavior);

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

function SetSign(whichOne : string){

    if(whichOne == "ResetAll")
    {
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


