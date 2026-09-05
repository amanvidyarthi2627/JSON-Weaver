// ===============================
// VALIDATE JSON
// ===============================

function validateJSON(textarea, name) {

    if (textarea.value.trim() === "") {

        return `⚠ ${name} is empty.`;

    }

    try {

        JSON.parse(textarea.value);

        return `✅ ${name} is Valid JSON`;

    } catch (error) {

        return `❌ ${name} is Invalid JSON\n${error.message}`;

    }

}