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
  
      // Simplified internal type extension
      internal: {
        getNumberOfPages(): number;
        pageSize: {
          getWidth(): number;
          getHeight(): number;
        };
      } & jsPDF["internal"]; // Merge with existing internal type
  
      // Standard method declarations
      setTextColor(r: number, g: number, b: number): jsPDF;
      setTextColor(r: number[]): jsPDF;
      text(
        text: string | string[],
        x: number,
        y: number,
        options?: {
          align?: "left" | "center" | "right";
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
    }
  }

export const defaultBankBranding: BankBranding = {
  name: "Amen Bank",
  logo: "../amen_logo.png",
  primaryColor: "#4CAF50",
  secondaryColor: "#388E3C",
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
    headerColor: [76, 175, 80],
    textColor: [0, 0, 0],
    accentColor: [56, 142, 60],
    tableHeaderColor: [76, 175, 80],
    alternateRowColor: [245, 245, 245],
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

    // Add subtle background pattern
    const addBackgroundPattern = () => {
      doc.setFillColor(245, 245, 245)
      doc.setDrawColor(230, 230, 230)
      for (let i = 0; i < doc.internal.pageSize.height; i += 10) {
        doc.line(0, i, doc.internal.pageSize.width, i)
      }
    }

    // Add background pattern to all pages
    addBackgroundPattern()

    // Add decorative header bar
    const headerColor = mergedConfig.theme.headerColor
    doc.setFillColor(headerColor[0], headerColor[1], headerColor[2])
    doc.rect(0, 0, doc.internal.pageSize.width, 35, "F")

    // Load and add bank logo with better positioning
    if (mergedConfig.showLogo) {
      try {
        const img = new Image()
        img.crossOrigin = "anonymous"
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = mergedBranding.logo
        })
        doc.addImage(img, "PNG", 15, 5, 30, 15)
      } catch (error) {
        console.error("Error loading bank logo:", error)
      }
    }

    // Add bank information with improved styling
    if (mergedConfig.showBankInfo) {
      doc.setFontSize(8)
      doc.setTextColor(255, 255, 255)
      const bankInfo = [
        mergedBranding.name,
        ...mergedBranding.address,
        `Tél: ${mergedBranding.phone}`,
        `Email: ${mergedBranding.email}`,
        `Site web: ${mergedBranding.website}`,
      ]
      doc.text(bankInfo, doc.internal.pageSize.width - 45, 12, { align: "right" })
    }

    // Add statement header with enhanced design
    doc.setFontSize(24)
    doc.setTextColor(255, 255, 255)
    doc.text("Relevé bancaire", 15, 20)

    // Add statement period with better positioning
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    doc.setFontSize(10)
    const textColor = mergedConfig.theme.textColor
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.text(
      `Période: ${firstDayOfMonth.toLocaleDateString(mergedConfig.locale)} - ${today.toLocaleDateString(
        mergedConfig.locale,
      )}`,
      15,
      45,
    )

    // Add card info in a styled box
    const accentColor = mergedConfig.theme.accentColor
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setFillColor(250, 250, 250)
    doc.roundedRect(15, 50, 180, 35, 3, 3, "FD")

    // Add card info with icons and better formatting
    const cardInfoY = 58
    doc.setFontSize(12)
    doc.text(`Titulaire: ${cardDetails.cardHolder}`, 20, cardInfoY)
    doc.text(`Numéro de carte: ****${cardDetails.cardNumber.slice(-4)}`, 20, cardInfoY + 8)
    doc.text(
      `Solde actuel: ${formatCurrency(cardDetails.balance, mergedConfig.locale, mergedConfig.currency)}`,
      20,
      cardInfoY + 16,
    )

    // Add summary section with enhanced styling
    const totalCredit = transactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0)
    const totalDebit = transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0)

    // Add summary box
    doc.roundedRect(15, 90, 180, 40, 3, 3, "FD")

    doc.setFontSize(14)
    doc.text("Résumé des opérations", 20, 100)

    // Add summary with colored amounts
    const summaryY = 110
    doc.setFontSize(11)
    doc.text("Total des crédits:", 25, summaryY)
    doc.setTextColor(46, 125, 50) // Green for credits
    doc.text(formatCurrency(totalCredit, mergedConfig.locale, mergedConfig.currency), 90, summaryY)

    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.text("Total des débits:", 25, summaryY + 8)
    doc.setTextColor(211, 47, 47) // Red for debits
    doc.text(formatCurrency(totalDebit, mergedConfig.locale, mergedConfig.currency), 90, summaryY + 8)

    doc.text("Solde net:", 25, summaryY + 16)
    const netBalance = totalCredit - totalDebit
    doc.setTextColor(netBalance >= 0 ? 46 : 211, netBalance >= 0 ? 125 : 47, netBalance >= 0 ? 50 : 47)
    doc.text(formatCurrency(netBalance, mergedConfig.locale, mergedConfig.currency), 90, summaryY + 16)

    // Generate QR code for digital verification
    const qrData = await QRCode.toDataURL(
      JSON.stringify({
        cardNumber: cardDetails.cardNumber.slice(-4),
        date: new Date().toISOString(),
        totalCredit,
        totalDebit,
      }),
    )
    doc.addImage(qrData, "PNG", 160, 95, 30, 30)

    // Add transactions table with improved styling
    const tableData = transactions.map((t) => [
      t.date,
      t.merchant,
      t.type === "debit"
        ? `-${formatCurrency(t.amount, mergedConfig.locale, mergedConfig.currency)}`
        : formatCurrency(t.amount, mergedConfig.locale, mergedConfig.currency),
      t.category,
    ])

    doc.autoTable({
      startY: 140,
      head: [["Date", "Description", "Montant", "Catégorie"]],
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
            doc.setTextColor(211, 47, 47) // Red for debits
          } else {
            doc.setTextColor(46, 125, 50) // Green for credits
          }
        }
      },
    })

    // Add footer with enhanced design
    if (mergedConfig.showFooter) {
      const pageCount = doc.internal.getNumberOfPages()

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)

        // Add decorative footer bar
        doc.setFillColor(headerColor[0], headerColor[1], headerColor[2])
        doc.rect(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20, "F")

        // Add page numbers if enabled
        if (mergedConfig.showPageNumbers) {
          doc.setFontSize(9)
          doc.setTextColor(255, 255, 255)
          doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 7, {
            align: "center",
          })
        }

        // Add generation timestamp
        doc.setFontSize(8)
        doc.setTextColor(255, 255, 255)
        doc.text(
          `Document généré le ${new Date().toLocaleDateString(mergedConfig.locale)} à ${new Date().toLocaleTimeString(
            mergedConfig.locale,
          )}`,
          15,
          doc.internal.pageSize.height - 7,
        )

        // Add security notice
        doc.text("Document bancaire confidentiel", doc.internal.pageSize.width - 15, doc.internal.pageSize.height - 7, {
          align: "right",
        })
      }
    }

    // Save the PDF
    const fileName = `releve_${cardDetails.cardHolder
      .replace(/\s+/g, "_")
      .toLowerCase()}_${new Date().toISOString().split("T")[0]}.pdf`
    doc.save(fileName)
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error)
    throw error
  }
}

