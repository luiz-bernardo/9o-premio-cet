
class NextSignBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

    //Decide to continue the game or display a message about the victory or lose of the player
  mouse(action) {
    let winOrLose = Game.scoreMark();
    if(action == "click"){
        if(winOrLose == 0){
            Game.nextTurn();
        }
        else if(winOrLose>0){
            Sup.loadScene("Scenes/PlayerWin");
        }
        else if(winOrLose<0){
            Sup.loadScene("Scenes/PlayerLose");
        }
    }
    else if(action == "hover"){
      this.actor.spriteRenderer.setAnimation("hover");
    }
    else if(action == "unhover"){
      this.actor.spriteRenderer.setAnimation("unhover");
    }
  }

  update() {
    ray.setFromCamera(Sup.getActor("Camera").camera, Sup.Input.getMousePosition());

    if(ray.intersectActor(this.actor, false).length > 0){
      if(!this.isHover){
        this.mouse("hover");
        this.isHover = true;
      }
      if(Sup.Input.wasMouseButtonJustPressed(0)){
        this.mouse("click")
      }
    }
    else if(this.isHover){
      this.isHover = false;
      this.mouse("unhover")
    }
  }
}
Sup.registerBehavior(NextSignBehavior);


function SetSign(whichOne : string){
    
    if(whichOne == "ResetAll"){
        
        Sup.getActor("WrongSign").setEulerZ(Sup.Math.toRadians(WrongInitialZDegree));
        Sup.getActor("WrongSign").setX(WrongInitialXPos);
        Sup.getActor("RightSign").setEulerZ(Sup.Math.toRadians(RightInitialZDegree));
        Sup.getActor("RightSign").setX(RightInitialXPos);
        Sup.getActor("QuestionSign").setEulerZ(Sup.Math.toRadians(QuestionInitialZDegree));
        Sup.getActor("QuestionSign").setX(QuestionInitialXPos);
        Sup.getActor("NextSign").setEulerZ(Sup.Math.toRadians(NextInitialZDegree));
        Sup.getActor("NextSign").setX(NextInitialXPos);
    }
    else{
        
        RotateMoveObject(whichOne+"Sign", eval(whichOne+"Time"), 0, true, eval(whichOne+"FinalXPos"));
    }
    
}




namespace Questions {
  
  export var selectedOption = -1;
  export var rightOption = -2;
  export let qtexts: {[key: string]: any } = {};
  
  export function setOptionsArray(){
    
    function addOption(index){
      // get the name of current square
      let name = "Alternative" + index.toString();

      // get the actor from the Game scene
      let optionText = Sup.getActor(name);
      let optionMark = Sup.getActor("MarkChalk"+index);

      // push the option array in OPTIONS array to the next index
      OPTIONS.push([optionText, "unHover", optionMark]);
    }

    for(let i = 0; i <= 2; i++){
      addOption(i);
    }
  }
  
  export function clearOptionsArray(){
    for(let i = 0; i <= 2; i++){
      OPTIONS.pop();
    }
  }
  
  //Loads components in the array
  export function loadNewQuestion(player: number, number: number){
    Sup.getActor("Question").textRenderer.setText(qtexts["q"+player+"_"+number+"question"]);
    for(var i=0;i<=2;i++){
      OPTIONS[i][0].textRenderer.setText(qtexts["q"+player+"_"+number+"option"+i]);
    }
    Questions.rightOption=qtexts["q"+player+"_"+number+"right"];
    Sup.getActor("RightChalk").setParent(OPTIONS[Questions.rightOption][0])
    Sup.getActor("RightChalk").setLocalY(-0.2);
  }
  
  //Show new question
  export function showNewQuestion(){
    loadNewQuestion(actualPlayer,questionNumber);
    Sup.getActor("Question").getBehavior(TextBehavior).getReady();
    for (var i=0; i<=2; i++){
      OPTIONS[i][0].addBehavior(QuestionBehavior);
      OPTIONS[i][0].getBehavior(TextBehavior).getReady();
    }
    Sup.setTimeout(waitTime, function(){
        SetSign("Question");
    })
  }

  export function clearQuestion(){
    Sup.getActor("RightChalk").setVisible(false);
    for (var i=0; i<=2; i++){
      OPTIONS[i][1] = "unHover";
      OPTIONS[i][2].setVisible(false);
    }
    SetSign("ResetAll");
  }
  
  
  export function solveQuestion(){
    
    var gaugeToFill = null;
      
    //Destroy behavior to stop the hover effect on options
    Sup.getActor("Alternative0").getBehavior(QuestionBehavior).destroy();
    Sup.getActor("Alternative1").getBehavior(QuestionBehavior).destroy();
    Sup.getActor("Alternative2").getBehavior(QuestionBehavior).destroy();
      
    Sup.setTimeout(waitTime/4, function(){
        //right answer
        if(selectedOption === rightOption){
          SetSign("Right");
          gaugeToFill = "good";
        }
        //wrong answer
        else{
          SetSign("Wrong");
          gaugeToFill = "bad";
        }
    })
    questionNumber++;
    //Reveals right and wrong answers after the sign shows up
    Sup.setTimeout(RightTime+0.5*waitTime, function(){
        Sup.getActor("RightChalk").setVisible(true);
        Game.scoreMark(gaugeToFill);
        Sup.setTimeout(waitTime, function(){
            clearOptionsArray();
            SetSign("Next");
        })
    })
  }
  
}


class QuestionBehavior extends Sup.Behavior {
  
  awake() {

  }
  
  // mouse method receiving parameters of the player action and the square related to this action
  mouse(action, option){
    if(action == "isHover"){
      
      OPTIONS[option][2].spriteRenderer.setOpacity(opacityMark);
      OPTIONS[option][2].setVisible(true);
        
    }
    else if(action == "unHover"){
      OPTIONS[option][2].setVisible(false);
    }
    else if(action == "click"){
      for(var i=0; i<=2; i++){
        if(Questions.selectedOption != -1 && Questions.selectedOption != option){
          OPTIONS[Questions.selectedOption][2].setVisible(false);
          OPTIONS[Questions.selectedOption][1] = "unHover";
        } 
      }
      OPTIONS[option][2].spriteRenderer.setOpacity(1)
      OPTIONS[option][2].setVisible(true); 
      Questions.selectedOption = option;
      Questions.solveQuestion();
    }
  }

  update() {
    // Refresh the ray casting to the mouse position inside the camera screen
    
    ray.setFromCamera(Sup.getActor("Camera").camera, Sup.Input.getMousePosition());

    // Create a new empty variable that will as value the differents array of the OPTIONS constant
    let array;
    let index = 0;
    
    // Loop which give successively to array the values of the OPTIONS array.
    for(array of OPTIONS){

      // Check if ray intersect with a current option
      if(ray.intersectActor(array[0], false).length > 0){

        if(array[1] == "unHover"){
          array[1] = "isHover";
          this.mouse("isHover", index);
        }

        // Check if the left click button of the mouse is pressed on an unselected option
        if(Sup.Input.wasMouseButtonJustPressed(0) && array[1] == "isHover"){
          array[1] = "selected";
          this.mouse("click", index);
        }
      }

      // Else if ray does not intersect with a previous hovered option, the option change situation
      else if(array[1] == "isHover"){
        array[1] = "unHover";
        this.mouse("unHover", index);
      }
      index++;
    }
  }
}
Sup.registerBehavior(QuestionBehavior);


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



class TextBehavior extends Sup.Behavior {
  
  charsPerLine = 58;

  private text = "";
  private letterIndex = 0;

  awake() {
    
  }

  clear() {
    this.actor.textRenderer.setText("");
    this.letterIndex = 0;
    this.text = "";
  }

  start(){
    
  }

  getReady() {
    this.setText(this.actor.textRenderer.getText());
  }
  
  
  //Break text if necessary
  setText(text: string, initialLetterIndex=0) {
    const lines: string[] = [];
    
    let lineStartIndex = 0;
    let currentLineLength = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === "|") continue;
      
      currentLineLength++;
      if (currentLineLength === this.charsPerLine) {
        let j = i;
        while (j > 0) {
          const char = text[j];
          if (char === " ") { j++; break; }
          j--;
        }
        
        lines.push(text.slice(lineStartIndex, j));
        currentLineLength = 0;
        lineStartIndex = i = j;
      }
    }
       
    if (currentLineLength > 0) lines.push(text.slice(lineStartIndex));
    
    this.text = lines.join("\n");
    this.actor.textRenderer.setText(this.text);
    
  }

  update() {

  }

}
Sup.registerBehavior(TextBehavior);