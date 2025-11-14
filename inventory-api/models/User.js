const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
firstName: String,
lastName: String,
role: { type: String, enum: ['user','admin'], default: 'user' },
isActive: { type: Boolean, default: true },
lastLogin: { type: Date, default: null }
},{ timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next){
if (!this.isModified('password')) return next();
this.password = await bcrypt.hash(this.password, 10);
next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(pass){
return await bcrypt.compare(pass, this.password);
};

// Method to remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);