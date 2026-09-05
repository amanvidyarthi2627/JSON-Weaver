// =====================================================
// JSON WEAVER
// SMART JSON REPAIR
// =====================================================
//
// Handles common malformed JSON such as:
//
// 1. Missing quotes around keys
// 2. Missing quotes around simple string values
// 3. = instead of :
// 4. ; instead of ,
// 5. Single quotes
// 6. Missing commas
// 7. Trailing commas
// 8. Missing brackets / braces where detectable
// 9. Comments
// 10. Unquoted keys
// 11. Unquoted simple string values
// 12. Extra whitespace
// 13. Incomplete JSON
// 14. Common malformed quoted keys
//
// Final validation is always performed using JSON.parse().
// =====================================================


// =====================================================
// MAIN REPAIR FUNCTION
// =====================================================

function repairJSON(textarea, charElement, lineElement, name) {

    let text = textarea.value.trim();


    // =================================================
    // EMPTY INPUT
    // =================================================

    if (text === "") {

        return {
            success: false,
            message: `⚠ ${name} is empty.`
        };

    }


    try {

        // =================================================
        // STEP 1
        // CHECK IF ALREADY VALID JSON
        // =================================================

        try {

            const validJSON = JSON.parse(text);

            textarea.value = JSON.stringify(
                validJSON,
                null,
                4
            );

            updateCounter(
                textarea,
                charElement,
                lineElement
            );

            return {
                success: true,
                message:
                    `✅ ${name} was already valid JSON.`
            };

        } catch (error) {

            // Not valid.
            // Continue with repair.
        }


        // =================================================
        // STEP 2
        // CHECK JSONREPAIR LIBRARY
        // =================================================

        if (
            typeof JSONRepair === "undefined" ||
            typeof JSONRepair.jsonrepair !== "function"
        ) {

            throw new Error(
                "JSON Repair library is not loaded."
            );

        }


        // =================================================
        // STEP 3
        // PREPROCESS INPUT
        // =================================================

        let repaired = preprocessJSON(text);


        // =================================================
        // STEP 4
        // USE JSONREPAIR
        // =================================================

        repaired = JSONRepair.jsonrepair(repaired);


        // =================================================
        // STEP 5
        // FINAL VALIDATION
        // =================================================

        const json = JSON.parse(repaired);


        // =================================================
        // STEP 6
        // FORMAT JSON
        // =================================================

        textarea.value = JSON.stringify(
            json,
            null,
            4
        );


        // =================================================
        // STEP 7
        // UPDATE COUNTERS
        // =================================================

        updateCounter(
            textarea,
            charElement,
            lineElement
        );


        // =================================================
        // SUCCESS
        // =================================================

        return {

            success: true,

            message:
                `✅ ${name} repaired successfully.`

        };

    }


    // =====================================================
    // ERROR
    // =====================================================

    catch (error) {

        console.error(
            `${name} Repair Error:`,
            error
        );

        return {

            success: false,

            message:
                `❌ ${name} could not be repaired.\n\n` +
                `${error.message}`

        };

    }

}



// =====================================================
// PREPROCESS MALFORMED JSON
// =====================================================

function preprocessJSON(text) {

    let result = "";
    let inString = false;
    let stringQuote = null;
    let escaped = false;


    // =================================================
    // CHARACTER-BY-CHARACTER PROCESSING
    // =================================================

    for (let i = 0; i < text.length; i++) {

        const char = text[i];
        const next = text[i + 1];


        // -------------------------------------------------
        // HANDLE ESCAPED CHARACTERS
        // -------------------------------------------------

        if (escaped) {

            result += char;
            escaped = false;

            continue;

        }


        if (char === "\\" && inString) {

            result += char;
            escaped = true;

            continue;

        }


        // -------------------------------------------------
        // STRING START / END
        // -------------------------------------------------

        if (
            (char === '"' || char === "'") &&
            !inString
        ) {

            inString = true;
            stringQuote = char;

            result += char;

            continue;

        }


        if (
            char === stringQuote &&
            inString
        ) {

            inString = false;
            stringQuote = null;

            result += char;

            continue;

        }


        // -------------------------------------------------
        // EVERYTHING BELOW IS ONLY OUTSIDE STRINGS
        // -------------------------------------------------

        if (!inString) {


            // =============================================
            // REMOVE // COMMENTS
            // =============================================

            if (char === "/" && next === "/") {

                while (
                    i < text.length &&
                    text[i] !== "\n"
                ) {

                    i++;

                }

                result += "\n";

                continue;

            }


            // =============================================
            // REMOVE /* COMMENTS */
            // =============================================

            if (char === "/" && next === "*") {

                i += 2;

                while (
                    i < text.length &&
                    !(text[i] === "*" &&
                      text[i + 1] === "/")
                ) {

                    i++;

                }

                i++;

                continue;

            }


            // =============================================
            // =  → :
            // =============================================

            if (char === "=") {

                result += ":";

                continue;

            }


            // =============================================
            // ;  → ,
            // =============================================

            if (char === ";") {

                result += ",";

                continue;

            }

        }


        // -------------------------------------------------
        // NORMAL CHARACTER
        // -------------------------------------------------

        result += char;

    }


    // =================================================
    // ADD MISSING QUOTES TO COMMON UNQUOTED KEYS
    // =================================================

    result = quoteUnquotedKeys(result);


    // =================================================
    // FIX COMMON MALFORMED QUOTED KEYS
    //
    // Example:
    //
    // "city: "Mumbai"
    //
    // becomes:
    //
    // "city": "Mumbai"
    // =================================================

    result = fixBrokenQuotedKeys(result);


    // =================================================
    // REMOVE TRAILING COMMAS
    // =================================================

    result = result.replace(
        /,\s*([}\]])/g,
        "$1"
    );


    return result;

}



// =====================================================
// QUOTE UNQUOTED KEYS
// =====================================================
//
// Example:
//
// {
//     name: "Aman",
//     age: 19
// }
//
// becomes:
//
// {
//     "name": "Aman",
//     "age": 19
// }
// =====================================================

function quoteUnquotedKeys(text) {

    return text.replace(
        /([{\[,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)\s*:/g,
        '$1"$2":'
    );

}



// =====================================================
// FIX BROKEN QUOTED KEYS
// =====================================================
//
// Example:
//
// "city: "Mumbai"
//
// becomes:
//
// "city": "Mumbai"
//
// This targets the common mistake where the closing
// quote before the colon was forgotten.
// =====================================================

function fixBrokenQuotedKeys(text) {

    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {

        lines[i] = lines[i].replace(
            /^(\s*)"([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*/,
            '$1"$2": '
        );

    }

    return lines.join("\n");

}