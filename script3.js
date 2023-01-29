window.addEventListener('resize', function() {
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth/2;
    canvas.height = window.innerHeight/1.2;
    updateLine();
  });
  
let id = 0;
var canvas = document.getElementById("canvas");
canvas.height = window.innerHeight/1.2;
canvas.width = window.innerWidth / 2;
var ctx = canvas.getContext("2d");
function Line(startx, starty, endx,endy){

    ctx.beginPath();
    ctx.moveTo(startx, starty);
    ctx.lineTo(endx, endy);
    ctx.stroke();
}
function drawLine(first, index, update) {
    let length;
    if(update == false){
        length = index+1;

    }else {
        length = ConnectedClasses.length;
        index = 0
    }
    if(ConnectedClasses.length != 0)
    {
        for(let i = index; i < length; i++){
            if(ConnectedClasses[i].length == 4){

            if((ConnectedClasses[i][1]== "right" && ConnectedClasses[i][3] == "left")){
                    start = ConnectedClasses[i][0].right.getBoundingClientRect(); 
                    end = ConnectedClasses[i][2].left.getBoundingClientRect(); 
                    Line(start.x, start.y, end.x, end.y);
                    if(first == true && i == index){
                    ConnectedClasses[i][0].addMultiRight()
                    ConnectedClasses[i][2].addMultiLeft()
                    first = false;
                }
                }
            else if(ConnectedClasses[i][1]== "left" && ConnectedClasses[i][3]=="right"){
                start = ConnectedClasses[i][0].left.getBoundingClientRect(); 
                end = ConnectedClasses[i][2].right.getBoundingClientRect(); 
                Line(start.x, start.y, end.x, end.y);
                    if(first == true && i == index){
                    ConnectedClasses[i][0].addMultiLeft()
                    ConnectedClasses[i][2].addMultiRight()
                    first = false;
                }
            }
            else if(ConnectedClasses[i][1]== "left" && ConnectedClasses[i][3] == "left"){
                start = ConnectedClasses[i][0].left.getBoundingClientRect(); 
                end = ConnectedClasses[i][2].left.getBoundingClientRect(); 
                Line(start.x, start.y, end.x, end.y);
                    if(first == true && i == index){
                    ConnectedClasses[i][0].addMultiLeft()
                    ConnectedClasses[i][2].addMultiLeft()
                    first = false;
                }

            }
            else{ 
                start = ConnectedClasses[i][0].right.getBoundingClientRect(); 
                end = ConnectedClasses[i][2].right.getBoundingClientRect(); 
                Line(start.x, start.y, end.x, end.y);
                    if(first == true && i == index){
                    ConnectedClasses[i][0].addMultiRight()
                    ConnectedClasses[i][2].addMultiRight()
                        first = false;
                }

            }
            }
        }

    }
}

function updateLine() {

    if(ConnectedClasses.length != 0){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let first = false;
    drawLine(first, 0, true);
}
}

let ConnectedClasses = [];
function addConnections(obj, pos) {
            if(ConnectedClasses.length == 0)
            {
                ConnectedClasses.push([obj]);
                ConnectedClasses[0].push(pos);

            }
            else {
                for(let i = 0; i < ConnectedClasses.length; i++){
                    if(ConnectedClasses[i].length == 2 && ConnectedClasses[i][0].id != obj.id){
                        ConnectedClasses[i].push(obj)
                        ConnectedClasses[i].push(pos)
                        let first = true;
                        drawLine(first,i, false);
                        return;
                    }
                }
                ConnectedClasses.push([obj]);
                ConnectedClasses[ConnectedClasses.length-1].push(pos);
            }
}
function findIndex(objId, position){

    for(let i = 0; i < ConnectedClasses.length; i++) {
        for(let j = 0; j < ConnectedClasses[i].length; j+=2){
            if(ConnectedClasses[i][j].id == objId && ConnectedClasses[i][j+1] == position){
                return i;
            }
        }
}
    return -1;
}
function removeConnections(objId, position) {
let index = findIndex(objId, position);
let other;
if (index !== -1) {
    if(ConnectedClasses[index].length == 4){
        let i;
    for(i = 0; i < 4; i = i + 2){
        if(ConnectedClasses[index][i].id == objId && ConnectedClasses[index][i+1] == position)
        {
            if(i == 0)
                other = 2;
            else
                other = 0;
            break;
        }
    }

            if(ConnectedClasses[index][other+1] == "right"){
                ConnectedClasses[index][other].right.style.backgroundColor = "red";
                ConnectedClasses[index][other].multRight.remove();

                ConnectedClasses[index][i].multLeft.remove();
            }
            else{
            ConnectedClasses[index][other].left.style.backgroundColor = "red";
            ConnectedClasses[index][other].multLeft.remove();

            ConnectedClasses[index][i].multRight.remove();
            }
}
    ConnectedClasses.splice(index, 1);
    updateLine();
}

}
class DraggableDiv {
    constructor() {
        this.div = document.createElement("div");
        this.id = id++;
        this.collection = {};
        this.connectedRight = false;
        this.connectedLeft = false;
        console.log(this.id);
        this.div.classList.add("draggable");
        this.input = document.createElement("input");
        this.input.classList.add("className");
        this.input.setAttribute("placeholder", "Class Name");
        this.br = document.createElement("br");
        this.textarea = document.createElement("textarea");
        this.textarea.classList.add("classAttributes");
        this.textarea.setAttribute("placeholder", "Attributes");
        this.left = document.createElement("div");
        this.left.classList.add("circle");
        this.left.classList.add("left-point");
        this.left.style.backgroundColor = "red"
        this.right = document.createElement("div");
        this.right.classList.add("circle");
        this.right.classList.add("right-point");
        this.right.style.backgroundColor = "red"
        this.right.classList.add("right-point");
        this.div.appendChild(this.input);
        this.div.appendChild(this.textarea);
        this.div.appendChild(this.left);
        this.div.appendChild(this.right);
        this.right.addEventListener("click", this._handleConnectionRight.bind(this));
        this.left.addEventListener("click", this._handleConnectionLeft.bind(this));
        this.div.addEventListener("mousedown", this._dragInit.bind(this));

        this.div.style.left = "50px";
        this.div.style.top = "100px";
        document.body.appendChild(this.div);
    }


    _handleConnectionRight(e){
        if(this.right.style.backgroundColor == "green"){
            this.right.style.backgroundColor = "red";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.connectedRight = false;
            removeConnections(this.id, "right");
        }
        else{
            this.right.style.backgroundColor = "green";
            this.connectedRight = true;
            addConnections(this, "right")
        }

        console.log(ConnectedClasses)
    }
    _handleConnectionLeft(e){
        if(this.left.style.backgroundColor == "green"){
            this.left.style.backgroundColor = "red";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.connectedLeft = false;
            removeConnections(this.id,"left")
        }
        else
        {
            this.left.style.backgroundColor = "green";
            this.connectedLeft = true;
            addConnections(this, "left")
        }
        console.log(ConnectedClasses)
    }
    _dragInit(e) {
        this.selected = true;
        this.x_elem = e.clientX - this.div.offsetLeft;
        this.y_elem = e.clientY - this.div.offsetTop;
        document.addEventListener("mousemove", this._moveElem.bind(this));
        document.addEventListener("mouseup", this._destroy.bind(this));
    }

    _moveElem(e) {
        if(this.selected){
          this.div.style.left = (e.clientX - this.x_elem) + "px";
          this.div.style.top = (e.clientY - this.y_elem) + "px";
        updateLine();
        }
    }
    addMultiRight() {
            this.multRight = document.createElement("input");
            this.multRight.classList.add("mult");
            this.multRight.classList.add("right-mult");
            this.div.appendChild(this.multRight);
            document.body.appendChild(this.div);
    }

    addMultiLeft() {
            this.multLeft = document.createElement("input");
            this.multLeft.classList.add("mult");
            this.multLeft.classList.add("left-mult");
            this.div.appendChild(this.multLeft);
            document.body.appendChild(this.div);
    }

    removeMultiRight() {
      this.multRight.remove();
    }
    removeMultiLeft() {
      this.multLeft.remove();
    }
    _destroy() {
        this.selected = false;
    }

    getInput() {
        return this.input.value;
    }

    getTextArea() {
        return this.textarea.value;
    }
    getMultiplicity(p) {
        if(p == "right")
        return this.multRight.value;
        else
            return this.multLeft.value;
    }

    createCollection() {

        let attributes = this.textarea.value;
        let rawAttr= attributes.split("\n");

        let attrss = [];
        let types = [];
        rawAttr.forEach(atr=>{
            let attrName= atr.split(':')[0];

            if (attrName.charAt(0) === '+' || attrName.charAt(0) === '-' || attrName.charAt(0) === '#' ) {
            attrName = attrName.substring(1);
            }
            attrss.push(attrName);
            types.push(atr.split(':')[1]);


        });


        for(let i = 0; i < attrss.length; i++){
                this.collection[attrss[i]] = types[i];
        }
    }

}

var divs = [];
var createDivButton = document.getElementById("createDiv");
createDivButton.addEventListener("click", function() {
    var div = new DraggableDiv();
    divs.push(div);
});


let Query = "";
function query(relationtype,i){
    let Col1 ={};
    let Col0 = {};
    if(relationtype == "manytomany"){
    Col1[ConnectedClasses[i][2].getInput()] =[ConnectedClasses[i][2].collection];
    Col0[ConnectedClasses[i][0].getInput()] =[ConnectedClasses[i][0].collection];
    }
    else if(relationtype == "manytoone"){
    Col1[ConnectedClasses[i][2].getInput()] =ConnectedClasses[i][2].collection;
    Col0[ConnectedClasses[i][0].getInput()] =[ConnectedClasses[i][0].collection];

    }else if(relationtype == "onetomany"){

    Col1[ConnectedClasses[i][2].getInput()] =[ConnectedClasses[i][2].collection];
    Col0[ConnectedClasses[i][0].getInput()] =ConnectedClasses[i][0].collection;
    }
    else {
    Col1[ConnectedClasses[i][2].getInput()] =ConnectedClasses[i][2].collection;
    Col0[ConnectedClasses[i][0].getInput()] =ConnectedClasses[i][0].collection;

    }

    let embed0 = {...ConnectedClasses[i][0].collection,...Col1};
    let embed1 = {...ConnectedClasses[i][2].collection,...Col0};
    
    ConnectedClasses[i][0].collection = embed0;
    ConnectedClasses[i][2].collection = embed1;
    let firstCollection = JSON.stringify(embed0);
    let secondCollection = JSON.stringify(embed1);


    if(ConnectedClasses[i][0].connectedLeft == true && ConnectedClasses[i][0].connectedRight == true)
    {
    Query = `db.${ConnectedClasses[i][0].getInput()}.insertOne({${firstCollection}})`;
    }
    else if(ConnectedClasses[i][2].connectedLeft == true && ConnectedClasses[i][2].connectedRight == true)
    {Query = `db.${ConnectedClasses[i][2].getInput()}.insertOne({${secondCollection}})`;
}
else {
    Query = `db.${ConnectedClasses[i][0].getInput()}.insertOne({${firstCollection}})\ndb.${ConnectedClasses[i][2].getInput()}.insertOne({${secondCollection}})`;
}
}

const textarea = document.getElementById("queryArea");
const clearBtn = document.getElementById("clear-btn");

clearBtn.addEventListener("click", () => {
    textarea.value = "";
});
var extractButton = document.getElementById("extractInfo");
extractButton.addEventListener("click", function() {
    
    for(let i = 0; i < ConnectedClasses.length; i++)
    {
        ConnectedClasses[i][0].collection = {}
        ConnectedClasses[i][2].collection = {}
    }
    for(let i = 0; i < ConnectedClasses.length; i++){
        if(Object.keys(ConnectedClasses[i][0].collection).length == 0)
            ConnectedClasses[i][0].createCollection();
        if(Object.keys(ConnectedClasses[i][2].collection).length == 0)
            ConnectedClasses[i][2].createCollection();
    if(ConnectedClasses[i][0].getMultiplicity(ConnectedClasses[i][1]) == "1" && ConnectedClasses[i][2].getMultiplicity(ConnectedClasses[i][3]) == "1"){
        query("onetoone", i);

    }
    else if(ConnectedClasses[i][0].getMultiplicity(ConnectedClasses[i][1]) == "*" && ConnectedClasses[i][2].getMultiplicity(ConnectedClasses[i][3]) == "1"){


        query("manytoone", i);

    }
    else if(ConnectedClasses[i][0].getMultiplicity(ConnectedClasses[i][1]) == "1" && ConnectedClasses[i][2].getMultiplicity(ConnectedClasses[i][3]) == "*"){

        query("onetomany", i);

    }
    else if(ConnectedClasses[i][0].getMultiplicity(ConnectedClasses[i][1]) == "*" && ConnectedClasses[i][2].getMultiplicity(ConnectedClasses[i][3]) == "*"){

        query("manytomany", i);

    }
} 

    textarea.value += "\n" + Query;
    Count = ConnectedClasses.length;
});