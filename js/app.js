const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const modeBtn = document.getElementById("mode-btn");
const clearBtn = document.getElementById("clear-btn");
const eraseBtn = document.getElementById("eraser-btn");
const colorOptions = Array.from(document.getElementsByClassName("color-option"));
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";
let isPainting = false;
let isFilling = false;


function drawColorChange(color){
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function toggleFillingState(fillFlag){
    if(fillFlag){
        isFilling = false;
        modeBtn.innerText = "Fill";
    }else{
        isFilling = true;
        modeBtn.innerText = "Draw";
    }
}

function onMove(event){
    if(isPainting == true){
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }

    ctx.moveTo(event.offsetX, event.offsetY);
}

function onStartPainting(){
    if(isFilling){
        return;
    }

    isPainting = true;
}

function onEndlPainting(){
    isPainting = false;

    // 모든 라인은 같은 Path로 시작하기에 끊어줘야 함
    ctx.beginPath();
}

function onCanvasClick(){
    if(isFilling){
        ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    }
}

function onLineWidthChange(event){
    ctx.lineWidth = event.target.value;
}

function onColorChange(event){
    drawColorChange(event.target.value);
}

function onColorClick(event){
    const colorValue = event.target.dataset.color;
    drawColorChange(colorValue);
    color.value = colorValue;
}

function onModeClick(event){
    toggleFillingState(isFilling);
}

function onClearClick(){
    const tempFillStyle = ctx.fillStyle;
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    ctx.fillStyle = tempFillStyle;
}

function onEraserClick(){
    ctx.strokeStyle = "white";
    toggleFillingState(true);
}

function onFileChange(event){
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;

    // 다른 방식의 event listener
    image.onload = function(){
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );
        fileInput.value = null;
    }
}

function onDoubleClick(event){
    const text = textInput.value;
    if(text === ""){
        return;
    }

    ctx.save();
    ctx.lineWidth = 1;

    // 폰트 사이즈와 폰트 패밀리를 설정
    ctx.font = "48px serif";
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
}

function onSaveClick(event){
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "drawing.png";
    a.click();
}

canvas.addEventListener("dblclick",onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", onStartPainting);
canvas.addEventListener("mouseup", onEndlPainting);
canvas.addEventListener("mouseleave", onEndlPainting);
canvas.addEventListener("click", onCanvasClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach(color => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
clearBtn.addEventListener("click", onClearClick);
eraseBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);