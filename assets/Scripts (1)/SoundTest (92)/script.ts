
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
            }
            else{
              inGameMusicPlayer.play();  
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