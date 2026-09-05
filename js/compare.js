// ===============================
// JSON COMPARE
// ===============================

function compareJSON(textareaA, textareaB) {

    const textA = textareaA.value.trim();
    const textB = textareaB.value.trim();

    // Check empty JSON
    if (textA === "" || textB === "") {

        showOutput(
            "⚠ Please enter JSON in both JSON A and JSON B.",
            "warning",
            "Compare Result"
        );

        return;
    }

    let jsonA;
    let jsonB;

    // Parse JSON A
    try {

        jsonA = JSON.parse(textA);

    } catch (error) {

        showOutput(
            "❌ JSON A contains invalid JSON.",
            "error",
            "Compare Result"
        );

        return;
    }

    // Parse JSON B
    try {

        jsonB = JSON.parse(textB);

    } catch (error) {

        showOutput(
            "❌ JSON B contains invalid JSON.",
            "error",
            "Compare Result"
        );

        return;
    }

    // Find differences
    const differences = [];

    findDifferences(
        jsonA,
        jsonB,
        "",
        differences
    );

    // ===============================
    // NO DIFFERENCES
    // ===============================

    if (differences.length === 0) {

        showOutput(
            "✅ JSON A and JSON B are identical.",
            "success",
            "Compare Result"
        );

        return;
    }

    // ===============================
// BUILD RESULT
// ===============================

let result = "";

result += `❌ Differences Found: ${differences.length}\n\n`;

differences.forEach((difference, index) => {

    result += `${index + 1}. ${difference.path}\n`;

    if (difference.type === "CHANGED") {

        result += `   JSON A : ${formatValue(difference.valueA)}\n`;
        result += `   JSON B : ${formatValue(difference.valueB)}\n`;

    }

    else if (difference.type === "ADDED") {

        result += `   JSON B : ${formatValue(difference.valueB)}\n`;

    }

    else if (difference.type === "REMOVED") {

        result += `   JSON A : ${formatValue(difference.valueA)}\n`;

    }

    result += "\n";

});

showOutput(
    result,
    "warning",
    "Compare Result"
);

}


// ===============================
// FIND DIFFERENCES
// ===============================

function findDifferences(
    valueA,
    valueB,
    path,
    differences
) {

    // ===============================
    // BOTH OBJECTS
    // ===============================

    if (
        isObject(valueA) &&
        isObject(valueB)
    ) {

        const keys = new Set([
            ...Object.keys(valueA),
            ...Object.keys(valueB)
        ]);

        keys.forEach(key => {

            const currentPath =
                path === ""
                    ? key
                    : `${path}.${key}`;

            // Added
            if (!(key in valueA)) {

                differences.push({

                    path: currentPath,

                    type: "ADDED",

                    valueB: valueB[key]

                });

                return;
            }

            // Removed
            if (!(key in valueB)) {

                differences.push({

                    path: currentPath,

                    type: "REMOVED",

                    valueA: valueA[key]

                });

                return;
            }

            // Compare values
            findDifferences(
                valueA[key],
                valueB[key],
                currentPath,
                differences
            );

        });

        return;
    }


    // ===============================
    // ARRAYS
    // ===============================

    if (
        Array.isArray(valueA) &&
        Array.isArray(valueB)
    ) {

        const maxLength =
            Math.max(
                valueA.length,
                valueB.length
            );

        for (
            let i = 0;
            i < maxLength;
            i++
        ) {

            const currentPath =
                `${path}[${i}]`;

            // Added
            if (i >= valueA.length) {

                differences.push({

                    path: currentPath,

                    type: "ADDED",

                    valueB: valueB[i]

                });

                continue;
            }

            // Removed
            if (i >= valueB.length) {

                differences.push({

                    path: currentPath,

                    type: "REMOVED",

                    valueA: valueA[i]

                });

                continue;
            }

            findDifferences(
                valueA[i],
                valueB[i],
                currentPath,
                differences
            );

        }

        return;
    }


    // ===============================
    // DIFFERENT TYPES / VALUES
    // ===============================

    if (
        JSON.stringify(valueA) !==
        JSON.stringify(valueB)
    ) {

        differences.push({

            path: path || "Root",

            type: "CHANGED",

            valueA: valueA,

            valueB: valueB

        });

    }

}


// ===============================
// CHECK OBJECT
// ===============================

function isObject(value) {

    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );

}


// ===============================
// FORMAT VALUES
// ===============================

function formatValue(value) {

    if (typeof value === "string") {

        return `"${value}"`;

    }

    return JSON.stringify(
        value,
        null,
        2
    );

}