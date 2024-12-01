const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Expense, validateExpense } = require("../models/Expense");
const Joi = require('joi');

router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        console.error("Error getting expenses:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        res.json(expense);
    } catch (error) {
        console.error("Error getting expense:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

function validateExpenseWithoutUser(expense) {
    const schema = Joi.object({
        reason: Joi.string().min(3).required(),
        amount: Joi.number().positive().required(),
        date: Joi.date().default(() => new Date()), // Set default to current date
    });

    return schema.validate(expense);
}

router.post("/", async (req, res) => {
    console.log('Request Body:', req.body); // Log the request body

    const { amount, reason, date, token } = req.body;
    const expenseToValidate = { amount, reason, date };

    const { error } = validateExpenseWithoutUser(expenseToValidate);
    if (error) {
        console.log('Validation Error:', error.details[0].message); // Log validation error
        return res.status(400).send({ message: error.details[0].message });
    }

    try {
        const decoded = jwt.decode(token);

        if (!decoded) {
            console.log('Invalid Token'); // Log invalid token
            return res.status(401).send({ message: "Invalid token" });
        }

        const { userId } = decoded;
        const expense = { user: userId, amount, reason, date };

        console.log('Expense before final validation:', expense); // Log expense object before final validation

        const { error: finalError } = validateExpense(expense);
        if (finalError) {
            console.log('Final Validation Error:', finalError.details[0].message); // Log final validation error
            return res.status(400).send({ message: finalError.details[0].message });
        }

        const newExpense = new Expense(expense);
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
        console.error("Error updating expense:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Expense.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).send({ message: "Expense not found" });
        }

        res.send(result);
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
