const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");

const ExpenseSchema = new mongoose.Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

const Expense = mongoose.model("Expense", ExpenseSchema);

function validateExpense(expense) {
    const schema = Joi.object({
        // user: Joi.string().required(),
        reason: Joi.string().min(3).required(),
        amount: Joi.number().positive().required(),
        date: Joi.date(),
    });

    return schema.validate(expense);
}

module.exports = { Expense, validateExpense };
