import gsap from "gsap";
import MouseFollower from "mouse-follower";

//Mouse Interaction

MouseFollower.registerGSAP(gsap);

export default function Mouse(){

    const videoEl = document.querySelector('#showreel-video')

    const cursor = new MouseFollower({
        skewing: 0,
        skewingDeltaMax: 0.1,
        stickDelta: 0.1,
    });
    const mfMagnet = document.querySelector('.mouse-magnet');
    
    
    function playPauseMedia() {
        console.log(videoEl.muted)
        if (videoEl.muted) {
            videoEl.currentTime = 0;
            videoEl.muted = false
            videoEl.play();
            cursor.setText('Pause!');
        }else if(videoEl.paused){
            videoEl.play();
            cursor.setText('Pause!');
        }
         else {
            videoEl.pause();
            cursor.setText('Play!');
        }
      }
    
    videoEl.addEventListener('click', playPauseMedia);
    videoEl.addEventListener('mouseenter', () => {
        cursor.show();
        cursor.setText('Play!');
    });
    
    videoEl.addEventListener('mouseleave', () => {
        cursor.removeText();
    });
}

