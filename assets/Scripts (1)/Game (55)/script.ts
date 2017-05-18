//This variable holds the actual order to show of elements when needed
var indexToShow = 1;
var ray = new Sup.Math.Ray;
const OPTIONS = new Array;

var timeInterval = 1500;
var timeShiftSky = timeInterval;
var timeTransport = 1500;
var actualPlayer = -1;
var NEXTQUESTION = [0,0,0];
var WRONGANSWERS = [0,0,0];
var PLAYERPOSITION = [0,0,0];
var SKY = [0,0.2,0.4,0.6,0.8]
var skyPhase = 0;
var skyStepsPerChange=15;
var transportStepsPerChange=15;

const POSITIONS = [
                    [
                       [-3.699,2.59],
                       [5.253,2.59],
                       [5.628,-0.2],
                       [5.273,-1.865]
                                         ],
                    [
                       [-0.532,-0.361],
                       [0.624,-1.872],
                       [3.183,-1.903],
                       [4.678,-1.656]
                                         ],
                    [
                       [1.047,0.866],
                       [2.804,-0.922],
                       [3.775,-2.155],
                       [4.762,-1.986]
                                         ]
                                            ]
var itMoves = false;
var test = 0;

var ColorTextBlack = new Sup.Color(0.278,0.259,0.259);
var ColorTextGray = new Sup.Color(0.494,0.461,0.461);
var ColorTextGreen = new Sup.Color(0.333,0.729,0.043);
var ColorTextLightGreen = new Sup.Color(0.706,0.878,0.576);
var ColorTextRed = new Sup.Color(0.996,0.016,0.043);
var ColorTextDarkRed = new Sup.Color(0.749,0.110,0.129);

class GameBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    
  }
}
Sup.registerBehavior(GameBehavior);


//This behavior adds an order of showering to the element. It will be revealed only after
//the previous element
class ShowBehavior extends Sup.Behavior {
  
  orderToShow = 1;
  
  awake() {
    
  }

  update() {
    if (this.orderToShow === indexToShow){
      this.actor.setVisible(true);
    }
  }
}
Sup.registerBehavior(ShowBehavior);


namespace Game{
  
  export function resetGame(){

    NEXTQUESTION = [0,0,0];
    WRONGANSWERS = [0,0,0];
    PLAYERPOSITION = [0,0,0];
    
    Dialog.clearOptionsArray();
    Dialog.selectedOption=-1;
    Dialog.rightOption=-2;
    skyPhase = 0;
    actualPlayer=-1;
    itMoves=false;
  }
  
  export function startAgain(){
    Sup.destroyAllActors();
    resetGame();
    Sup.loadScene("Scenes/Intro_1");
  }
  
  export function backToMenu(){
    resetGame();
    Sup.loadScene("Scenes/Menu");
  }
  
  export function changePlayer(){   
    for(var i=0;i<=2;i++){
      actualPlayer=(actualPlayer+1)%3;
      if(PLAYERPOSITION[actualPlayer]<3){
        i=3;
      }
    }
  }
  
  export function testGameWinOver(){
    for(var i=0;i<=2;i++){
      if(WRONGANSWERS[i]>2){
        return -1; //GameOver
      }
    }
    if(PLAYERPOSITION[0]>=3 && PLAYERPOSITION[1]>=3 && PLAYERPOSITION[2]>=3){
      return 1;   //GameWin
    }
    return 0;  //Game continues
  }
  
  export function testArrivedHome(){
    if(PLAYERPOSITION[actualPlayer]>=3){
      return true
    }
    else{
      return false
    }
  }
  
  export function startGame(){
    actualPlayer=0;
    Board.showElements();
    Dialog.setOptionsArray();
    Sup.setTimeout(2*timeInterval+3200,function(){
      Dialog.clearQuestion();
      Dialog.showNewQuestion();
    })    
  }
}

namespace Turn{
  
  export function nextTurn(){
    //Prepares for the next question
    Dialog.clearQuestion();
    phaseOne();
  }
  
  export function phaseOne(){
    //Moves or not the player
    Sup.setTimeout(timeInterval/4,function(){
      if(itMoves && PLAYERPOSITION[actualPlayer]<4){
        itMoves=false;

        var i=0;
        var transportationStep = 1/transportStepsPerChange;

        var transportationLoop = Sup.setInterval(timeTransport/transportStepsPerChange, function(){

              var opacity=Sup.getActor("Pins").getChild("Pin"+actualPlayer).spriteRenderer.getOpacity();
              if(i<skyStepsPerChange){
                Sup.getActor("Pins").getChild("Pin"+actualPlayer).spriteRenderer.setOpacity(opacity-transportationStep);
              }

              if(i===skyStepsPerChange){
                Board.movePin(actualPlayer,PLAYERPOSITION[actualPlayer]);
              }
              if(i>skyStepsPerChange){
                Sup.getActor("Pins").getChild("Pin"+actualPlayer).spriteRenderer.setOpacity(opacity+transportationStep);
              }
              i++;
              if(i>=2*skyStepsPerChange){
                Sup.clearInterval(transportationLoop);
                Sup.setTimeout(timeInterval/3,function(){
                    //Check if game is lost or already win and put the stars, if it is
                    if(Game.testGameWinOver()===1 || Game.testGameWinOver()===-1){
                      putStarsNow();
                    }
                    else{
                      //Check if player arrived home
                      if(Game.testArrivedHome()){
                        Sup.getActor("SuccessDialog").setVisible(true);
                      }
                      else{
                        phaseTwo(); 
                      } 
                    }
                 })
              }
        })
      }
      else{
          //Check if game is lost or already win and put the stars, if it is
          if(Game.testGameWinOver()===1 || Game.testGameWinOver()===-1){
            putStarsNow();
          }
          else{
            //Check if player arrived home
            if(Game.testArrivedHome()){
              Sup.getActor("SuccessDialog").setVisible(true);
            }
            else{
              phaseTwo(); 
            } 
          }
      }
    })
  }
  
  
  /*  
  export function phaseOne(){
    //Moves or not the player
    Sup.setTimeout(timeInterval,function(){
      if(itMoves && PLAYERPOSITION[actualPlayer]<4){
        itMoves=false;
        Board.movePin(actualPlayer,PLAYERPOSITION[actualPlayer]);
      }

      //Check if game is lost or already win and put the stars, if it is
      if(Game.testGameWinOver()===1 || Game.testGameWinOver()===-1){
        putStarsNow();
      }
      else{
        //Check if player arrived home
        if(Game.testArrivedHome()){
          Sup.getActor("SuccessDialog").setVisible(true);
        }
        else{
          phaseTwo(); 
        } 
      }
      
      
    })
  }
  */
  
  
  export function phaseTwo(){
    Sup.setTimeout(timeInterval,function(){
      let lastPlayer = actualPlayer;
      Game.changePlayer();
      if(actualPlayer<=lastPlayer){ //If all players had its chance, its time to change the sky
        shiftSky();
      }
      else{
        Dialog.showNewQuestion(); 
      }
    })
  }
  
  export function shiftSky(){
    var i=0;
    skyPhase++;
    var skyStep=(SKY[skyPhase]-SKY[skyPhase-1])/skyStepsPerChange
    
    var skyLoop=Sup.setInterval(timeShiftSky/skyStepsPerChange,function(){
      var opacity=Sup.getActor("Sky").spriteRenderer.getOpacity();
      Sup.getActor("Sky").spriteRenderer.setOpacity(opacity+skyStep);
      i++;
      if(i>=skyStepsPerChange){
        Sup.clearInterval(skyLoop);
        Sup.setTimeout(timeInterval/2,function(){
          Dialog.showNewQuestion();
        })
      }
    })
    
  }
  
  export function putStarsNow(){
    var i=0;
    var skyStep=(1-SKY[skyPhase])/skyStepsPerChange
    
    var skyLoop = Sup.setInterval(timeShiftSky/skyStepsPerChange,function(){
      var opacity=Sup.getActor("Sky").spriteRenderer.getOpacity();
      Sup.getActor("Sky").spriteRenderer.setOpacity(opacity+skyStep);
      i++;
      if(i>=skyStepsPerChange){
        Sup.clearInterval(skyLoop);
        var j=0;
        var starLoop = Sup.setInterval(timeShiftSky/skyStepsPerChange,function(){
            var starStep=1/skyStepsPerChange;
            var opacityStar=Sup.getActor("Stars").spriteRenderer.getOpacity();
            Sup.getActor("Stars").spriteRenderer.setOpacity(opacityStar+starStep);
            j++;
            Sup.log("starstep"+j)
            if(j>=skyStepsPerChange){
              Sup.clearInterval(starLoop);
              Sup.setTimeout(timeInterval/2,function(){
                  if(Game.testGameWinOver()===-1){
                    Sup.loadScene("Scenes/GameOver");
                  }
                  else if(Game.testGameWinOver()===1){
                    Sup.loadScene("Scenes/GameWin");
                  }
              })
            }
        })
      }
    })
  }

}


/*
OUTROS
[x] Reset no jogo ir para introdução ao invés do board
[x] Sair cinza no game over    ->  Sair do jogo
[x] Tentar de novo   -> reset no jogo
[ ] Ícone para sair do jogo (voltar para introdução)

*/