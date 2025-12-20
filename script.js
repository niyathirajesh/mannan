document.getElementById("meetingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: name.value,
    email: email.value,
    date: date.value,
    time: time.value
  };

  const response = await fetch("http://localhost:3000/request-meeting", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    document.getElementById("successMessage").innerText =
      "Your meeting request has been sent to the King.";
    e.target.reset();
  }
});
