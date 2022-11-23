const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: true,
  },
  email: {
    type: String,
    requried: true,
  },
  phone: {
    type: Number,
    requried: true,
  },
  work: {
    type: String,
    requried: true,
  },
  password: {
    type: String,
    requried: true,
  },
  cpassword: {
    type: String,
    requried: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      name: {
        type: String,
        requried: true,
      },
      email: {
        type: String,
        requried: true,
      },
      phone: {
        type: Number,
        requried: true,
      },
      message: {
        type: String,
        requried: true,
      },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 12);
    this.cpassword = await bcryptjs.hash(this.cpassword, 12);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this.id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};


// storing the messages

userSchema.methods.addMessage = async function (name, email, phone, message) {
    try {
        this.messages = this.messages.concat({ name, email, phone, message });
        await this.save()
        return this.messages;
    } catch (error) {
        console.log(error)
    }
};

const User = mongoose.model("USER", userSchema);

module.exports = User;
