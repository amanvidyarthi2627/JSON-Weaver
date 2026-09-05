// ===============================
// Delete/Update COUNTER
// ===============================

function updateCounter(
    textarea,
    charElement,
    lineElement
) {

    const text = textarea.value;

    const characters = text.length;

    const lines =
        text === ""
            ? 1
            : text.split("\n").length;

    charElement.textContent =
        `Characters : ${characters}`;

    lineElement.textContent =
        `Lines : ${lines}`;

}