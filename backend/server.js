const express = require("express");
const app = express();

const loggedInUser = { id: 1, name: "John", role: "admin" };

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(loggedInUser.role)) {
      return res.status(403).json({
        message:
          "Access denied. You don't have permission to access this route.",
      });
    }
    next();
  };
};

app.get("/admin", authorize(["admin"]), (req, res) => {
  res.json({ message: "This is admin route" });
});

app.get("/", (req, res) => {
  res.json({ message: "This is public route" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
