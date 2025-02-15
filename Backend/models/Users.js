const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    id: { type: Number, unique: true }, // Auto-incremented manually
    nom: { type: String, required: true },
    prénom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    téléphone: { type: String, required: true },
    employeur: { type: String },
    adresseEmployeur: { type: String }
});

// Auto-increment the "id" field manually
UserSchema.pre("save", async function (next) {
    if (!this.id) {
        const lastUser = await mongoose.model("User").findOne({}, {}, { sort: { id: -1 } });
        this.id = lastUser ? lastUser.id + 1 : 1;
    }
    next();
});

// Authentication methods
UserSchema.methods.authentifier = function () {
    console.log(`${this.nom} ${this.prénom} authenticated`);
};

UserSchema.methods.deauthentifier = function () {
    console.log(`${this.nom} ${this.prénom} deauthenticated`);
};

module.exports = mongoose.model("User", UserSchema);
