// controllers/chatController.js
const Together = require("together-ai");

// Initialize the Together client using the API key from environment variables
const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY, // Ensure TOGETHER_API_KEY is set in your .env file
});

// Controller function to handle the chat request
exports.chat = async (req, res) => {
  const { message, user } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required in the request body." });
  }

  try {
    // Build an array of messages to send to the chatbot.
    // If user info is provided, include a system prompt with context.
    const messages = [];
    const bankingContext = `Banking Contact Information:
    Email     : amenbank@amenbank.com.tn
    Téléphone : +216 71 100 100
    Site web  : www.amenbank.com.tn
    Adresse   : Avenue Habib Bourguiba, Tunis, Tunisie
    
    Products & Offers:
    • Credit Cards: Offering a range of Visa, MasterCard, and specialized cards tailored to various needs.
    • Debit Cards: Secure and convenient solutions for daily transactions.
    • Personal Loans: Competitive options for personal financing requirements.
    • Mortgage Loans: Flexible home financing with attractive rates.
    • Business Solutions: Lending and account services designed for SMEs and corporate clients.
    • Special Offers: Periodic promotions, reward programs, and exclusive deals for new and existing customers.
    • Digital Banking: Comprehensive online and mobile banking tools for an enhanced customer experience.
    • Investment Products: Savings accounts, term deposits, and investment packages to help grow your finances.`;
    
    if (user) {
      // Construct user context details.
      let userContext = "";
      if (user.name) {
        userContext += `User Name: ${user.name}. `;
      }
      if (user.email) {
        userContext += `Email: ${user.email}. `;
      }
      if (user.cin) {
        userContext += `Numero Cin: ${user.cin}. `;
      }
      if(user.phone){
        userContext += `Telephone: ${user.phone}. `;
      }
      if(user.accounts){
        userContext += `comptes: ${user.accounts}. `;
      }

        
      if (user.accounts && Array.isArray(user.accounts) && user.accounts.length > 0) {
        // Extract and format account information including history details.
        const accountDetails = user.accounts.map(acc => {
          // Format the transaction history details as a string.
          const historiqueDetails = Array.isArray(acc.historique) && acc.historique.length > 0
            ? acc.historique.map(h => {
                // Format each history entry; adjust date formatting as needed.
                const dateStr = new Date(h.date).toLocaleDateString();
                return `(${h.type}: ${h.amount} TND for ${h.category} on ${dateStr})`;
              }).join(", ")
            : "No transactions";
      
          // Return a formatted string with all the required details.
          return `Account Type: ${acc.type}, RIB: ${acc.RIB || "N/A"}, Solde: ${acc.solde} TND, ` +
                 `Numéro Compte: ${acc.numéroCompte}, Modalités Retrait: ${acc.modalitésRetrait}, ` +
                 `Conditions: ${acc.conditionsGel}, Domiciliation: ${acc.domiciliation}, ` +
                 `Avec Chéquier: ${acc.avecChéquier ? "Yes" : "No"}, ` +
                 `Avec Carte Bancaire: ${acc.avecCarteBancaire ? "Yes" : "No"}, ` +
                 `Monthly Expenses: ${acc.monthlyExpenses} TND, ` +
                 `Last Month Expenses: ${acc.lastMonthExpenses || "N/A"}, ` +
                 `Historique: [${historiqueDetails}]`;
        }).join(" | "); // Use a separator between accounts for clarity.
      
        userContext += accountDetails;
      }
      


      messages.push({
        role: "system",
        content: `Vous êtes un assistant bancaire professionnel. Saluez l'utilisateur par son nom et utilisez le contexte suivant lorsque c'est approprié : ${userContext},${bankingContext} et resumez les informations de l'utilisateur pas de plus et pour les chiffre utilisez le format de la monnaie de Tunisie (TND) 2 chiffre apres le vergule et ne dit pas bonjour ou accune salutaion.`,
      });
    } else {


      messages.push({
        role: "system",
        content: `Vous êtes un assistant bancaire professionnel. Utilisez le contexte suivant lorsque c'est approprié :${bankingContext}`,
      });
    }
    // Append the user's message.
    messages.push({ role: "user", content: message });

    // Call the Together API with the constructed messages.
    const response = await together.chat.completions.create({
      messages,
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    });

    // Send the chatbot's reply back to the client.
    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Error from Together API:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};
