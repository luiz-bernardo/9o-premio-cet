
namespace Questions {
  
  export var selectedOption = -1;
  export var rightOption = -2;
  export let qtexts: {[key: string]: any } = {};
  
  export function setOptionsArray(){
    
    function addOption(index){
      // get the name of current square
      let name = "Alternative" + index.toString();

      // get the actor from the Game scene
      let optionCircle = Sup.getActor("QuestionDialog").getChild(name).getChild("Circle");
      let optionText = Sup.getActor("QuestionDialog").getChild(name);

      // push the option array in OPTIONS array to the next index
      OPTIONS.push([optionCircle, optionText, "unHover"]);
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
    Sup.getActor("QuestionDialog").getChild("Question").textRenderer.setText(qtexts["q"+player+"_"+number+"question"]);
    for(var i=0;i<=2;i++){
      OPTIONS[i][1].textRenderer.setText(qtexts["q"+player+"_"+number+"option"+i]);
    }
    Questions.rightOption=qtexts["q"+player+"_"+number+"right"];
  }
  
  //Show new question
  export function showNewQuestion(){
    loadNewQuestion(actualPlayer,NEXTQUESTION[actualPlayer]);
    Sup.getActor("QuestionDialog").getChild("Question").getBehavior(TextBehavior).getReady();
    for (var i=0; i<=2; i++){
      OPTIONS[i][1].getBehavior(TextBehavior).getReady();
    }
    Sup.getActor("QuestionDialog").setVisible(true);
  }

  export function clearQuestion(){
    Sup.getActor("QuestionDialog").setVisible(false);
    Sup.getActor("QuestionDialog").addBehavior(QuestionBehavior);    
    Sup.getActor("QuestionDialog").getChild("HeaderQuestion").spriteRenderer.setAnimation("question");
    Sup.getActor("QuestionDialog").getChild("Title").textRenderer.setText("QUAL É A MELHOR ALTERNATIVA?");
    Sup.getActor("QuestionDialog").getChild("Question").setVisible(false);
    for (var i=0; i<=2; i++){
      OPTIONS[i][0].spriteRenderer.setAnimation("unhover");
      OPTIONS[i][1].textRenderer.setColor(ColorTextBlack); 
      OPTIONS[i][1].setVisible(false);
      OPTIONS[i][2] = "unHover";
    }
    Sup.getActor("QuestionDialog").getChild("Next").setVisible(false);
    Sup.getActor("QuestionDialog").getChild("Next").textRenderer.setColor(ColorTextGreen);
    Sup.getActor("QuestionDialog").getChild("Next").getBehavior(questionDialogButtonBehavior).setClickToSolve();
  }
  
  
  export function solveQuestion(){
    Sup.getActor("QuestionDialog").getBehavior(QuestionBehavior).destroy();
    Sup.getActor("QuestionDialog").getChild("Next").getBehavior(questionDialogButtonBehavior).setClickToBoard();
    //right answer
    if(selectedOption === rightOption){
      Sup.getActor("QuestionDialog").getChild("HeaderQuestion").spriteRenderer.setAnimation("right");
      Sup.getActor("QuestionDialog").getChild("Title").textRenderer.setText("Muito bom! Sua RESPOSTA está CORRETA! =)\nMais um passo em segurança. ");
    }
    //wrong answer
    else{
      Sup.getActor("QuestionDialog").getChild("HeaderQuestion").spriteRenderer.setAnimation("wrong");
      Sup.getActor("QuestionDialog").getChild("Title").textRenderer.setText("RESPOSTA ERRADA. Melhor não avançar se a segurança\nestá em risco. Tente mais uma vez =)");
    }
    NEXTQUESTION[actualPlayer]=NEXTQUESTION[actualPlayer]+1;
    //Reveals right and wrong answers
    for (var i=0; i<=2; i++){
      if(i === rightOption){
        OPTIONS[i][1].textRenderer.setColor(ColorTextGreen); 
      }
      else if(OPTIONS[i][2]==="selected"){
        OPTIONS[i][1].textRenderer.setColor(ColorTextRed); 
      }
    }
  }
  
}



class QuestionBehavior extends Sup.Behavior {
  
  awake() {

  }
  
  // mouse method receiving parameters of the player action and the square related to this action
  mouse(action, option){
    if(action == "isHover"){
      OPTIONS[option][0].spriteRenderer.setAnimation("ishover");
      OPTIONS[option][1].textRenderer.setColor(ColorTextGray);
    }
    else if(action == "unHover"){
      OPTIONS[option][0].spriteRenderer.setAnimation("unhover");
      OPTIONS[option][1].textRenderer.setColor(ColorTextBlack);
    }
    else if(action == "click"){
      for(var i=0; i<=2; i++){
        if(Questions.selectedOption != -1 && Questions.selectedOption != option){
          OPTIONS[Questions.selectedOption][0].spriteRenderer.setAnimation("unhover");
          OPTIONS[Questions.selectedOption][1].textRenderer.setColor(ColorTextBlack); 
          OPTIONS[Questions.selectedOption][2] = "unHover";
        }
        OPTIONS[option][0].spriteRenderer.setAnimation("checked");
        OPTIONS[option][1].textRenderer.setColor(ColorTextBlack);
        Questions.selectedOption = option;
        this.actor.getChild("Next").setVisible(true);
      }
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
      if(ray.intersectActor(array[0], false).length > 0 || ray.intersectActor(array[1], false).length > 0){

        if(array[2] == "unHover"){
          array[2] = "isHover";
          this.mouse("isHover", index);
        }

        // Check if the left click button of the mouse is pressed on an unselected option
        if(Sup.Input.wasMouseButtonJustPressed(0) && array[2] == "isHover"){
          array[2] = "selected";
          this.mouse("click", index);
        }
      }

      // Else if ray does not intersect with a previous hovered option, the option change situation
      else if(array[2] == "isHover"){
        array[2] = "unHover";
        this.mouse("unHover", index);
      }
      index++;
    }
  }
}
Sup.registerBehavior(QuestionBehavior);


class questionDialogButtonBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;
  private backToBoard = false;

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  setClickToBoard(){
    this.backToBoard = true;
  }

  setClickToSolve(){
    this.backToBoard = false;
  }

  mouse(action) {
    if(action == "click"){
      if(this.backToBoard){
      }else{
        Questions.solveQuestion();
      }
    }
    else if(action == "hover"){
      this.actor.textRenderer.setColor(ColorTextLightGreen); 
    }
    else if(action == "unhover"){
      this.actor.textRenderer.setColor(ColorTextGreen);
    }
  }

  update() {
    if(this.actor.getVisible()){
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
}
Sup.registerBehavior(questionDialogButtonBehavior);


class gameoverDialogAgainBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  mouse(action) {
    if(action == "click"){
      Game.startGame();
    }
    else if(action == "hover"){
      this.actor.textRenderer.setColor(ColorTextLightGreen); 
    }
    else if(action == "unhover"){
      this.actor.textRenderer.setColor(ColorTextGreen);
    }
  }

  update() {
    if(this.actor.getVisible()){
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
}
Sup.registerBehavior(gameoverDialogAgainBehavior);

class gameoverDialogExitBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  mouse(action) {
    if(action == "click"){
      Game.backToMenu();
    }
    else if(action == "hover"){
      this.actor.textRenderer.setColor(ColorTextLightGreen); 
    }
    else if(action == "unhover"){
      this.actor.textRenderer.setColor(ColorTextGreen);
    }
  }

  update() {
    if(this.actor.getVisible()){
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
}
Sup.registerBehavior(gameoverDialogExitBehavior);

class arriveDialogContinueBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  mouse(action) {
    if(action == "click"){
      Sup.getActor("SuccessDialog").setVisible(false);
    }
    else if(action == "hover"){
      this.actor.textRenderer.setColor(ColorTextLightGreen); 
    }
    else if(action == "unhover"){
      this.actor.textRenderer.setColor(ColorTextGreen);
    }
  }

  update() {
    if(Sup.getActor("SuccessDialog").getVisible()){
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
}
Sup.registerBehavior(arriveDialogContinueBehavior);


class TextBehavior extends Sup.Behavior {
  
  charsPerLine = 65;

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

    this.letterIndex = initialLetterIndex;
    this.actor.textRenderer.setText(this.text.slice(0, this.letterIndex));
    
  }

  update() {

  }

}
Sup.registerBehavior(TextBehavior);