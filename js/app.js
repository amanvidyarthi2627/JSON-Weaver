// ===============================
// DOM ELEMENTS
// ===============================

// Output
const output = document.getElementById("output");
const outputTitle = document.getElementById("outputTitle");
const outputModal = document.getElementById("outputModal");
const closeOutput = document.getElementById("closeOutput");

// ===============================
// JSON TEXTAREAS
// ===============================

const jsonA = document.getElementById("jsonA");
const jsonB = document.getElementById("jsonB");

// ===============================
// JSON A BUTTONS
// ===============================

const copyA = document.getElementById("copyA");
const clearA = document.getElementById("clearA");
const uploadA = document.getElementById("uploadA");
const downloadA = document.getElementById("downloadA");
const beautifyA = document.getElementById("beautifyA");


// ===============================
// JSON B BUTTONS
// ===============================

const copyB = document.getElementById("copyB");
const clearB = document.getElementById("clearB");
const uploadB = document.getElementById("uploadB");
const downloadB = document.getElementById("downloadB");
const beautifyB = document.getElementById("beautifyB");


// ===============================
// MAIN REPAIR BUTTON
// ===============================

const repairBtn = document.getElementById("repairBtn");


// ===============================
// COUNTERS
// ===============================

const charA = document.getElementById("charA");
const charB = document.getElementById("charB");

const lineA = document.getElementById("lineA");
const lineB = document.getElementById("lineB");

// ===============================
// FILE INPUTS
// ===============================

const fileA = document.getElementById("fileA");
const fileB = document.getElementById("fileB");

// ===============================
// MAIN BUTTONS
// ===============================

const validateBtn =
    document.getElementById("validateBtn");

const minifyBtn =
    document.getElementById("minifyBtn");

const compareBtn =
    document.getElementById("compareBtn");

const mergeBtn =
    document.getElementById("mergeBtn");

// ===============================
// COPY
// ===============================

function copyText(textarea) {

    if (textarea.value.trim() === "") {

        alert("Nothing to copy!");

        return;

    }

    navigator.clipboard.writeText(
        textarea.value
    );

    alert("Copied Successfully!");

}

copyA.addEventListener(
    "click",
    () => copyText(jsonA)
);

copyB.addEventListener(
    "click",
    () => copyText(jsonB)
);


// ===============================
// CLEAR
// ===============================

function clearText(
    textarea,
    charElement,
    lineElement
) {

    textarea.value = "";

    updateCounter(
        textarea,
        charElement,
        lineElement
    );

}

clearA.addEventListener(
    "click",
    () => clearText(jsonA, charA, lineA)
);

clearB.addEventListener(
    "click",
    () => clearText(jsonB, charB, lineB)
);


// ===============================
// LIVE COUNTERS
// ===============================

jsonA.addEventListener(
    "input",
    () => updateCounter(jsonA, charA, lineA)
);

jsonB.addEventListener(
    "input",
    () => updateCounter(jsonB, charB, lineB)
);


// ===============================
// UPLOAD
// ===============================

uploadA.addEventListener(
    "click",
    () => fileA.click()
);

uploadB.addEventListener(
    "click",
    () => fileB.click()
);


function loadJSON(
    fileInput,
    textarea,
    charElement,
    lineElement
) {

    const file = fileInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {

        textarea.value =
            event.target.result;

        updateCounter(
            textarea,
            charElement,
            lineElement
        );

    };

    reader.readAsText(file);

}

fileA.addEventListener(
    "change",
    () => loadJSON(
        fileA,
        jsonA,
        charA,
        lineA
    )
);

fileB.addEventListener(
    "change",
    () => loadJSON(
        fileB,
        jsonB,
        charB,
        lineB
    )
);


// ===============================
// BEAUTIFY
// ===============================

beautifyA.addEventListener(
    "click",
    () => beautifyJSON(
        jsonA,
        charA,
        lineA,
        "JSON A"
    )
);

beautifyB.addEventListener(
    "click",
    () => beautifyJSON(
        jsonB,
        charB,
        lineB,
        "JSON B"
    )
);



// ===============================
// MINIFY
// ===============================

function minifyJSON(
    textarea,
    charElement,
    lineElement,
    name
) {

    if (textarea.value.trim() === "") {

        return `⚠ ${name} is empty.`;

    }

    try {

        const json =
            JSON.parse(textarea.value);

        textarea.value =
            JSON.stringify(json);

        updateCounter(
            textarea,
            charElement,
            lineElement
        );

        return `✅ ${name} Minified Successfully`;

    } catch (error) {

        return `❌ ${name} contains Invalid JSON`;

    }

}

minifyBtn.addEventListener(
    "click",
    function () {

        const messageA = minifyJSON(
            jsonA,
            charA,
            lineA,
            "JSON A"
        );

        const messageB = minifyJSON(
            jsonB,
            charB,
            lineB,
            "JSON B"
        );

        showOutput(
            messageA + "\n\n" + messageB,
            "success",
            "Minify JSON"
        );

    }
);


// ===============================
// VALIDATE
// ===============================

validateBtn.addEventListener(
    "click",
    function () {

        const resultA =
            validateJSON(
                jsonA,
                "JSON A"
            );

        const resultB =
            validateJSON(
                jsonB,
                "JSON B"
            );

        showOutput(
            resultA + "\n\n" + resultB,
            "success",
            "Validation Result"
        );

    }
);


// ===============================
// COMPARE
// ===============================

compareBtn.addEventListener(
    "click",
    function () {

        compareJSON(
            jsonA,
            jsonB
        );

    }
);


// ===============================
// MERGE
// ===============================

mergeBtn.addEventListener(
    "click",
    function () {

        mergeJSON(
            jsonA,
            jsonB
        );

    }
);

repairBtn.addEventListener(
    "click",
    function () {

        const results = [];

        const resultA = repairJSON(
            jsonA,
            charA,
            lineA,
            "JSON A"
        );

        results.push(resultA.message);


        const resultB = repairJSON(
            jsonB,
            charB,
            lineB,
            "JSON B"
        );

        results.push(resultB.message);


        let outputType = "success";

        if (
            !resultA.success ||
            !resultB.success
        ) {

            outputType = "warning";

        }


        showOutput(
            results.join("\n\n"),
            outputType,
            "Repair JSON"
        );

    }
);