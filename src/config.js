const mongoose = require('mongoose');
const atlasURI = "mongodb+srv://bbxx77:NurAli2013@cluster0.o4f0yrh.mongodb.net/users?retryWrites=true&w=majority";
mongoose.connect(atlasURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Database Connected Successfully");
}).catch((error) => {
  console.error("Database cannot be Connected:", error);
});
const loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  }
});
const Login = mongoose.model('Login', loginSchema);
module.exports = Login;
const collection = mongoose.model("users", loginSchema);
module.exports = collection;
