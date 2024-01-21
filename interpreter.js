let runButton  = document.getElementById('runbutton');
let inputArea  = document.getElementById('inputarea');
let outputArea = document.getElementById('outputarea');

const keywords = ['OUTPUT', 'IF', 'THEN', 'ENDIF', 'DECLARE', 'REPEAT', 'WHILE', 'FOR', 'FUNCTION', 'PROCEDURE', 'TYPE']

// FIX DECIMAL PROBLEM

runButton.addEventListener('click', function(){
    outputArea.value = "";

    stack = {
        ad_name:[], // VARIABLE NAME
        ad_data:[], // VARIABLE DATA
        ad_daty:[], // VARIABLE DATA TYPE
    }


    let dataTypes = {
        defaultDataTypes: ['INTEGER', 'STRING', 'BOOLEAN', 'REAL', 'CHARACTER'],
        userDefinedDataTypes: [],
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
                            if(code_a[j+2] == '<-') {
                                blockEnded = true;
                                postOutKeyData.push(code_a[j]);
                            }
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
                        if(code_a[j+2] == '<-'){
                            current_axis_block.push(code_a[j]);
                            blockEnded = true;
                        }
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

            if(code_a[i] == 'PROCEDURE'){
                let endProcedure = false;
                
                for(let j = i; j < code_a.length; j++){
                    i++;
                    if(code_a[j] == 'ENDPROCEDURE') endProcedure = true;
                    current_axis_block.push(code_a[j]);
                    if(endProcedure) break;
                }


                console.log(current_axis_block);
                ExecuteCode(current_axis_block);
                current_axis_block = [];
            }

            if(code_a[i] == 'FUNCTION'){
                let endFunction = false;
                
                for(let j = i; j < code_a.length; j++){
                    i++;
                    if(code_a[j] == 'ENDFUNCTION') endFunction = true;
                    current_axis_block.push(code_a[j]);
                    if(endFunction) break;
                    
                }


                console.log(current_axis_block);
                ExecuteCode(current_axis_block);
                current_axis_block = [];
            }

            if(code_a[i] == 'CALL'){
                for(let j = i; j < 2; j++){
                    i++;
                    current_axis_block.push(code_a[j]);
                    
                }

                console.log(current_axis_block);
                ExecuteCode(current_axis_block);
                current_axis_block = [];
            }
            if(code_a[i] == 'TYPE'){
                let endType = false;
                
                for(let j = i; j < code_a.length; j++){
                    i++;
                    if(code_a[j] == 'ENDTYPE') endType = true;
                    current_axis_block.push(code_a[j]);
                    if(endType) break;
                    
                }


                console.log(current_axis_block);
                ExecuteCode(current_axis_block);
                current_axis_block = [];
            }


            
            
            
        }
    
    }

    function ExecuteCode(tokens){
        let programOutput = "";

        if(tokens[0] == "OUTPUT"){
           if(tokens[1] == '"'){
                let outStringEnded = false;
                for(let i = 2; i < tokens.length; i++){
                    if(tokens[i] == '"') outStringEnded = true;
                    if(outStringEnded) break;
                    programOutput += tokens[i]
                }  
           }
           else{ // FOR VARIABLE AND ARITHMATIC
                let postOutArray = [];
                for(let i = 1; i < tokens.length; i++){
                    postOutArray.push(tokens[i]);
                }

                let variablesFound = findVariables(postOutArray.join(" "));

                if(variablesFound.length == 0){
                    programOutput += eval(postOutArray.join(' '));
                }else{
                    for(let i = 0; i < variablesFound.length; i++){
                        for(let j = 0; j < postOutArray.length; j++){
                            if(postOutArray[j] == variablesFound[i]){
                                
                                if(fetchVariableType(variablesFound[i], stack) == 'INTEGER'){
                                    postOutArray[findKeywordInArray(variablesFound[i], postOutArray)] = fetchVarValue(variablesFound[i], stack).toString();
                                }
                                else if(fetchVariableType(variablesFound[i], stack) != 'INTEGER' && fetchVariableType(variablesFound[i], stack) != 'STRING' && fetchVariableType(variablesFound[i], stack) != 'REAL'){
                                    errorHandler(2, variablesFound[i]);
                                }
                                
                            }
                        }
                    }
                    console.log(postOutArray)
                    programOutput += eval(postOutArray.join(' '));
                }

                
            }
        }

        if(tokens[0] == 'DECLARE'){
            // DECLARE myVar : INTEGER
            
            for(let i = 0; i < stack.ad_data.length; i++){
                if(tokens[1] == stack.ad_data[i]){
                    errorHandler(1, tokens[1]);
                    return;
                }
            }
            

            
            for(let i = 0; i < dataTypes.defaultDataTypes.length; i++){
                for(let j = 0; j < dataTypes.userDefinedDataTypes.length; i++){
                    if(dataTypes.userDefinedDataTypes[j] == tokens[3]){
                        stack.ad_daty.push(tokens[3]);
                        stack.ad_data.push('NULL')
                        stack.ad_name.push(tokens[1])
                        break;
                    }
                    
                
                }   
                
                
                if(dataTypes.defaultDataTypes[i] == tokens[3]){
                    stack.ad_daty.push(tokens[3]);
                    stack.ad_data.push('NULL')
                    stack.ad_name.push(tokens[1])
                    break;
                }


            }

            console.log(stack)

            

            
        }


        if(tokens[1] == '<-'){
            let variableToAssign = tokens[0];
            let dataToAssign = [];

            for(let i = 2; i < tokens.length; i++){
                dataToAssign.push(tokens[i]);
            }

            let variablesFound = findVariables(dataToAssign.join(' '));

            if(variablesFound.length == 0){
                console.log(fetchVariableType(variableToAssign, stack));
                if(fetchVariableType(variableToAssign, stack) == identifyDataType(dataToAssign.join(' '))){
                    if(fetchVariableType(variableToAssign, stack) == 'INTEGER' || fetchVariableType(variableToAssign, stack) == 'REAL'){
                        stack.ad_data[fetchVariablePositionInStack(variableToAssign, stack)] = eval(dataToAssign.join(' '));
                    }else{
                        stack.ad_data[fetchVariablePositionInStack(variableToAssign, stack)] = dataToAssign.join(' ');
                    }
                    
                }else{

                }
            }else{


                
                for(let i = 0; i < variablesFound.length; i++){
                    for(let j = 0; j < dataToAssign.length; j++){
                        if(dataToAssign[j] == variablesFound[i]){
                            if(fetchVariableType(variablesFound[i], stack) == fetchVariableType(variableToAssign, stack)){
                                console.log(true)
                                dataToAssign[findKeywordInArray(variablesFound[i], dataToAssign)] = fetchVarValue(variablesFound[i], stack);
                                console.log(dataToAssign)

                            }else{
                                // ERROR 4
                            }
                        }
                    }
                }   

                if(identifyDataType(dataToAssign.join(' ')) == 'INTEGER' || identifyDataType(dataToAssign.join(' ')) == 'REAL'){
                    stack.ad_data[fetchVariablePositionInStack(variableToAssign, stack)] = eval(dataToAssign.join(' '));
                }else{
                    stack.ad_data[fetchVariablePositionInStack(variableToAssign, stack)] = dataToAssign.join(' ');
                }
                
            }

            console.log(stack);

        }

        


        outputArea.value += programOutput;
        
    }


    function errorHandler(errorCode, furtherArguments){
        // 1 REDECLARATION - VAR ALREADY EXISTS
        // 2 VAR DOES NOT MATCH TYPE
        // 3 VARIABLE VALUE IS NULL
    }

    function findVariables(expression) {
        const variableRegex = /[A-Za-z_][A-Za-z0-9_]*/g;
    
    
        const variables = expression.match(variableRegex);
        if (variables) {
            const uniqueVariables = [...new Set(variables)];
            return uniqueVariables;
        } else {
            return [];
        }
    }


    function fetchVarValue(variable, stack){
        for(let i = 0; i < stack.ad_name.length; i++){
            if(variable == stack.ad_name[i]){
                return stack.ad_data[i];
            }
        }
    }

    function findKeywordInArray(keyword, array){
        for(let i = 0; i < array.length; i++){
            if(keyword == array[i]){
                return i;
            }
        }
    }

    function fetchVariableType(variable, stack){
        for(let i = 0; i < stack.ad_name.length; i++){
            if(variable == stack.ad_name[i]){
                return stack.ad_daty[i];
            }
        }
    }

    function fetchVariablePositionInStack(variable, stack){
        for(let i = 0; i < stack.ad_name.length; i++){
            if(variable == stack.ad_name[i]){
                return i;
            }
        }
    }

    function identifyDataType(data) {
        
        if (data === 'true' || data === 'false') {
            return 'BOOLEAN';
        }
    
        
        try {
            const result = eval(data);
    
            
            if (!isNaN(result) && result.toString().includes('.')) {
                return 'REAL';
            }
    
           
            if (!isNaN(result) && !result.toString().includes('.')) {
                return 'INTEGER';
            }
        } catch (error) {
            
        }

        if (data.length === 1) {
            return 'CHARACTER';
        }
    
    
        return 'string';
    }
    
    
    
    
    codeSorter(tokenizeInput(inputArea.value));
})