async function submit() {
    let scheme = document.getElementById("scheme").value;
    let stream = document.getElementById("Stream").value;
    let semester = document.getElementById("sem").value;
    let usn = document.getElementById("USN").value.trim().toUpperCase();

    if (scheme === "sc" || stream === "dept" || semester === "semi") {
        alert("Please select all options before proceeding!");
        return;
    }
    if (usn === "" || usn.length !== 10) {
        alert("Please enter your USN properly!");
        return;
    }

    // Check if USN exists
    let response = await fetch("http://127.0.0.1:5000/check_usn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usn })
    });

    let result = await response.json();

    if (result.exists) {
        window.location.href = `cse5.html?usn=${encodeURIComponent(usn)}&name=${encodeURIComponent(result.name)}`;
    } else {
        let name = prompt("USN not found! Please enter your name:");
        if (name) {
            await fetch("/add_student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usn, name })
            });
            alert("Student added successfully!");
            window.location.href = `cse5.html?usn=${encodeURIComponent(usn)}&name=${encodeURIComponent(name)}`;
        }
    }
}
