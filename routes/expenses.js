const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Expense, validateExpense } = require("../models/Expense");

router.post("/", async (req, res) => {
    const { error } = validateExpense(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    try {
        const { amount, reason, date } = req.body;
        // const { amount, reason, date, user } = req.body;

        const newExpense = new Expense({
            // user,
            amount,
            reason,
            date,
        });

        const result = await newExpense.save();

        res.status(201).send(result);
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
