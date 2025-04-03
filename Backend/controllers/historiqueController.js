const Virement = require("../models/Virement");
const VirementGroupe = require("../models/VirementGroupe");
const VirementProgramme = require("../models/VirementProgramme");

// Helper function to format dates
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR");
};

exports.getHistorique = async (req, res) => {
  try {
    // For example, if req.user.compteIds exists, use the first one as main account
    const userMainAccountId = req.user?.compteIds?.[0]?.toString();
    console.log("User main account ID:", userMainAccountId);

    const virements = await Virement.find({ /* match user somehow */ })
      .sort({ createdAt: -1 })
      .lean();

    const groupes = await VirementGroupe.find({ /* match user somehow */ })
      .sort({ createdAt: -1 })
      .lean();

    const programmes = await VirementProgramme.find({ /* match user somehow */ })
      .sort({ createdAt: -1 })
      .lean();

    const mappedVirements = virements.map((v) => {
      console.log("v.fromAccount:", v.fromAccount?.toString());
      console.log("userMainAccountId:", userMainAccountId);
    
      const isSender = v.fromAccount?.toString() === userMainAccountId;
      return {
        _id: v._id.toString(),
        date: formatDate(v.createdAt),
        description: "y", // Demo sample
        beneficiary: "N/A",
        amount: v.amount,
        type: isSender ? "debit" : "credit",
        status: v.status,
        reference: `VIR-${v._id.toString().slice(-6)}`,
      };
    });
    
    let mappedGroupes = [];
    groupes.forEach((group) => {
      group.virements.forEach((entry) => {
        mappedGroupes.push({
          _id: `${group._id.toString()}-${entry._id.toString()}`,
          date: formatDate(group.createdAt),
          amount: entry.amount,
          description: entry.motif || "Virement groupé",
          type: group.fromAccount?.toString() === userMainAccountId ? "debit" : "credit",
          status: group.status === "Pending" ? "pending" : "completed",
          beneficiary: `Bénéficiaire ${entry.beneficiary}`,
          reference: `GRP-${group._id.toString().slice(-6)}-${entry._id.toString().slice(-4)}`,
        });
      });
    });

    const mappedProgrammes = programmes.map((p) => ({
      _id: p._id.toString(),
      date: formatDate(p.createdAt),
      amount: p.amount,
      description: p.description || `Virement programmé (${p.frequency})`,
      type: p.fromAccount?.toString() === userMainAccountId ? "debit" : "credit",
      status: p.status === "Scheduled" ? "pending" : "completed",
      beneficiary: `Bénéficiaire ${p.toAccount}`,
      reference: `PRG-${p._id.toString().slice(-6)}`,
    }));

    const allTransactions = [
      ...mappedVirements,
      ...mappedGroupes,
      ...mappedProgrammes,
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(allTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
