
var screenNumber=1;

class StandardOptionBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;
  scenetoLoad: string = "null";

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  mouse(action) {
    if(action == "click"){
      Sup.Audio.playSound("Sounds/Toc");
      Sup.loadScene("Scenes/"+this.scenetoLoad);
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
Sup.registerBehavior(StandardOptionBehavior);



class ExitOptionBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  mouse(action) {
    if(action == "click"){
      Sup.Audio.playSound("Sounds/Toc");
      Sup.exit();
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
Sup.registerBehavior(ExitOptionBehavior);


class slideNextBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;
  next : boolean = true;

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
    screenNumber=1;
  }

  mouse(action) {
    if(action == "click"){
      if(this.next){
        screenNumber=screenNumber+1;
        if(screenNumber===3){
          Sup.getActor("Background").spriteRenderer.setAnimation("screen"+screenNumber);
        }
        else if(screenNumber===4){
          Sup.loadScene("Scenes/Menu");
        }
        else{
          Sup.getActor("Background").spriteRenderer.setAnimation("screen"+screenNumber);
        }
      }
      else{
        screenNumber=screenNumber-1;
        if(screenNumber===1){
          Sup.getActor("Background").spriteRenderer.setAnimation("screen"+screenNumber);
        }
        else if(screenNumber===0){
          Sup.loadScene("Scenes/Menu");
        }
        else{
          Sup.getActor("Background").spriteRenderer.setAnimation("screen"+screenNumber);
        }
      }
    }
    else if(action == "hover"){
      this.actor.textRenderer.setColor(ColorTextDarkRed); 
    }
    else if(action == "unhover"){
      this.actor.textRenderer.setColor(ColorTextRed);
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
Sup.registerBehavior(slideNextBehavior);


class backToMenuBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  mouse(action) {
    if(action == "click"){
      Sup.loadScene("Scenes/Menu");
    }
    else if(action == "hover"){
      this.actor.textRenderer.setColor(ColorTextDarkRed); 
    }
    else if(action == "unhover"){
      this.actor.textRenderer.setColor(ColorTextRed);
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
Sup.registerBehavior(backToMenuBehavior);