let tempo = 300;
let rodando = false;
let alertaFinal = false;

const TEMPO_INICIAL = 300;

const timer = document.getElementById("timer");
const horario = document.getElementById("horario");
const beep = document.getElementById("beep");

function atualizarHorario() {

    const agora = new Date();

    const horarioBrasil = agora.toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo"
    });

    horario.innerText = "Horário: " + horarioBrasil;
}

setInterval(atualizarHorario, 1000);

function formatarTempo(segundos) {

    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;

    return String(min).padStart(2, '0') + ':' +
           String(sec).padStart(2, '0');
}

function atualizarTela() {
    timer.innerText = formatarTempo(tempo);
}

function ativarAlertaFinal() {

    if (alertaFinal) return;

    alertaFinal = true;
    document.body.classList.add("piscando");

    try {
        beep.currentTime = 0;
        beep.play();
    } catch (e) {}
}

function limparAlertaFinal() {
    alertaFinal = false;
    document.body.classList.remove("piscando");
}

setInterval(() => {

    if (rodando && tempo > 0) {

        tempo--;
        atualizarTela();

        if (tempo > 0 && tempo <= 10 && !alertaFinal) {
            ativarAlertaFinal();
        }

        if (tempo === 0) {
            rodando = false;
        }
    }

}, 1000);

// Controle remoto Samsung

document.addEventListener('keydown', function(e) {

    switch(e.keyCode) {

        // ENTER
        case 13:
            rodando = !rodando;
            break;

        // SETA CIMA
        case 38:
            tempo += 60;
            if (tempo > 10) limparAlertaFinal();
            atualizarTela();
            break;

        // SETA BAIXO
        case 40:
            tempo = Math.max(0, tempo - 60);
            atualizarTela();
            break;

        // SETA ESQUERDA
        case 37:

            rodando = false;
            tempo = TEMPO_INICIAL;

            limparAlertaFinal();
            atualizarTela();
            break;
    }
});

atualizarTela();
atualizarHorario();
