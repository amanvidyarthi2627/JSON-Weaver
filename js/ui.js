// ===============================
// OUTPUT POPUP
// ===============================

function showOutput(
    message,
    type = "success",
    title = "Output"
) {

    output.textContent = message;

    outputTitle.textContent = title;

    if (type === "success") {

        output.style.color = "#22c55e";

    } else if (type === "error") {

        output.style.color = "#ef4444";

    } else {

        output.style.color = "#facc15";

    }

    outputModal.classList.add("active");

}


// ===============================
// CLOSE POPUP
// ===============================

closeOutput.addEventListener(
    "click",
    function () {

        outputModal.classList.remove("active");

    }
);


// Close by clicking outside

outputModal.addEventListener(
    "click",
    function (event) {

        if (event.target === outputModal) {

            outputModal.classList.remove("active");

        }

    }
);