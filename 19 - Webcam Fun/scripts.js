const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({ video : true, audio: false}) //return promise 
        .then(localMediaStream => {
            console.log(localMediaStream);
            // video.src = window.URL.createObjectURL(localMediaStream);
            video.srcObject = localMediaStream; //source is blob => 웹캠에서 원시데이터가 전송된다는 것
            video.play();
        })
        .catch(err => { // when doesn't allow webcam
            console.error(`OH NO!!!`, err);
        })
}

function paintToCanvas(){
    //실제 비디오의 가로*높이 구하기
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        //take the pixels out
        let pixels = ctx.getImageData(0,0,width,height);

        //mess with them
        // pixels = redEffect(pixels);

        // pixels = rgbSplit(pixels);
        // ctx.globalAlpah = 0.1; //ghosting effect

        pixels = greenScreen(pixels);

        //put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto(){
    //played the sound
    snap.currentTime = 0;
    snap.play();
    //take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    // console.log(data); // base64 형식으로 사진 묘사
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'yeaseul');
    // link.textContent = 'Download Image';
    link.innerHTML = `<img src = "${data}" alt = "yeaseul" />`;
    strip.insertBefore(link, strip.firstChild); //jQuery 에서는 .prepend
}

function redEffect(pixels){
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels.data[i+0] = pixels.data[i+0]+100; //red
        pixels.data[i+1] = pixels.data[i+1]-50; //green
        pixels.data[i+2] = pixels.data[i+2]*0.5; //blue
    }
    return pixels;
}

function rgbSplit(pixels){
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels.data[i-150] = pixels.data[i+0]; //red
        pixels.data[i+100] = pixels.data[i+1]; //green
        pixels.data[i-150] = pixels.data[i+2]; //blue
    }
    return pixels;
}

function greenScreen(pixels){
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas); // 비디오가 canplay상황이 되면 paintToCanvas 불러옴