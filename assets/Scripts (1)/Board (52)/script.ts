class BoardBehavior extends Sup.Behavior {
  awake() {

  }

  start(){
    
    if(actualPlayer==-1){
      Game.startGame();
    }
    else{
      Game.startAgain();
    }
    
    
  }
  
  update() {
    
  }
}
Sup.registerBehavior(BoardBehavior);

  
namespace Board {
  
  //This function shows all pins and question marks
  export function showElements(){
    
    let questionNumber=0
    let interval=800 //set this time to change the interval for showing the assets
    
    for(var i=0;i<=2;i++){
        movePin(i, 0);
    }
    
    //This part reveals the question marks one by one
    var questionAppearing = Sup.setInterval(interval, function(){

      Sup.Audio.playSound("Sounds/Toc");
      Sup.getActor("Path0").getChild("Question"+questionNumber).setVisible(true);
      Sup.getActor("Path1").getChild("Question"+questionNumber).setVisible(true);
      Sup.getActor("Path2").getChild("Question"+questionNumber).setVisible(true);

      questionNumber++

      if(questionNumber>2){
        Sup.clearInterval(questionAppearing);
      }

    })
    //This part reveals the pins representing the family
    Sup.setTimeout(4*interval, function(){

    Sup.Audio.playSound("Sounds/Toc");
    Sup.getActor("Pins").getChild("Pin0").setVisible(true);
    Sup.getActor("Pins").getChild("Pin1").setVisible(true);
    Sup.getActor("Pins").getChild("Pin2").setVisible(true);

    })
  }
  
  export function movePin(player: number, position: number){
    Sup.getActor("Pins").getChild("Pin"+player).setLocalPosition(POSITIONS[player][position][0],POSITIONS[player][position][1],0);
  }
  
}