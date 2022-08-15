var express = require("express");
var router = express.Router();
const { bakeryDB } = require("../mongo");
const jwt = require("jsonwebtoken");
const { uuid } = require("uuidv4");
const dotenv = require("dotenv");
dotenv.config();

// GET order history
