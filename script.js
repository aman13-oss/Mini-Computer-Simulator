function convertBinary(){
    let binary=document.getElementById("binaryInput").value;
    let decimal=parseInt(binary,2)
    document.getElementById("decimalResult").innerText="Decimal: "+ decimal; 
}

function convertDecimal(){
    let decimal=Number(document.getElementById("decimalInput").value);
    let binary=decimal.toString(2)
    document.getElementById("binaryResult").innerText="Binary: "+ binary;
}

function addBinary(){
    let a = document.getElementById("binaryA").value;
    let b = document.getElementById("binaryB").value;

    let decimalA=parseInt(a,2);
    let decimalB= parseInt(b,2);
    
    let sum= decimalA+decimalB;
    let binaryResult=sum.toString(2);

    document.getElementById("additionResult").innerText="Result: "+ binaryResult;
}

function runAlu(){
    
    let a = document.getElementById("aluA").value;
    let b = document.getElementById("aluB").value;

    updateRegister("R1", a);
    updateRegister("R2", b);

    let decimalA=parseInt(registers.R1,2);
    let decimalB=parseInt(registers.R2,2);

    let operations=document.getElementById("operations").value;

    let result;

    if(operations === "ADD"){
        result = decimalA + decimalB;

    } else if(operations === "SUB"){
        result = decimalA - decimalB;

    } else if(operations === "AND"){
        result = decimalA & decimalB;

    } else if(operations === "OR"){
        result = decimalA | decimalB;

    } else if(operations === "XOR"){
        result = decimalA ^ decimalB;
    }
    else if (operations=="NOT"){
    let binary=decimalA.toString(2).padStart(4,"0");

    let noResult="";

    for(let bit of binary){
        if(bit=="0"){
            noResult +="1";
        }else{
            noResult +="0";
        }
    }

    updateRegister("R3", noResult);

    document.getElementById("executeResult").innerText =
        "Result: "+ noResult;

    return;
    }
    
    let binaryResult = result.toString(2).padStart(4, "0");
    updateRegister("R3", binaryResult);
    document.getElementById("executeResult").innerText ="Result: " + binaryResult;}

let registers={
    RO:"0000",
    R1:"0000",
    R2:"0000",
    R3:"0000"
};

function updateRegister(registerName , value){
    registers[registerName]=value;
    document.getElementById(registerName).innerText=value;
}

function loadRegister(){
    let registerName=document.getElementById("registerSelect").value;
    let value=document.getElementById("registerValue").value;

    if(value.length != 4){
        alert("please Enter a 4-bit binary number: ");
        return;
    }
    updateRegister(registerName,value)
}