const canvas = document.getElementById("canvas_Conway");  
const context = canvas.getContext("2d");

var length = 10, size = 520, block_number=52;
canvas.width = size;
canvas.height = size;
	
// draw square
function draw_square(x,y,f){
    context.beginPath();
	if(f==1){
		context.fillStyle = "#000000";
        context.fillRect( x*10, y*10, length, length);
	}else{
        context.strokeRect( x*10, y*10, length, length);
	    context.strokeStyle = "#7a7a7a";
    }
    context.closePath();
}
// set bacground
function set_background(){
    for(var i=1;i<block_number-1;i++){
	    for(var j=1;j<block_number-1;j++){
		    draw_square(i,j,0);
	    }	
    }	
}

// set individuals
var arr = [], next = [];

for (var i = 0; i < block_number; i++) {
    arr[i] = [];
    next[i] = [];
}
for (var i = 0; i < block_number; i++) {
    for (var j = 0; j < block_number; j++) {
        arr[i].push(0);
        next[i].push(0);
    }
}
//set pattern 在這裡設定初始圖案!!!
function set_table(){
    var string="";
    for(var i=1;i<block_number-1;i++){
        for(var j=1;j<block_number-1;j++){
            string=string+'<input type="checkbox" style="width:10px ; height:10px; margin:0px" id="'+i+','+j+'">';
        }
        string=string+"<br>";
    }
    document.getElementById("original_table").innerHTML=string;
}
set_table();

function set_pattern(){
    var string="";
    for(var i=1;i<block_number-1;i++){
        for(var j=1;j<block_number-1;j++){
            if(document.getElementById(i+','+j).checked == true){
                arr[j][i]=1;
            }
        }
    }
}
// run the game with those rules
/*
每個細胞有兩種狀態 - 存活或死亡，每個細胞與以自身為中心的周圍八格細胞產生互動（如圖，黑色為存活，白色為死亡）
當前細胞為存活狀態時，當周圍的存活細胞低於2個時（不包含2個），該細胞變成死亡狀態。（模擬生命數量稀少）
當前細胞為存活狀態時，當周圍有2個或3個存活細胞時，該細胞保持原樣。
當前細胞為存活狀態時，當周圍有超過3個存活細胞時，該細胞變成死亡狀態。（模擬生命數量過多）
當前細胞為死亡狀態時，當周圍有3個存活細胞時，該細胞變成存活狀態。（模擬繁殖）
*/
function rules(){
    for(var i=1;i<block_number-1;i++){
        for(var j=1;j<block_number-1;j++){
            var count_neighbors=0;
            if(arr[i-1][j]==1){count_neighbors++;}
            if(arr[i-1][j+1]==1){count_neighbors++;}
            if(arr[i-1][j-1]==1){count_neighbors++;}
            if(arr[i+1][j]==1){count_neighbors++;}
            if(arr[i+1][j+1]==1){count_neighbors++;}
            if(arr[i+1][j-1]==1){count_neighbors++;}
            if(arr[i][j+1]==1){count_neighbors++;}
            if(arr[i][j-1]==1){count_neighbors++;}
            switch(count_neighbors){
                case 2:
                    if(arr[i][j]==1){
                        next[i][j]=1;
                    }
                break;
                case 3:
                    next[i][j]=1;
                break;
                default:
                    next[i][j]=0;  
                break;
            }
        }
    }
}
function display_result(){
    for(var i=0;i<block_number;i++){
        for(var j=0;j<block_number;j++){
            if(next[i][j]==1){
                draw_square(i,j,1);
            }
        }
    }
}
function reset_pattern(){
    for(var i=0;i<block_number;i++){
        for(var j=0;j<block_number;j++){
            arr[i][j]=next[i][j];
            next[i][j]=0;
        }
    }
}
set_pattern();
set_background();
function run_the_game(){
    context.clearRect(0,0,size,size);
    set_background();
    rules();
    display_result();
    reset_pattern();
}
function clear_array(){
    for(var i=0;i<block_number;i++){
        for(var j=0;j<block_number;j++){
            arr[i][j];
            next[i][j]=0;
        }
    }
}
// start gaming
var x=document.getElementById("play");
var running; 
x.addEventListener("click",
    function play(){
        if(x.value=="Play"){
            set_pattern();
            running = setInterval(run_the_game, 120/document.getElementById("speed").value*10);
        }else{
            clearInterval(running);
            clear_array();
            set_pattern();
            running = setInterval(run_the_game, 120/document.getElementById("speed").value*10);
        }
    })