const canvas = document.getElementById("canvas_Conway");  
const context = canvas.getContext("2d");
var length = 10, size = 700, block_number=100;
canvas.width = size;
canvas.height = size;
side=size/block_number;
	
// draw square
function draw_square(x,y,f,r,g,b){
    context.beginPath();
	if(f==1){
		context.fillStyle = "rgb("+r+", "+g+", "+b+")";
        context.fillRect( x*side, y*side, side, side);
	}else if(f==0){
        context.strokeRect( x*side, y*side, side, side);
	    context.strokeStyle = "#7a7a7a";
    }else if(f==2){
        context.fillStyle = "rgba(0, 0, 0,0.5)";
        context.fillRect( x*side, y*side, side, side);
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
        arr[i].push({
            state:0,
            Gene:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            //   [       |       |               ]
            //minimum number of neighbors / Maximum number of neighbors / fatality rate
        });
        next[i].push({
            state:0,
            Gene:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        });
    }
}

function set_pattern(){
    for(var i=1;i<block_number-1;i++){
        for(var j=1;j<block_number-1;j++){
            var life=Math.floor(Math.random() * (block_number/5))
            if(life==1){
                arr[j][i].state=1;
                for(var k=0;k<16;k++){
                    arr[j][i].Gene[k]=Math.floor(Math.random() * 2);
                }
            }
        }
    }
}
// run the game with rules
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
            if(arr[i][j].state==2){
                var count_life=0;
                if(arr[i-1][j].state==0){
                    count_life++;
                }
                if(arr[i-1][j+1].state==0){
                    count_life++;
                }
                if(arr[i-1][j-1].state==0){
                    count_life++;
                }
                if(arr[i+1][j].state==0){
                    count_life++;
                }
                if(arr[i+1][j+1].state==0){
                    count_life++;
                }
                if(arr[i+1][j-1].state==0){
                    count_life++;
                }
                if(arr[i][j+1].state==0){
                    count_life++;
                }
                if(arr[i][j-1].state==0){
                    count_life++;
                }
                if(count_life>=2 ){
                    next[i][j].state=0;
                }else{
                    next[i][j].state=2;
                }
                continue;
            }
            var count_neighbors=0, gene_storage=[];
            if(arr[i-1][j].state==1){
                count_neighbors++;
                gene_storage.push(arr[i-1][j].Gene);
            }
            if(arr[i-1][j+1].state==1){
                count_neighbors++;
                gene_storage.push(arr[i-1][j+1].Gene);
            }
            if(arr[i-1][j-1].state==1){
                count_neighbors++;
                gene_storage.push(arr[i-1][j-1].Gene);
            }
            if(arr[i+1][j].state==1){
                count_neighbors++;
                gene_storage.push(arr[i+1][j].Gene);
            }
            if(arr[i+1][j+1].state==1){
                count_neighbors++;
                gene_storage.push(arr[i+1][j+1].Gene);
            }
            if(arr[i+1][j-1].state==1){
                count_neighbors++;
                gene_storage.push(arr[i+1][j-1].Gene);
            }
            if(arr[i][j+1].state==1){
                count_neighbors++;
                gene_storage.push(arr[i][j+1].Gene);
            }
            if(arr[i][j-1].state==1){
                count_neighbors++;
                gene_storage.push(arr[i][j-1].Gene);
            }
            if(/*arr[i][j].state==0 &&*/count_neighbors>=3){
                next[i][j].state=1;
                var rand = Math.floor(Math.random() * gene_storage.length);
                var gene_1=gene_storage[rand];
                gene_storage[rand]=gene_storage[gene_storage.length-1];
                rand = Math.floor(Math.random() * (gene_storage.length-1));
                var gene_2=gene_storage[rand];
                for(var l=0;l<16;l++){
                    if(Math.floor(Math.random() * 2)==0){
                        next[i][j].Gene[l]=gene_1[l];
                    }else{
                        next[i][j].Gene[l]=gene_2[l];
                    }   
                }
                if(Math.floor(Math.random() * 10000)==0){//突變
                    mutation=Math.floor(Math.random() * 16);
                    if(next[i][j].Gene[mutation]==0){
                        next[i][j].Gene[mutation]=1;
                    }else{
                        next[i][j].Gene[mutation]=0;
                    }
                }
                if(next[i][j].Gene[Math.floor(Math.random() * 8)+8]==1){//死亡
                    next[i][j].state=2;
                    next[i][j].Gene=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                }
            }
            else if(arr[i][j].state==1){
                if(count_neighbors>=(arr[i][j].Gene[0]+arr[i][j].Gene[1]+arr[i][j].Gene[2]+arr[i][j].Gene[3])/2 && count_neighbors<=4+arr[i][j].Gene[4]+arr[i][j].Gene[5]+arr[i][j].Gene[6]+arr[i][j].Gene[7]){//生存
                    next[i][j].state=1;
                    next[i][j].Gene=arr[i][j].Gene;
                }else{
                    next[i][j].state=0;
                    next[i][j].Gene=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                }
                if(Math.floor(Math.random() * 10000)==0){
                    mutation=Math.floor(Math.random() * 16);
                    if(next[i][j].Gene[mutation]==0){
                        next[i][j].Gene[mutation]=1;
                    }else{
                        next[i][j].Gene[mutation]=0;
                    }
                }
                if(next[i][j].Gene[Math.floor(Math.random() * 8)+8]==1){
                    next[i][j].state=2;
                    next[i][j].Gene=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                }
            }
            
        }
    }
}
function display_result(){
    for(var i=0;i<block_number;i++){
        for(var j=0;j<block_number;j++){
            draw_square(i,j,next[i][j].state,
                64*(4-(arr[i][j].Gene[0]+arr[i][j].Gene[1]+arr[i][j].Gene[2]+arr[i][j].Gene[3])),//r
                32*(arr[i][j].Gene[8]+arr[i][j].Gene[9]+arr[i][j].Gene[10]+arr[i][j].Gene[11]+arr[i][j].Gene[12]+arr[i][j].Gene[13]+arr[i][j].Gene[14]+arr[i][j].Gene[15]),//g
                64*(arr[i][j].Gene[4]+arr[i][j].Gene[5]+arr[i][j].Gene[6]+arr[i][j].Gene[7]));//b

        }
    }
}
function reset_pattern(){
    for(var i=0;i<block_number;i++){
        for(var j=0;j<block_number;j++){
            arr[i][j].state=next[i][j].state;
            arr[i][j].Gene=next[i][j].Gene;
            next[i][j].state=0;
            next[i][j].Gene=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        }
    }
}
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
            arr[i][j].state=0;
            next[i][j].state=0;
        }
    }
}
// start gaming
set_background();
var x=document.getElementById("play");
var running; 
x.addEventListener("click",
    function play(){
        if(x.value=="Play"){
            set_pattern();
            x.value="Restart";
            running = setInterval(run_the_game, 120/document.getElementById("speed").value*10);
        }else{
            clearInterval(running);
            clear_array();
            set_pattern();
            running = setInterval(run_the_game, 120/document.getElementById("speed").value*10);
        }
    })