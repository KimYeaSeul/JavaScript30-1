let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds){
    clearInterval(countdown);

    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(then);
    //잘 작동안해서 안한다고..?
    // setInterval(function(){
        //     seconds--;
    // }, 1000)
    countdown = setInterval(()=>{
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if(secondsLeft < 0){
            clearInterval(countdown);
            return;
        }
    displayTimeLeft(secondsLeft);
}, 1000)
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor( seconds / 60 );
    const remainderSeconds = seconds % 60 ;
    const display = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.title =
    timerDisplay.textContent = display;
    console.log(seconds);
}

function displayEndTime(timestamp){
    const end = new Date(timestamp);
    const hour = end.getHours();
    const minutes = end.getMinutes();
    const adjustedHour = hour > 12 ? hour-12 : hour; //시간을 12시간으로 표시하기 위한 변수
    endTime.textContent=`Be Back At ${adjustedHour < 10 ? '0' : ''}${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer(){
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
    console.log(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e){
    e.preventDefault();
    const mins = this.minutes.value;
    console.log(this);
    timer(mins * 60);
    this.reset(); //input을 비워줌
});