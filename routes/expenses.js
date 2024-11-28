const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Expense, validateExpense } = require("../models/Expense");

router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find()
        res.send(expenses)
    } catch (error) {
        console.error("Error getting expense:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
})

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

router.patch('/:id', async (req, res) => {
    try {
        const result = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!result) {
            return res.status(404).send({ message: "Expense not found" });
        }

        res.send(result);
    } catch (error) {
        console.error("Error patching expense:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Expense.findByIdAndDelete(req.params.id, req.body)


    if (!result) {
        return res.status(404).send({ message: "Expense not found" });
    }

        res.send(result);
    } catch (error) {
        console.error("Error patching expense:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
})
module.exports = router;
