// ===============================
// MERGE JSON
// ===============================

function mergeJSON(jsonA, jsonB) {

    if (
        jsonA.value.trim() === "" ||
        jsonB.value.trim() === ""
    ) {

        showOutput(
            "⚠ Please enter JSON in both JSON A and JSON B.",
            "warning",
            "Merge JSON"
        );

        return;

    }

    try {

        const objectA = JSON.parse(jsonA.value);
        const objectB = JSON.parse(jsonB.value);

        const mergedJSON = {
            ...objectA,
            ...objectB
        };

        showOutput(
            JSON.stringify(
                mergedJSON,
                null,
                4
            ),
            "success",
            "Merged JSON"
        );

    } catch (error) {

        showOutput(
            "❌ Both JSON inputs must be valid before merging.",
            "error",
            "Merge JSON"
        );

    }

}