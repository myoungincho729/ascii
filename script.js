const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const image1 = new Image();
image1.src = './img/6.jpeg';

const inputSlider = document.getElementById("resolution");
const inputLabel = document.getElementById("resolutionLabel");
inputSlider.addEventListener('change', handSlider);
class Cell {
    constructor(x, y, symbol, color){
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y);
    }
}
class AsciiEffect {
    #imageCellArray = [];
    #symbols = [];
    #pixels = [];
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height){
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
        console.log(this.#pixels.data);
    }
    #convertToSymbol(g){
        const density = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/()1{}[]?-_+~<>i!lI;:,.                                        ";
        const reversed = density.split(',').reverse().join(',');
        return reversed[Math.floor(g / 256 * density.length)];
        
    }
    #scanImage(cellSize){
        this.#imageCellArray = [];
        for (let y = 0; y < this.#pixels.height; y += cellSize){
            for (let x = 0; x < this.#pixels.width; x += cellSize){
                const posX = x * 4;
                const posY = y * 4;
                const pos = (posY * this.#pixels.width) + posX;

                if (this.#pixels.data[pos + 3] > 0){
                    const red = this.#pixels.data[pos];
                    const green = this.#pixels.data[pos+1];
                    const blue = this.#pixels.data[pos+2];
                    const total = red + green + blue;
                    const averageColorValue = total / 3;
                    const color = "rgb("+red+","+green+","+blue+")";
                    const symbol = this.#convertToSymbol(averageColorValue);
                    this.#imageCellArray.push(new Cell(x, y, symbol, color));
                }
            }
        }
        console.log(this.#imageCellArray);
    }
    #drawAscii(){
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        for (let i = 0; i < this.#imageCellArray.length; i++){
            this.#imageCellArray[i].draw(this.#ctx);
        }
    }
    draw(cellSize){
        this.#scanImage(cellSize);
        this.#drawAscii();
    }
    
}
let effect;

function handSlider(){
    if (inputSlider.value == 1){
        inputLabel.innerHTML = 'Original image';
        ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
    } else {
        inputLabel.innerHTML = 'Resolution : ' + inputSlider.value + ' px';
        effect.draw(parseInt(inputSlider.value));
        ctx.font = parseInt(inputSlider.value) * 2 + 'px Verdana';
    }
}
image1.onload = function initialize(){
    canvas.width = image1.width;
    canvas.height = image1.height;
    effect = new AsciiEffect(ctx, image1.width, image1.height);
    effect.draw(parseInt(inputSlider.value));
}