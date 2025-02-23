import { jsPDF } from "jspdf"
import "jspdf-autotable"
import QRCode from "qrcode"

export interface Transaction {
  id: string
  date: string
  merchant: string
  amount: number
  type: "debit" | "credit"
  category: string
  icon: string
}

export interface CardDetails {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cardType: string
  balance: number
  pendingTransactions: number
  monthlySpendingLimit: number
  monthlySpending: number
  withdrawalLimit: number
  withdrawalAmount: number
}

export interface BankBranding {
  name: string
  logo: string
  primaryColor: string
  secondaryColor: string
  address: string[]
  website: string
  phone: string
  email: string
}

export interface StatementConfig {
  showLogo: boolean
  showFooter: boolean
  showPageNumbers: boolean
  showBankInfo: boolean
  dateFormat: string
  locale: string
  currency: string
  theme: {
    headerColor: number[]
    textColor: number[]
    accentColor: number[]
    tableHeaderColor: number[]
    alternateRowColor: number[]
  }
}

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: {
      startY: number;
      head: string[][];
      body: string[][];
      theme?: string;
      styles?: {
        fontSize?: number;
        cellPadding?: number;
        lineColor?: number[];
        lineWidth?: number;
      };
      headStyles?: {
        fillColor?: number[];
        textColor?: number[];
        fontSize?: number;
        fontStyle?: string;
        halign?: "left" | "center" | "right";
      };
      columnStyles?: {
        [key: number]: {
          halign?: "left" | "center" | "right";
        };
      };
      alternateRowStyles?: {
        fillColor?: number[];
      };
      bodyStyles?: {
        fontSize?: number;
      };
      didDrawCell?: (data: {
        section: "head" | "body";
        column: { index: number };
        cell: { raw: unknown };
      }) => void;
    }) => jsPDF;

    setTextColor(r: number, g: number, b: number): jsPDF;
    setTextColor(r: number[]): jsPDF;
    text(
      text: string | string[],
      x: number,
      y: number,
      options?: {
        align?: "left" | "center" | "right";
        angle?: number;
      }
    ): jsPDF;
    rect(x: number, y: number, w: number, h: number, style?: string): jsPDF;
    roundedRect(
      x: number,
      y: number,
      w: number,
      h: number,
      rx: number,
      ry: number,
      style?: string
    ): jsPDF;
    setFillColor(r: number, g: number, b: number): jsPDF;
    setFillColor(r: number[]): jsPDF;
    setDrawColor(r: number, g: number, b: number): jsPDF;
    setDrawColor(r: number[]): jsPDF;
    line(x1: number, y1: number, x2: number, y2: number): jsPDF;
    addImage(
      imageData: string | HTMLImageElement,
      format: string,
      x: number,
      y: number,
      w: number,
      h: number
    ): jsPDF;
    save(filename: string): jsPDF;
    setPage(pageNumber: number): jsPDF;
    setLineDash(segments: number[]): jsPDF;
  }
}

export const defaultBankBranding: BankBranding = {
  name: "Amen Bank",
  logo: "../amen_logo.png",
  primaryColor: "#003366", // Dark blue
  secondaryColor: "#0055A5", // Lighter blue
  address: ["Avenue Mohamed V", "Tunis 1002", "Tunisie"],
  website: "www.amenbank.com.tn",
  phone: "(+216) 71 148 000",
  email: "contact@amenbank.com.tn",
}

export const defaultStatementConfig: StatementConfig = {
  showLogo: true,
  showFooter: true,
  showPageNumbers: true,
  showBankInfo: true,
  dateFormat: "fr-FR",
  locale: "fr-FR",
  currency: "TND",
  theme: {
    headerColor: [0, 51, 102],       // Dark blue header
    textColor: [33, 33, 33],         // Dark grey text for body
    accentColor: [0, 102, 204],      // Blue accent for borders and highlights
    tableHeaderColor: [0, 51, 102],  // Dark blue table header
    alternateRowColor: [240, 240, 240],
  },
}

export interface GenerateStatementOptions {
  cardDetails: CardDetails
  transactions: Transaction[]
  branding?: Partial<BankBranding>
  config?: Partial<StatementConfig>
}

const formatCurrency = (amount: number, locale: string, currency: string) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export const generateBankStatement = async ({
  cardDetails,
  transactions,
  branding = {},
  config = {},
}: GenerateStatementOptions): Promise<void> => {
  try {
    if (!cardDetails || !transactions.length) {
      throw new Error("Les données ne sont pas disponibles")
    }

    const mergedBranding = { ...defaultBankBranding, ...branding }
    const mergedConfig = { ...defaultStatementConfig, ...config }

    // Create new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // ─── Background Pattern ──────────────────────────────
    const addBackgroundPattern = () => {
      // Fill page with a light background
      doc.setFillColor(250, 250, 250)
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F")
      // Add subtle horizontal lines for texture
      doc.setDrawColor(230, 230, 230)
      for (let i = 0; i < doc.internal.pageSize.getHeight(); i += 10) {
        doc.line(0, i, doc.internal.pageSize.getWidth(), i)
      }
    }
    addBackgroundPattern()

    // ─── Enhanced Header ──────────────────────────────
    const headerHeight = 40
    const headerColor = mergedConfig.theme.headerColor
    // Draw solid header background
    doc.setFillColor(headerColor[0], headerColor[1], headerColor[2])
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), headerHeight, "F")

    // ─── Bank Contact (Top Left) ──────────────────────────────
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(255, 255, 255)
    const bankContact = [
      mergedBranding.name,
      ...mergedBranding.address,
      `Tél: ${mergedBranding.phone}`,
      `Email: ${mergedBranding.email}`,
      `Site web: ${mergedBranding.website}`,
    ]
    // Render bank contact in the top left corner inside the header
    doc.text(bankContact, 10, 10)

    // ─── Title "Relevé bancaire" (Centered Top) ──────────────────────────────
    doc.setFont("helvetica", "bold")
    doc.setFontSize(20)
    doc.text("Relevé bancaire", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" })

    // ─── Bank Logo (Optional, Top Right) ──────────────────────────────
    if (mergedConfig.showLogo) {
      try {
        const img = new Image()
        img.crossOrigin = "anonymous"
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = mergedBranding.logo
        })
        // Position logo at top right within the header area
        doc.addImage(img, "PNG", doc.internal.pageSize.getWidth() - 55, 10, 45, 20)
      } catch (error) {
        console.error("Error loading bank logo:", error)
      }
    }

    // ─── Statement Period (Below Header) ──────────────────────────────
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(
      mergedConfig.theme.textColor[0],
      mergedConfig.theme.textColor[1],
      mergedConfig.theme.textColor[2],
    )
    doc.text(
      `Période: ${firstDayOfMonth.toLocaleDateString(mergedConfig.locale)} - ${today.toLocaleDateString(mergedConfig.locale)}`,
      15,
      headerHeight + 10,
    )

    // ─── Card Information Box ──────────────────────────────
    const cardBoxX = 15,
      cardBoxY = headerHeight + 20,
      cardBoxWidth = 180,
      cardBoxHeight = 35
    // Draw white background for card info box
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(cardBoxX, cardBoxY, cardBoxWidth, cardBoxHeight, 3, 3, "F")
    // Draw dashed border for enhanced visual separation
    doc.setDrawColor(
      mergedConfig.theme.accentColor[0],
      mergedConfig.theme.accentColor[1],
      mergedConfig.theme.accentColor[2],
    )
    doc.setLineDash([2, 2])
    doc.roundedRect(cardBoxX, cardBoxY, cardBoxWidth, cardBoxHeight, 3, 3, "D")
    doc.setLineDash([])

    // Add card details text
    const cardInfoY = cardBoxY + 10
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.setTextColor(
      mergedConfig.theme.textColor[0],
      mergedConfig.theme.textColor[1],
      mergedConfig.theme.textColor[2],
    )
    doc.text(`Titulaire: ${cardDetails.cardHolder}`, cardBoxX + 5, cardInfoY)
    doc.text(`Numéro de carte: ****${cardDetails.cardNumber.slice(-4)}`, cardBoxX + 5, cardInfoY + 8)
    doc.text(
      `Solde actuel: ${formatCurrency(cardDetails.balance, mergedConfig.locale, mergedConfig.currency)}`,
      cardBoxX + 5,
      cardInfoY + 16,
    )

    // ─── Summary Section ──────────────────────────────
    const totalCredit = transactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0)
    const totalDebit = transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0)
    const netBalance = totalCredit - totalDebit

    const summaryBoxY = cardBoxY + cardBoxHeight + 10
    doc.roundedRect(15, summaryBoxY, 180, 40, 3, 3, "F")
    doc.setFillColor(245, 245, 245)
    doc.roundedRect(15, summaryBoxY, 180, 40, 3, 3, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text("Résumé des opérations", 20, summaryBoxY + 12)

    // Display credits, debits, and net balance
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    const summaryY = summaryBoxY + 22
    doc.setTextColor(0, 102, 0) // Green for credits
    doc.text("Total des crédits:", 25, summaryY)
    doc.text(formatCurrency(totalCredit, mergedConfig.locale, mergedConfig.currency), 110, summaryY)
    doc.setTextColor(204, 0, 0) // Red for debits
    doc.text("Total des débits:", 25, summaryY + 8)
    doc.text(formatCurrency(totalDebit, mergedConfig.locale, mergedConfig.currency), 110, summaryY + 8)
    doc.setTextColor(
      mergedConfig.theme.textColor[0],
      mergedConfig.theme.textColor[1],
      mergedConfig.theme.textColor[2],
    )
    doc.text("Solde net:", 25, summaryY + 16)
    doc.setTextColor(netBalance >= 0 ? 0 : 204, netBalance >= 0 ? 102 : 0, netBalance >= 0 ? 0 : 0)
    doc.text(formatCurrency(netBalance, mergedConfig.locale, mergedConfig.currency), 110, summaryY + 16)

    // ─── QR Code for Verification ──────────────────────────────
    const qrData = await QRCode.toDataURL(
      JSON.stringify({
        cardNumber: cardDetails.cardNumber.slice(-4),
        date: new Date().toISOString(),
        totalCredit,
        totalDebit,
      }),
    )
    doc.addImage(qrData, "PNG", 155, summaryBoxY + 5, 30, 30)

    // ─── Transactions Table ──────────────────────────────
    const tableHead = [["Date", "Description", "Montant", "Catégorie"]]
    const tableData = transactions.map((t) => [
      t.date,
      t.merchant,
      t.type === "debit"
        ? `-${formatCurrency(t.amount, mergedConfig.locale, mergedConfig.currency)}`
        : formatCurrency(t.amount, mergedConfig.locale, mergedConfig.currency),
      t.category,
    ])

    doc.autoTable({
      startY: summaryBoxY + 50,
      head: tableHead,
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 6,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: mergedConfig.theme.tableHeaderColor,
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center" },
        2: { halign: "right" },
        3: { halign: "center" },
      },
      alternateRowStyles: {
        fillColor: mergedConfig.theme.alternateRowColor,
      },
      bodyStyles: {
        fontSize: 10,
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 2) {
          const amount = data.cell.raw as string
          if (amount.startsWith("-")) {
            doc.setTextColor(204, 0, 0) // Red for debits
          } else {
            doc.setTextColor(0, 102, 0) // Green for credits
          }
        }
      },
    })

    // ─── Footer ──────────────────────────────
    if (mergedConfig.showFooter) {
      // Cast doc.internal to any so that we can use the extra method getNumberOfPages without type conflict.
      const pageCount = (doc.internal as any).getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        // Footer background matching header color
        doc.setFillColor(headerColor[0], headerColor[1], headerColor[2])
        doc.rect(0, doc.internal.pageSize.getHeight() - 20, doc.internal.pageSize.getWidth(), 20, "F")
        // Page number and generation timestamp
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(255, 255, 255)
        if (mergedConfig.showPageNumbers) {
          doc.text(
            `Page ${i} sur ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 7,
            { align: "center" },
          )
        }
        doc.text(
          `Généré le ${new Date().toLocaleDateString(mergedConfig.locale)} à ${new Date().toLocaleTimeString(mergedConfig.locale)}`,
          10,
          doc.internal.pageSize.getHeight() - 7,
        )
      }
    }

    // ─── Save PDF ──────────────────────────────
    const fileName = `releve_${cardDetails.cardHolder.replace(/\s+/g, "_").toLowerCase()}_${new Date()
      .toISOString()
      .split("T")[0]}.pdf`
    doc.save(fileName)
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error)
    throw error
  }
}