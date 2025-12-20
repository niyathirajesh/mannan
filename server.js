const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

/* In-memory request storage */
const requests = {};

/* EMAIL CONFIGURATION */
const transporter = nodemailer.createTransport({
  service: "gmail",
 
  }
});

/* REQUEST MEETING */
app.post("/request-meeting", (req, res) => {
  const id = uuidv4();
  requests[id] = req.body;

  const mailHTML = `
    <h3>New Meeting Request</h3>
    <p><b>Name:</b> ${req.body.name}</p>
    <p><b>Email:</b> ${req.body.email}</p>
    <p><b>Date:</b> ${req.body.date}</p>
    <p><b>Time:</b> ${req.body.time}</p>

    <br>

    <a href="http://localhost:3000/accept/${id}"
       style="padding:10px 15px;background:green;color:white;text-decoration:none;">
       Accept
    </a>

    &nbsp;

    <a href="http://localhost:3000/reject/${id}"
       style="padding:10px 15px;background:red;color:white;text-decoration:none;">
       Reject
    </a>
  `;

  transporter.sendMail({
    to: "prethyush27@gmail.com",
    subject: "Meeting Request Approval Needed",
    html: mailHTML
  });

  res.json({ success: true });
});

/* ACCEPT REQUEST */
app.get("/accept/:id", (req, res) => {
  const r = requests[req.params.id];

  transporter.sendMail({
    to: r.email,
    subject: "Meeting Approved",
    text: "Your meeting request has been approved by the King."
  });

  res.send("<h2>Meeting Approved Successfully 👑</h2>");
});

/* REJECT PAGE WITH TEXTAREA */
app.get("/reject/:id", (req, res) => {
  res.send(`
    <form method="POST">
      <h3>Reason for Rejection</h3>
      <textarea name="reason" required></textarea><br><br>
      <button type="submit">Submit</button>
    </form>
  `);
});

/* HANDLE REJECTION */
app.post("/reject/:id", express.urlencoded({ extended: true }), (req, res) => {
  const r = requests[req.params.id];

  transporter.sendMail({
    to: r.email,
    subject: "Meeting Rejected",
    text: `Your meeting request was rejected.\nReason: ${req.body.reason}`
  });

  res.send("<h2>Rejection Email Sent</h2>");
});

/* STATIC FILES */
app.use(express.static("public"));

app.listen(3000, () =>
  console.log("Server running at http://localhost:3000")
);
