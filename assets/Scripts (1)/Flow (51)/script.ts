class StandardButtonBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;
  turnOffSound : boolean = false;
  soundToPlay: string = "Toc";
  turnOffLoadScene: boolean = false;
  sceneToLoad: string = "Menu";

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  mouse(action) {
    if(action == "click"){
      if (!this.turnOffSound){
        Sup.Audio.playSound("Sounds/"+this.soundToPlay); 
      }
      if (!this.turnOffLoadScene){
        Sup.loadScene("Scenes/"+this.sceneToLoad);
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
Sup.registerBehavior(StandardButtonBehavior);


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

