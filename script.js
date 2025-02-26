// Get URL Parameters
function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Set USN and Name
document.addEventListener("DOMContentLoaded", function () {
    let usn = getQueryParam("usn");
    let name = getQueryParam("name");

    if (usn) {
        document.getElementById("usn-display").innerText = `USN: ${usn}`;
    }
    if (name) {
        document.getElementById("student-name").innerText = `Name: ${decodeURIComponent(name)}`;
    }
});

// Calculate SGPA & Update Backend
async function calculate() {
    let subjects = [
        { id: "se", weight: 4 },
        { id: "cn", weight: 4 },
        { id: "toc", weight: 4 },
        { id: "ai", weight: 3 },
        { id: "rm", weight: 3 },
        { id: "nocredit", weight: 0 },
        { id: "evs", weight: 1 },
        { id: "web", weight: 1 }
    ];

    let sum = 0;
    let totalCredits = 20;

    for (let subject of subjects) {
        let marks = parseFloat(document.getElementById(subject.id).value);
        if (isNaN(marks) || marks < 0 || marks > 100) {
            alert(`Enter valid marks for ${subject.id}`);
            return;
        }
        sum += ((marks / 10) + 1) * subject.weight;
    }

    let sgpa = (sum / totalCredits).toFixed(2);
    document.getElementById("result").innerText = `SGPA: ${sgpa}`;

    let usn = getQueryParam("usn");

    // Update SGPA in Excel using Flask
    let response = await fetch("/update_sgpa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usn, sgpa })
    });

    let result = await response.json();
    alert(result.message || "Error updating SGPA");
}
