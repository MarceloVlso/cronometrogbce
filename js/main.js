let tempoConfigurado = 300;
let tempo = tempoConfigurado;

let rodando = false;
let modoAtual = "treino";

let beep10Tocado = false;
let alertaFinal = false;

let intervaloAposFinal = null;
let pararLoopBeep = null;

const TEMPO_INTERVALO = 60;

const timer = document.getElementById("timer");
const horario = document.getElementById("horario");
const modo = document.getElementById("modo");
const beep = document.getElementById("beep");

function atualizarHorario() {
    const agora = new Date();

    const horarioBrasil = agora.toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo"
    });

    horario.innerText = "Horário: " + horarioBrasil;
}

function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;

    return String(min).padStart(2, "0") + ":" +
           String(sec).padStart(2, "0");
}

function atualizarTela() {
    timer.innerText = formatarTempo(tempo);
    modo.innerText = modoAtual === "treino" ? "TREINO" : "INTERVALO";
}

function tocarBeepUmaVez() {
    try {
        beep.loop = false;
        beep.pause();
        beep.currentTime = 0;
        beep.play().catch(() => {});
    } catch (e) {}
}

function tocarBeepLoopPor3Segundos() {
    try {
        beep.loop = true;
        beep.pause();
        beep.currentTime = 0;
        beep.play().catch(() => {});

        clearTimeout(pararLoopBeep);

        pararLoopBeep = setTimeout(() => {
            beep.pause();
            beep.loop = false;
            beep.currentTime = 0;
        }, 3000);

    } catch (e) {}
}

function desbloquearAudio() {
    try {
        beep.play()
            .then(() => {
                beep.pause();
                beep.currentTime = 0;
            })
            .catch(() => {});
    } catch (e) {}
}

function ativarAlertaFinal() {
    alertaFinal = true;
    document.body.classList.add("piscando");
}

function limparAlertaFinal() {
    alertaFinal = false;
    document.body.classList.remove("piscando");
}

function limparTimersAutomaticos() {
    clearTimeout(intervaloAposFinal);
    clearTimeout(pararLoopBeep);

    intervaloAposFinal = null;
    pararLoopBeep = null;

    try {
        beep.pause();
        beep.loop = false;
        beep.currentTime = 0;
    } catch (e) {}
}

function finalizarTempo() {
    rodando = false;

    ativarAlertaFinal();
    tocarBeepLoopPor3Segundos();

    if (modoAtual === "treino") {
        intervaloAposFinal = setTimeout(() => {
            iniciarIntervaloAutomatico();
        }, 10000);
    }

    if (modoAtual === "intervalo") {
        resetarParaTreino();
    }
}

function iniciarIntervaloAutomatico() {
    limparAlertaFinal();

    modoAtual = "intervalo";
    tempo = TEMPO_INTERVALO;
    rodando = true;
    beep10Tocado = false;

    document.body.classList.add("intervalo");

    atualizarTela();
}

function resetarParaTreino() {
    limparTimersAutomaticos();
    limparAlertaFinal();

    modoAtual = "treino";
    tempo = tempoConfigurado;
    rodando = false;
    beep10Tocado = false;

    document.body.classList.remove("intervalo");

    atualizarTela();
}

function alternarStartPause() {
    desbloquearAudio();

    if (alertaFinal) {
        limparTimersAutomaticos();
        limparAlertaFinal();

        if (modoAtual === "treino") {
            tempo = tempoConfigurado;
        }

        if (modoAtual === "intervalo") {
            resetarParaTreino();
            return;
        }
    }

    rodando = !rodando;
}

function aumentarTempo() {
    if (modoAtual !== "treino") return;

    limparTimersAutomaticos();
    limparAlertaFinal();

    tempoConfigurado += 60;
    tempo = tempoConfigurado;
    beep10Tocado = false;

    atualizarTela();
}

function diminuirTempo() {
    if (modoAtual !== "treino") return;

    limparTimersAutomaticos();
    limparAlertaFinal();

    tempoConfigurado = Math.max(60, tempoConfigurado - 60);
    tempo = tempoConfigurado;
    beep10Tocado = false;

    atualizarTela();
}

setInterval(() => {
    if (!rodando || tempo <= 0) return;

    tempo--;
    atualizarTela();

    if (tempo === 10 && !beep10Tocado) {
        beep10Tocado = true;
        tocarBeepUmaVez();
    }

    if (tempo === 0) {
        finalizarTempo();
    }

}, 1000);

document.addEventListener("keydown", function(e) {
    switch(e.keyCode) {

        // ENTER
        case 13:
            alternarStartPause();
            break;

        // SETA CIMA
        case 38:
            aumentarTempo();
            break;

        // SETA BAIXO
        case 40:
            diminuirTempo();
            break;

        // SETA ESQUERDA
        case 37:
            resetarParaTreino();
            break;
    }
});

window.onload = function() {
    atualizarTela();
    atualizarHorario();

    window.focus();
    document.body.focus();
};

setInterval(atualizarHorario, 1000);