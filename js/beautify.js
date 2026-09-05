// ===============================
// BEAUTIFY JSON
// ===============================

function beautifyJSON(
    textarea,
    charElement,
    lineElement,
    name
) {

    if (textarea.value.trim() === "") {

        showOutput(
            `⚠ ${name} is empty.`,
            "warning",
            "Beautify JSON"
        );

        return;
    }

    try {

        const json = JSON.parse(
            textarea.value
        );

        textarea.value = JSON.stringify(
            json,
            null,
            4
        );

        updateCounter(
            textarea,
            charElement,
            lineElement
        );

        showOutput(
            `✅ ${name} Beautified Successfully`,
            "success",
            "Beautify JSON"
        );

    } catch (error) {

        showOutput(
            `❌ ${name} contains Invalid JSON.\n\n${error.message}`,
            "error",
            "Beautify JSON"
        );

    }

}