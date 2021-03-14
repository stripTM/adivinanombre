const imagesWrap = document.querySelector(".images");
const fireworks = document.querySelector(".fireworks");
const admin = document.querySelector("#admin");
const closeButton = admin.querySelector(".close");
const okButton = admin.querySelector("input[value=ok]");
const koButton = admin.querySelector("input[value=ko]");
const undoButton = admin.querySelector("input[value=undo]");
const startButton = admin.querySelector("input[value=start]");
const resetButton = admin.querySelector("input[value=reset]");
const score = [];
const labelTotalOk = document.querySelector("#totalOk");
const labelTotalKo = document.querySelector("#totalKo");

let images = [];
let imageActive = 0;
let timeoutAutoFail = null;

const videoCountdown = document.querySelector(".countdown");
const videoEnd = document.querySelector(".end");

const clearImageInCollection = function () {
    imagesWrap.innerHTML = '';
}
// Crea 3 imágenes y las mete en la colección
const insertImageInCollection = function (src, imagesWrap) {
    let li, img;
    li = document.createElement("li");
    li.classList.add("character");
    //for (let x = 0; x < 3; x++) {
        img = document.createElement("div");
        img.classList.add("image");
        img.style.backgroundImage = `url(${src})`;
        // img.setAttribute("src", src);
        // img.setAttribute("alt", x+"Foto de personaje");

        li.appendChild(img);
        //console.log(x, img, "🌇")
    //}
    imagesWrap.appendChild(li);
}
// Cargar los vídeos del servidor
const load = function () {
    ready = false;
    fetch("api.php").then(function (response) {
        // Convert to JSON
        return response.json();
    }).then(function (res) {
        if (res && res.photos) {
            if (videoCountdown) {
                videoCountdown.src = res.videoCountdown;
                videoCountdown.classList.remove("hide");
                videoEnd.src = res.videoEnd;
                videoEnd.classList.add("hide");
            }
            // Asignar las fotos por primera vez
            photos = [];
            clearImageInCollection();
            res.photos.forEach(
                item => insertImageInCollection(item.src, imagesWrap)
            );
            images = document.querySelectorAll(".images .character");
            imageActive = 0;
            score.length = 0;
            render(imageActive);
        }
    });
}
// Cuentra atrás inicial
/*
const timeouts = [];
const startCountDown = function () {
    timeouts.forEach(timeout => window.clearInterval(timeout));
    const activate = function (n) {
        n.classList.add("show");
    }
    const numbers = document.querySelectorAll(".countdown .number");
    let startTime = 0;
    numbers.forEach(n => {
        n.classList.remove("show");
        let timeout = window.setTimeout(() => {
            activate(n);
        }, startTime);
        timeouts.push(timeout);
        startTime += 1000;
    });
}
*/
const startCountDown = function () {
    window.clearTimeout(timeoutAutoFail);
    if (videoCountdown) {
        videoEnd.classList.add("hide");
        videoEnd.pause();
        videoCountdown.classList.remove("hide");
        videoCountdown.seek = 0;
        videoCountdown.play();
    }
}


const render = function (newActive, rightFeedback) {

    if (rightFeedback === true) {
        fireworks.classList.add("ok");
    }
    if (rightFeedback === false) {
        fireworks.classList.add("ko");
    }
    window.setTimeout(
        () => {
            fireworks.classList.remove("ok", "ko");
        },
        300);
    images.forEach(
        (image, index) => {
            if (index <= newActive) {
                image.classList.add("visible");
            }
            if (index === newActive) {
                if (rightFeedback === true) {
                    image.classList.add("fromOk");
                }
                if (rightFeedback === false) {
                    image.classList.add("fromKo");
                }
            }
            if (index > newActive) {
                image.classList.remove("visible", "fromOk", "fromKo");
            }
        }
    );
    totalOk = totalKo = 0;
    score.forEach(res => {
        if (res === 'ok') {
            totalOk++;
        }
        else {
            totalKo++;
        }
    })
    labelTotalOk.textContent = totalOk;
    labelTotalKo.textContent = totalKo;
    imageActive = newActive;
}
const autoFail = function() {
    window.clearTimeout(timeoutAutoFail);
    timeoutAutoFail = window.setTimeout(ko, 3000);
}

const ok = function (e) {
    const next = imageActive + 1;
    if (next <= images.length) {
        score.push('ok');
        hideCountdownVideo();
        render(next, true);
        autoFail();
    }
    else {
        showEndVideo();
    }
}
const ko = function (e) {
    const next = imageActive + 1;
    if (next <= images.length) {
        score.push('ko');
        hideCountdownVideo();
        render(next, false);
        autoFail();
    }
    else {
        showEndVideo();
    }
}
const undo = function (e) {
    const next = imageActive - 1;
    if (next >= 0) {
        score.pop();
        render(next);
    }
}
const start = function () {
    startCountDown();
}
const reset = function () {
    startCountDown();
    load();
}
const hideCountdownVideo = function () {
    videoCountdown.classList.add("hide")
    autoFail();
}
const showEndVideo = function () {
    videoEnd.play();
    videoEnd.loop = true;
    videoEnd.classList.remove("hide")
}

videoCountdown && videoCountdown.addEventListener("ended", hideCountdownVideo );

// Formulario de administración
admin.addEventListener("submit", e => e.preventDefault());
okButton.addEventListener("click", ok);
koButton.addEventListener("click", ko);
undoButton.addEventListener("click", undo);
startButton.addEventListener("click", start);
resetButton.addEventListener("click", reset);
closeButton.addEventListener("click", (e) => admin.classList.remove("active"));

// Teclado
window.addEventListener("keydown", e => {
    switch (e.key) {
        case "o":
            ok();
            break;
        case "k":
            ko();
            break;
        case "u":
            undo();
            break;
        case "s":
            start();
            break;
        case "r":
            reset();
            break;
    }
});

reset();
