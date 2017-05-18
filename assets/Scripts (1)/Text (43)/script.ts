
class TextBehavior extends Sup.Behavior {
  
  charsPerLine = 65;
  framesPerChar = 0.25;

  private text = "";
  private letterIndex = 0;
  private timer = 0;
  private blinkTimer = 0;
  private blinkDuration = 4;
  private orderToShow = 1;

  awake() {
    
  }

  clear() {
    this.actor.textRenderer.setText("");
    this.letterIndex = 0;
    this.timer = 0;
    this.text = "";
    this.blinkTimer = 0;
  }

  start(){
    
    
  }

  getReady() {
    if(this.actor.getBehavior(ShowBehavior) != null){
        this.orderToShow = this.actor.getBehavior(ShowBehavior).orderToShow;
    }
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
    this.blinkTimer = 0;
    this.actor.textRenderer.setText(this.text.slice(0, this.letterIndex));
    
  }

  update() {
    //Print letters one by one accordingly to the pace defined by framesperchar
    if (this.orderToShow === indexToShow){
      if (this.letterIndex < this.text.length) {
        this.timer++;
        if (this.timer >= this.framesPerChar) {
          this.timer = 0;
          this.letterIndex++;
          this.blinkTimer = (this.blinkTimer + 1) % this.blinkDuration;
          this.actor.textRenderer.setText(this.text.slice(0, this.letterIndex) + (this.blinkTimer < this.blinkDuration / 2 ? "_" : ""));
        }
      } else if (this.blinkTimer < this.blinkDuration / 2) {
        this.blinkTimer = this.blinkDuration;
        this.actor.textRenderer.setText(this.text);
      } else {
          indexToShow++;  //ready to show the next element
      }
    }
  }

}
Sup.registerBehavior(TextBehavior);
  
