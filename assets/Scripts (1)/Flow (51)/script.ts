class SoundButtonBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;

  isPlayButton : boolean = false;
  isNextButton : boolean = false;
  isPreviousButton : boolean = false;
  stopOnDestroy: boolean = false;

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }
    
  onDestroy(){
      if(this.stopOnDestroy){
          inGameMusicPlayer.stop()
      }
  }
    
  automaticPlay(){
      inGameMusicPlayer.play();
      inGameMusicPlayer.setLoop(true);
      this.actor.spriteRenderer.setSprite("GameSprites/PauseButton");
  }

  mouse(action) {
    if(action == "click"){
        if(this.isPlayButton){
            if(inGameMusicPlayer.isPlaying()){
              inGameMusicPlayer.pause();
              this.actor.spriteRenderer.setSprite("GameSprites/PlayButton");
              this.actor.spriteRenderer.setAnimation("hover");
            }
            else{
              inGameMusicPlayer.play();
              inGameMusicPlayer.setLoop(true);
              this.actor.spriteRenderer.setSprite("GameSprites/PauseButton");
              this.actor.spriteRenderer.setAnimation("hover");
            }        
        }
        if(this.isNextButton){
            if(Music == AllMusics){
                Music = 1;
            }
            else{
                Music++;
            }
            inGameMusicPlayer.stop();
            inGameMusicPlayer = new Sup.Audio.SoundPlayer("Sounds/Music"+Music, 1.0);
            inGameMusicPlayer.play();
            inGameMusicPlayer.setLoop(true);
            Sup.getActor("PlayTrack").spriteRenderer.setSprite("GameSprites/PauseButton");
        }
        if(this.isPreviousButton){
            if(Music == 1){
                Music = AllMusics;
            }
            else{
                Music--;
            }
            inGameMusicPlayer.stop();
            inGameMusicPlayer = new Sup.Audio.SoundPlayer("Sounds/Music"+Music, 1.0);
            inGameMusicPlayer.play();
            inGameMusicPlayer.setLoop(true);
            Sup.getActor("PlayTrack").spriteRenderer.setSprite("GameSprites/PauseButton");
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
Sup.registerBehavior(SoundButtonBehavior);


class StandardButtonBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;
  turnOffOnClickSound : boolean = false;
  soundToPlayOnClick: string = "click4";
  turnOffHoverSound : boolean = false;
  soundToPlayHover: string = "plaster";
  turnOffLoadScene: boolean = false;
  sceneToLoad: string = "Menu";
  turnOnCameraMove: boolean = false;
  cameraYMove: number = 0;
  setWhereToGoAfter: boolean = false;
  whereToGoAfter: string = "Menu";
    

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  mouse(action) {
    if(action == "click"){
      if (!this.turnOffOnClickSound){
        Sup.Audio.playSound("Sounds/"+this.soundToPlayOnClick); 
      }
      if (!this.turnOffLoadScene){
        Sup.loadScene("Scenes/"+this.sceneToLoad);
      }
      if (this.setWhereToGoAfter){
        Sup.getActor("NextWarning").getBehavior(warningButtonBehavior).whereToSend = this.whereToGoAfter;
      }
      if (this.turnOnCameraMove){
        Sup.getActor("Camera").setY(this.cameraYMove);
      }
    }
    else if(action == "hover"){
      if (!this.turnOffHoverSound){
        Sup.Audio.playSound("Sounds/"+this.soundToPlayHover); 
      }
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
  turnOffOnClickSound : boolean = false;
  soundToPlayOnClick: string = "click4";
  turnOffHoverSound : boolean = false;
  soundToPlayHover: string = "plaster";

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  mouse(action) {
    if(action == "click"){
      if (!this.turnOffOnClickSound){
        Sup.Audio.playSound("Sounds/"+this.soundToPlayOnClick); 
      }
      Sup.exit();
    }
    else if(action == "hover"){
      if (!this.turnOffHoverSound){
        Sup.Audio.playSound("Sounds/"+this.soundToPlayHover); 
      }
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

class choiceScreenBehavior extends Sup.Behavior {

  awake() {
        PrepareChoiceScreen();
  }

}
Sup.registerBehavior(choiceScreenBehavior);


class soundStopBehavior extends Sup.Behavior {

  awake() {
        inGameMusicPlayer.stop();
  }
}
Sup.registerBehavior(soundStopBehavior);


class charChoiceButtonBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;
  turnOffOnClickSound : boolean = false;
  soundToPlayOnClick: string = "click4";
  turnOffHoverSound : boolean = false;
  soundToPlayHover: string = "plaster";
  characterNumber: number=0;

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  mouse(action) {
    if(action == "click"){
      if (!this.turnOffOnClickSound){
        Sup.Audio.playSound("Sounds/"+this.soundToPlayOnClick); 
      }
      Game.startGame(this.characterNumber);
    }
    else if(action == "hover"){
      if (!this.turnOffHoverSound){
        Sup.Audio.playSound("Sounds/"+this.soundToPlayHover); 
      }
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
Sup.registerBehavior(charChoiceButtonBehavior);

class bushMenuButtonBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;
  turnOffOnClickSound : boolean = false;
  soundToPlayOnClick: string = "click4";
  turnOffHoverSound : boolean = false;
  soundToPlayHover: string = "plaster";
  opened: boolean = false;

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  mouse(action) {
    let xLocalStep = 0;
    let totalMoved = 0;
      
    if(action == "click"){
      if (!this.turnOffOnClickSound){
        Sup.Audio.playSound("Sounds/"+this.soundToPlayOnClick); 
      }
      if(!this.opened){
            //open menu
            xLocalStep = ((5.32-9.5)/(bushAppearanceTime/timeStep));
            var localMovementInterval = Sup.setInterval(timeStep, function(){

                if(totalMoved > (5.32-9.5)){
                    Sup.getActor("Bush").moveX(xLocalStep);
                    totalMoved = totalMoved + xLocalStep;
                }
                else{
                    Sup.getActor("Bush").setX(5.32);
                    Sup.clearInterval(localMovementInterval);
                }
            })
            this.opened = true;
      }
      else{
          //close menu
            xLocalStep = ((9.5-5.32)/(bushAppearanceTime/timeStep));
            var localMovementInterval = Sup.setInterval(timeStep, function(){

                if(totalMoved < (9.5-5.32)){
                    Sup.getActor("Bush").moveX(xLocalStep);
                    totalMoved = totalMoved + xLocalStep;
                }
                else{
                    Sup.getActor("Bush").setX(9.5);
                    Sup.clearInterval(localMovementInterval);
                }
            })
          this.opened = false;
      }
    }
    else if(action == "hover"){
      if (!this.turnOffHoverSound){
        Sup.Audio.playSound("Sounds/"+this.soundToPlayHover); 
      }
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
Sup.registerBehavior(bushMenuButtonBehavior);

class warningButtonBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;
  turnOffOnClickSound : boolean = false;
  soundToPlayOnClick: string = "click4";
  turnOffHoverSound : boolean = false;
  soundToPlayHover: string = "plaster";
  whereToSend: string = "Menu";

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }

  mouse(action) {
    if(action == "click"){
        if (!this.turnOffOnClickSound){
            Sup.Audio.playSound("Sounds/"+this.soundToPlayOnClick); 
        }
        if(this.whereToSend == "ExitGame"){
            Sup.exit();
        }
        else{
            Sup.loadScene("Scenes/"+this.whereToSend);   
        }
    }
    else if(action == "hover"){
      if (!this.turnOffHoverSound){
        Sup.Audio.playSound("Sounds/"+this.soundToPlayHover); 
      }
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
Sup.registerBehavior(warningButtonBehavior);
