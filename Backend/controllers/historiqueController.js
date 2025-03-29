const Virement = require("../models/Virement");
const VirementGroupe = require("../models/VirementGroupe");
const VirementProgramme = require("../models/VirementProgramme");
// If transactions also come from somewhere else (e.g., direct account transactions), import as needed

exports.getHistorique = async (req, res) => {
  try {
    // Suppose you have `req.user` or a user ID from JWT to find relevant transactions.
    // For simplicity, let's assume your user ID is `req.user._id`.
    // If you're storing user reference in your Virement model, you can query by user reference.

    // Example: find immediate virements
    const virements = await Virement.find({ /* match user somehow */ })
      .sort({ createdAt: -1 })
      .lean();

    // Example: find grouped virements
    const groupes = await VirementGroupe.find({ /* match user somehow */ })
      .sort({ createdAt: -1 })
      .lean();

    // Example: find scheduled (programmed) virements
    const programmes = await VirementProgramme.find({ /* match user somehow */ })
      .sort({ createdAt: -1 })
      .lean();

    // Combine all results in a single array
    // Each item in the array can be standardized to a common shape
    // For example, for a normal Virement, we might do:
    const mappedVirements = virements.map((v) => ({
      _id: v._id.toString(),
      date: v.createdAt,
      amount: v.amount,
      description: v.description || "Virement simple",
      type: v.fromAccount === req.user.mainAccountId ? "debit" : "credit", // or your logic
      status: v.status,
      beneficiary: "N/A", // or retrieve from relationship if needed
      reference: `VIR-${v._id.toString().slice(-6)}`,
    }));

    // For grouped virements, you might flatten each child virement
    // or store them as separate items. Example of flattening:
    let mappedGroupes = [];
    groupes.forEach((group) => {
      group.virements.forEach((entry) => {
        mappedGroupes.push({
          _id: `${group._id.toString()}-${entry._id.toString()}`,
          date: group.createdAt,
          amount: entry.amount,
          description: entry.motif || "Virement groupé",
          type: group.fromAccount === req.user.mainAccountId ? "debit" : "credit",
          status: group.status === "Pending" ? "pending" : "completed", // or your logic
          beneficiary: `Bénéficiaire ${entry.beneficiary}`, // if needed, or fetch from Beneficiaire model
          reference: `GRP-${group._id.toString().slice(-6)}-${entry._id.toString().slice(-4)}`,
        });
      });
    });

    // For scheduled (programmed) virements
    const mappedProgrammes = programmes.map((p) => ({
      _id: p._id.toString(),
      date: p.createdAt,
      amount: p.amount,
      description: p.description || `Virement programmé (${p.frequency})`,
      type: p.fromAccount === req.user.mainAccountId ? "debit" : "credit",
      status: p.status === "Scheduled" ? "pending" : "completed",
      beneficiary: `Bénéficiaire ${p.toAccount}`, // or fetch from Beneficiaire model
      reference: `PRG-${p._id.toString().slice(-6)}`,
    }));

    const allTransactions = [
      ...mappedVirements,
      ...mappedGroupes,
      ...mappedProgrammes,
    ].sort((a, b) => new Date(b.date) - new Date(a.date)); // sort descending by date

    res.json(allTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
