// Binary to Decimal

function convertBinary() {
    let binary = document.getElementById("binaryInput").value;
    let decimal = parseInt(binary, 2);

    document.getElementById("decimalResult").innerText =
        "Decimal: " + decimal;
}


// Decimal to Binary

function convertDecimal() {
    let decimal = Number(
        document.getElementById("decimalInput").value
    );

    let binary = decimal.toString(2);

    document.getElementById("binaryResult").innerText =
        "Binary: " + binary;
}


// Binary Addition

function addBinary() {
    let a = document.getElementById("binaryA").value;
    let b = document.getElementById("binaryB").value;

    let decimalA = parseInt(a, 2);
    let decimalB = parseInt(b, 2);

    let sum = decimalA + decimalB;

    let binaryResult = sum.toString(2);

    document.getElementById("additionResult").innerText =
        "Result: " + binaryResult;
}


// CPU State

let registers = {
    RO: "0000",
    R1: "0000",
    R2: "0000",
    R3: "0000"
};

let PC = 0;
let IR = "";
let programMemory = [];


// RAM

memory = {
    0: "0000",
    1: "0000",
    2: "0000",
    3: "0000",
    4: "0000",
    5: "0000",
    6: "0000",
    7: "0000"
};

cache = {};
cacheHit = 0;
cacheMiss = 0;

document.getElementById("cacheHit").innerText = "0";
document.getElementById("cacheMiss").innerText = "0";
document.getElementById("cacheStatus").innerText = "IDLE";
document.getElementById("cacheDisplay").innerText = "Empty";


// Register Update

function updateRegister(registerName, value) {

    registers[registerName] = value;

    document.getElementById(registerName).innerText = value;
}


// Load Register

function loadRegister() {

    let registerName =
        document.getElementById("registerSelect").value;

    let value =
        document.getElementById("registerValue").value;

    if (value.length != 4) {

        alert("Please enter a 4-bit binary number");

        return;
    }

    updateRegister(registerName, value);
}


// RAM Update

function updateMemory(address, value) {

    memory[address] = value;

    document.getElementById(
        "memory-" + address
    ).innerText = value;
}

function readMemory(address) {

    if (cache[address] !== undefined) {

        cacheHit++;

        document.getElementById("cacheHit").innerText =
            cacheHit;

        document.getElementById("cacheStatus").innerText =
            "CACHE HIT";

        document.getElementById("cacheDisplay").innerText =
            "Address " + address + " = " + cache[address];

        return cache[address];
    }

    cacheMiss++;

    cache[address] = memory[address];

    document.getElementById("cacheMiss").innerText =
        cacheMiss;

    document.getElementById("cacheStatus").innerText =
        "CACHE MISS";

    document.getElementById("cacheDisplay").innerText =
        "Address " + address + " = " + cache[address];

    return cache[address];
}


// ALU

function runAlu() {

    let a =
        document.getElementById("aluA").value;

    let b =
        document.getElementById("aluB").value;

    updateRegister("R1", a);
    updateRegister("R2", b);

    let decimalA =
        parseInt(registers.R1, 2);

    let decimalB =
        parseInt(registers.R2, 2);

    let operation =
        document.getElementById("operations").value;

    let result;


    if (operation === "ADD") {

        result = decimalA + decimalB;
    }

    else if (operation === "SUB") {

        result = decimalA - decimalB;
    }

    else if (operation === "AND") {

        result = decimalA & decimalB;
    }

    else if (operation === "OR") {

        result = decimalA | decimalB;
    }

    else if (operation === "XOR") {

        result = decimalA ^ decimalB;
    }

    else if (operation === "NOT") {

        let binary =
            decimalA.toString(2).padStart(4, "0");

        let noResult = "";

        for (let bit of binary) {

            if (bit === "0") {
                noResult += "1";
            }

            else {
                noResult += "0";
            }
        }

        updateRegister("R3", noResult);

        document.getElementById("executeResult").innerText =
            "Result: " + noResult;

        return;
    }

    let binaryResult =
        result.toString(2).padStart(4, "0");

    updateRegister("R3", binaryResult);

    document.getElementById("executeResult").innerText =
        "Result: " + binaryResult;
}


// Load Program

function loadProgram() {

    let program =
        document.getElementById("programInput").value;

    programMemory = program
        .split("\n")
        .map(instruction => instruction.trim())
        .filter(instruction => instruction !== "");

    PC = 0;
    IR = "";

    document.getElementById("programCounter").innerText =
        PC;

    document.getElementById("instructionRegister").innerText =
        "---";

    document.getElementById("programOutput").innerText =
        "Program loaded successfully!";
}


// Fetch

function fetchInstruction() {

    if (PC >= programMemory.length) {

        IR = "";

        return false;
    }

    IR = programMemory[PC];

    document.getElementById(
        "instructionRegister"
    ).innerText = IR;

    return true;
}


// Decode

function decodeInstruction(instruction) {

    let parts =
        instruction.split(" ");

    let operation =
        parts[0];

    let operands =
        parts.slice(1);

    return {
        operation: operation,
        operands: operands
    };
}


// Execute

function executeDecodedInstruction(decoded) {

    let operation =
        decoded.operation;

    let operands =
        decoded.operands;

    operands =
        operands.map(
            item => item.replace(",", "")
        );


    // LOADI

    if (operation === "LOADI") {

        let registerName =
            operands[0];

        let value =
            operands[1];

        updateRegister(
            registerName,
            value
        );

        document.getElementById(
            "programOutput"
        ).innerText =
            "LOADI executed -> " +
            registerName +
            " = " +
            value;
    }


    // LOAD

    else if (operation === "LOAD") {

        let registerName =
            operands[0];

        let address =
            Number(operands[1]);

        let value =
            readMemory(address);

        updateRegister(
            registerName,
            value
        );

        document.getElementById(
            "programOutput"
        ).innerText =
            "LOAD executed -> " +
            registerName +
            " = Memory[" +
            address +
            "] = " +
            value;
    }


    // STORE

    else if (operation === "STORE") {

        let registerName =
            operands[0];

        let address =
            Number(operands[1]);

        let value =
            registers[registerName];

        updateMemory(
            address,
            value
        );

        document.getElementById(
            "programOutput"
        ).innerText =
            "STORE executed -> Memory[" +
            address +
            "] = " +
            value;
    }


    // MOV

    else if (operation === "MOV") {

        let destination =
            operands[0];

        let source =
            operands[1];

        let value =
            registers[source];

        updateRegister(
            destination,
            value
        );

        document.getElementById(
            "programOutput"
        ).innerText =
            "MOV executed -> " +
            destination +
            " = " +
            value;
    }


    // ALU Instructions

    else if (
        operation === "ADD" ||
        operation === "SUB" ||
        operation === "AND" ||
        operation === "OR" ||
        operation === "XOR"
    ) {

        let registerA =
            operands[0];

        let registerB =
            operands[1];

        let a =
            parseInt(
                registers[registerA],
                2
            );

        let b =
            parseInt(
                registers[registerB],
                2
            );

        let result;


        if (operation === "ADD") {

            result = a + b;
        }

        else if (operation === "SUB") {

            result = a - b;
        }

        else if (operation === "AND") {

            result = a & b;
        }

        else if (operation === "OR") {

            result = a | b;
        }

        else if (operation === "XOR") {

            result = a ^ b;
        }


        let binaryResult =
            result
                .toString(2)
                .padStart(4, "0");


        updateRegister(
            "R3",
            binaryResult
        );

        document.getElementById(
            "programOutput"
        ).innerText =
            operation +
            " executed -> R3 = " +
            binaryResult;
    }


    else {

        document.getElementById(
            "programOutput"
        ).innerText =
            "Unknown instruction: " +
            operation;
    }
}


// Step CPU

function stepCPU() {

    if (!fetchInstruction()) {

        document.getElementById(
            "programOutput"
        ).innerText =
            "Program finished!";

        return;
    }

    document.getElementById(
        "fetchStatus"
    ).innerText =
        "FETCH ✓";


    let decoded =
        decodeInstruction(IR);


    document.getElementById(
        "decodeStatus"
    ).innerText =
        "DECODE ✓";


    executeDecodedInstruction(
        decoded
    );


    document.getElementById(
        "executeStatus"
    ).innerText =
        "EXECUTE ✓";


    PC++;


    document.getElementById(
        "programCounter"
    ).innerText =
        PC;
}


// Run CPU

function runCPU() {

    while (
        PC < programMemory.length
    ) {

        stepCPU();
    }

    document.getElementById(
        "programOutput"
    ).innerText =
        "Program executed successfully!";
}


// Reset CPU

function resetCPU() {

    registers.RO = "0000";
    registers.R1 = "0000";
    registers.R2 = "0000";
    registers.R3 = "0000";


    document.getElementById("RO").innerText =
        "0000";

    document.getElementById("R1").innerText =
        "0000";

    document.getElementById("R2").innerText =
        "0000";

    document.getElementById("R3").innerText =
        "0000";


    PC = 0;
    IR = "";
    programMemory = [];


    memory = {
        0: "0000",
        1: "0000",
        2: "0000",
        3: "0000",
        4: "0000",
        5: "0000",
        6: "0000",
        7: "0000"
    };


    for (let address = 0; address < 8; address++) {

        document.getElementById(
            "memory-" + address
        ).innerText =
            "0000";
    }


    document.getElementById(
        "programCounter"
    ).innerText =
        "0";


    document.getElementById(
        "instructionRegister"
    ).innerText =
        "---";


    document.getElementById(
        "fetchStatus"
    ).innerText =
        "FETCH";


    document.getElementById(
        "decodeStatus"
    ).innerText =
        "DECODE";


    document.getElementById(
        "executeStatus"
    ).innerText =
        "EXECUTE";


    document.getElementById(
        "programOutput"
    ).innerText =
        "";


    document.getElementById(
        "programInput"
    ).value =
        "";
}