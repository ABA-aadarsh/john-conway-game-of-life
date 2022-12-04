const container=document.querySelector(".container")
const gameOfLife={
    rows:30,
    columns:40,
    simulation:null,
    population:0,
    generation:0
}
let gameOfLifeArray=[]
let flag=true
const playPause=document.querySelector("#playPause")
const genVal=document.querySelector("#genVal")
const population=document.querySelector("#population")
const init=()=>{
    container.style=`
        grid-template-columns: repeat(${gameOfLife.columns},12px);
        grid-template-rows: repeat(${gameOfLife.rows},12px);
    `
    for(let r=1;r<=gameOfLife.rows;r++){
        const temp=[]
        for(let c=1;c<=gameOfLife.columns;c++){
            const box=document.createElement("div")
            box.classList.add("box",`r${r}`,`c${c}`)
            container.appendChild(box)
            temp.push(0)
        }
        gameOfLifeArray.push(temp)
    }
}
const survivalCheck=(r,c,cell)=>{
    const neighboursPosition=[
        [r-1,c-1]   ,[r-1,c],   [r-1,c+1],
        [r,c-1],                [r,c+1]  ,
        [r+1,c-1]   ,[r+1,c],   [r+1,c+1]
    ]
    let neighbour=0
    neighboursPosition.forEach(n=>{
        // n[0] represents row and n[1] represent column
        if(n[0]<1 || n[0]>gameOfLife.rows || n[1]<1 || n[1]>gameOfLife.columns){
            neighbour+=0
        }else{
            if(gameOfLifeArray[n[0]-1][n[1]-1]==1){
                neighbour+=1
            }else{
                neighbour+=0
            }
        }
    })
    // for cell alive
    if(cell==1 && neighbour>3){
        return false
    }else if( cell==1 && neighbour<2){
        return false
    }else if(cell==1 && (neighbour==2 || neighbour==3)){
        return true
    }
    // for cell dead
    else if(cell==0 && neighbour==3){
        return true
    }else{
        return false
    }
}
const updateBoxes=()=>{
    for(let r=1;r<=gameOfLife.rows;r++){
        for(let c=1;c<=gameOfLife.columns;c++){
            const box=document.querySelector(`.r${r}.c${c}`)
            if(gameOfLifeArray[r-1][c-1]==1){
                box.classList.add("bin-1")
            }else{
                box.classList.remove("bin-1")
            }
        }
    }
}
const generationUpgrade=()=>{
    const temp=JSON.parse(JSON.stringify(gameOfLifeArray))
    // above trick is done so that a clone is assigned to temp without reference..that way change in temp wont be reflected in gameofLifeArray
    
    // iteration and analysis
    for(let r=1;r<=gameOfLife.rows;r++){
        for(let c=1;c<=gameOfLife.columns;c++){
            const check=survivalCheck(r,c,gameOfLifeArray[r-1][c-1])
            if(check){
                temp[r-1][c-1]=1
            }else{
                temp[r-1][c-1]=0
            }
        }
    }
    gameOfLifeArray=temp
    updateBoxes()
    // update genVal
    gameOfLife.generation+=1
    genVal.innerHTML=gameOfLife.generation
    // update Population
    gameOfLife.population=[...document.querySelectorAll(".bin-1")].length
    population.innerHTML=gameOfLife.population
    flag=true
}
init()
const boxes=[...document.querySelectorAll(".box")]
boxes.forEach((box)=>{
    box.addEventListener("click",()=>{
        if(playPause.classList.contains("paused")){
            const row=parseInt((box.classList[1]).slice(1))
            const column=parseInt((box.classList[2]).slice(1))
            if(box.classList.contains("bin-1")){
                box.classList.remove("bin-1")
                gameOfLifeArray[row-1][column-1]=0
            }else{
                box.classList.add("bin-1")
                gameOfLifeArray[row-1][column-1]=1
            }
            gameOfLife.generation=0
            genVal.innerHTML=gameOfLife.generation
            gameOfLife.population=[...document.querySelectorAll(".bin-1")].length
            population.innerHTML=gameOfLife.population
        }
    })
})
playPause.addEventListener("click",()=>{
    if(playPause.classList.contains("paused")){
        playPause.classList.remove("paused")
        playPause.classList.add("playing")
        playPause.innerHTML="Pause"
        gameOfLife.simulation=setInterval(()=>{
            const bin1=document.querySelector(".bin-1")
            if(flag==true && bin1!=null){
                // this flag use is to make sure that one iteration don't overwrite to another
                flag=false
                generationUpgrade()
            }
        },500)
    }else{
        playPause.classList.add("paused")
        playPause.classList.remove("playing")
        playPause.innerHTML="Play"
        clearInterval(gameOfLife.simulation)
    }
})

 
/*
    To do
        1. Create Boxes with row and column no-->done
        2. Box click event-->done
        3. Iteration-->done
        4. Pause and Play-->done
        5. Styling
*/