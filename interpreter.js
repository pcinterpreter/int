let runButton  = document.getElementById('runbutton');
let inputArea  = document.getElementById('inputarea');
let outputArea = document.getElementById('outputArea');

const keywords = ['OUTPUT', 'IF', 'THEN', 'ENDIF', 'DECLARE', 'REPEAT', 'WHILE', 'FOR']

runButton.addEventListener('click', function(){
    
    let programOutput = '';

    stack = {
        ad_name:[],
        ad_data:[],
    }

    
    function tokenizeInput(input){
        var tokens = input.match(/\b\w+\b|<\-|[^\w\s]/g);
        return tokens;
    }

    function codeSorter(code_a){
        // IF A < 10 THEN OUTPUT "A IS SMALLER THAN 10"
        // FIRST  AXIS BLOCK IF A < 10
        // SECOND AXIS BLOCK OUTPUT "..."
        // THEN IT WILL INDIVIDUALLY FEED EACH AXIS BLOCK TO THE EXECUTECODE FUNCTION
        
        for(let i = 0; i < code_a.length; i++){
            let current_axis_block = [];  // STORES THE AXIS BLOCK OF THE OUTPUT KEYWORD
            
            /*
                OUTPUT BLOCK 
            
            */

            if(code_a[i] == 'OUTPUT'){
                doubleQuoteCounter = 0;   
                current_axis_block.push(code_a[i]);
                if(code_a[i+1] == '"'){
                    for(let j = i+1; j < code_a.length; j++){
                        if(doubleQuoteCounter != 2){
                            if(code_a[j] == '"') doubleQuoteCounter++;
                            current_axis_block.push(code_a[j]);
                            i++;
    
                        }else break;
                    }
                    
                    console.log(current_axis_block);
                    ExecuteCode(current_axis_block);
                    current_axis_block = [];    // RESET THE CURRENT AXIS BLOCK FOR THE NEXT KEYWORD BLOCK
                }else{                          // FOR EXAMPLE OUTPUT 1 + 1 - 2 THE OUTPUT DATA ISNT DIRECTLY A STRING, IT COULD BE ARITHMETIC OR A VARIABLE
                                                // DETECT WHERE THE OUTPUT BLOCK ENDS AND PUSH THE AXISBLOCK FOR EXECUTION
                    let postOutKeyData = [];
                    let blockEnded     = false;

                    for(let j = i+1; j < code_a.length; j++){
                        for(let k = 0; k < keywords.length; k++){
                            if(code_a[j] == keywords[k]) blockEnded = true;
                            if(blockEnded) break;
                            

                        }
                        if (blockEnded) break;
                        postOutKeyData.push(code_a[j]);
                    }
                    
                    current_axis_block = [...current_axis_block]; // MERGE BOTH ARRAYS
                    current_axis_block.push(...postOutKeyData);
                    console.log(current_axis_block);
                    ExecuteCode(current_axis_block);
                    current_axis_block = [];
                    
                }



                
            }

            // VARIABLE DECLARATION AND ASSIGNMENT

            if(code_a[i] == 'DECLARE'){
                //DECLARE variable : INTEGER/STRING/BOOLEAN/REAL
                for(let j = 0; j < 4; j++){
                    current_axis_block.push(code_a[i+j]);
                }

                console.log(current_axis_block);
                ExecuteCode(current_axis_block);
                current_axis_block = [];
            }

            if(code_a[i] == '<-'){
                
                current_axis_block.push(code_a[i-1])

                let blockEnded = false;

                for(let j = i; j < code_a.length; j++){
                    for(let k = 0; k < keywords.length; k++){
                        if(code_a[j] == keywords[k]) blockEnded = true;
                        if(blockEnded) break;
                    }

                    if(blockEnded) break;
                    current_axis_block.push(code_a[j]);

                }


                console.log(current_axis_block);
                ExecuteCode(current_axis_block);
                current_axis_block = [];
            }

            if(code_a[i] == 'IF'){
                for(let j = 0; j < code_a.length; j++){
                    i++;
                    current_axis_block.push(code_a[j]);
                    if(code_a[j] == 'ENDIF') break;
                }


                console.log(current_axis_block);
                ExecuteCode(current_axis_block);
                current_axis_block = [];
            }

            if(code_a[i] == 'REPEAT'){

                let untilFound = false;
                for(let j = i; j < code_a.length; j++){
                    i++;
                    current_axis_block.push(code_a[j]);
                    if(code_a[j] == 'UNTIL'){
                        untilFound = true; 
                        break;
                    }
                    
                    
                }

                if(untilFound){
                    let blockEnded = false;

                    for(let j = i; j < code_a.length; j++){
                        for(let k = 0; k < keywords.length; k++){
                            if(code_a[j] == keywords[k]) blockEnded = true;
                            if(blockEnded) break;
                        }
    
                        if(blockEnded) break;
                        current_axis_block.push(code_a[j]);
                    }
    
                    console.log(current_axis_block);
                    ExecuteCode(current_axis_block);
                    current_axis_block = [];
                }

                


            }

            if(code_a[i] == 'FOR'){

                let nextFound = false;

                for(let j = i; j < code_a.length; j++){
                    i++;
                    if(code_a[j] == 'NEXT') nextFound = true;
                    current_axis_block.push(code_a[j]);
                    if(nextFound) break;
                }

                if(nextFound){
                    current_axis_block.push(code_a[i]);
                    i++;
                }

                console.log(current_axis_block)
                ExecuteCode(current_axis_block);
                current_axis_block = [];
            }

            if(code_a[i] == 'WHILE'){
                let endWhileFound = false;

                for(let j = i; j < code_a.length; j++){
                    i++;
                    current_axis_block.push(code_a[j]);
                    
                    if(code_a[j] == 'ENDWHILE') endWhileFound = true;
                    if(endWhileFound) break;
                }

                console.log(current_axis_block);
                ExecuteCode(current_axis_block);
                current_axis_block = [];
            }



            
            
            
        }
    
    }

    function ExecuteCode(tokens){

    }
    
    codeSorter(tokenizeInput(inputArea.value));
})