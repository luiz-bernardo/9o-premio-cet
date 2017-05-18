class introContinueBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;
  scenetoLoad : string = "null";

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  mouse(action) {
    if(action == "click"){
        Sup.loadScene("Scenes/"+this.scenetoLoad)
    }
    else if(action == "hover"){
      this.actor.textRenderer.setColor(ColorTextLightGreen); 
    }
    else if(action == "unhover"){
      this.actor.textRenderer.setColor(ColorTextGreen);
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
Sup.registerBehavior(introContinueBehavior);