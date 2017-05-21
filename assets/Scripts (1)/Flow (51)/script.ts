
var Music = 1;
var AllMusics=2;
let inGameMusicPlayer = new Sup.Audio.SoundPlayer("Sounds/Music"+Music, 1.0);

class SoundButtonBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;

  isPlayButton : boolean = false;
  isNextButton : boolean = false;
  isPreviousButton : boolean = false;

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
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
  soundToPlayOnClick: string = "Toc";
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

class charChoiceButtonBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;
  turnOffOnClickSound : boolean = false;
  soundToPlayOnClick: string = "Toc";
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
  soundToPlayOnClick: string = "Toc";
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
            xLocalStep = ((5.32-9.5)/(60*bushAppearanceTime/1000));
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
            xLocalStep = ((9.5-5.32)/(60*bushAppearanceTime/1000));
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
  soundToPlayOnClick: string = "Toc";
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
