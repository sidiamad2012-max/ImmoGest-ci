import { jsPDF } from 'jspdf';

export interface PaymentData {
  id: string | number;
  month: string;
  amount: number;
  dueDate: string;
  paidDate: string;
  method: string;
  status: string;
  lateFee?: number;
}

export interface TenantInfo {
  name: string;
  apartment: string;
  email?: string;
  phone?: string;
}

export interface PropertyInfo {
  name: string;
  address: string;
  phone?: string;
  email?: string;
}

export class ReceiptGenerator {
  private static defaultPropertyInfo: PropertyInfo = {
    name: 'Résidence Les Palmiers',
    address: 'Boulevard Lagunaire, Cocody, Abidjan, Côte d\'Ivoire',
    phone: '+225 05 67 89 01 23',
    email: 'contact@palmiers-residence.ci'
  };

  static generateReceipt(
    payment: PaymentData,
    tenant: TenantInfo,
    property: PropertyInfo = this.defaultPropertyInfo
  ): void {
    const receiptContent = this.createReceiptHTML(payment, tenant, property);
    this.printReceipt(receiptContent, `Recu_${payment.month.replace(/\s+/g, '_')}_${tenant.name.replace(/\s+/g, '_')}`);
  }

  static generateMultipleReceipts(
    payments: PaymentData[],
    tenant: TenantInfo,
    property: PropertyInfo = this.defaultPropertyInfo
  ): void {
    const receiptsContent = payments.map(payment => 
      this.createReceiptHTML(payment, tenant, property)
    ).join('<div style="page-break-after: always;"></div>');
    
    this.printReceipt(receiptsContent, `Recus_${tenant.name.replace(/\s+/g, '_')}_${new Date().getFullYear()}`);
  }

  private static createReceiptHTML(
    payment: PaymentData,
    tenant: TenantInfo,
    property: PropertyInfo
  ): string {
    const totalAmount = payment.amount + (payment.lateFee || 0);
    
    return `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: white; border: 1px solid #ddd;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; font-size: 24px; margin: 0;">REÇU DE PAIEMENT</h1>
        </div>

        <!-- Property and Receipt Info -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h3 style="color: #333; margin: 0 0 10px 0;">${property.name}</h3>
            <p style="color: #666; margin: 5px 0; line-height: 1.4;">${property.address}</p>
            ${property.phone ? `<p style="color: #666; margin: 5px 0;">Tél: ${property.phone}</p>` : ''}
            ${property.email ? `<p style="color: #666; margin: 5px 0;">Email: ${property.email}</p>` : ''}
          </div>
          <div style="text-align: right;">
            <p style="color: #666; margin: 5px 0;">N° Reçu: REC-${payment.id}</p>
            <p style="color: #666; margin: 5px 0;">Date d'émission: ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        <hr style="border: none; border-top: 2px solid #eee; margin: 20px 0;">

        <!-- Payment Details -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; font-size: 18px; margin-bottom: 20px;">DÉTAILS DU PAIEMENT</h2>
          
          <!-- Tenant Info -->
          <div style="margin-bottom: 20px;">
            <div style="display: flex; margin-bottom: 10px;">
              <strong style="width: 150px; color: #333;">Locataire:</strong>
              <span style="color: #666;">${tenant.name}</span>
            </div>
            <div style="display: flex; margin-bottom: 10px;">
              <strong style="width: 150px; color: #333;">Logement:</strong>
              <span style="color: #666;">${tenant.apartment}</span>
            </div>
          </div>

          <!-- Payment Info -->
          <div style="margin-bottom: 20px;">
            <div style="display: flex; margin-bottom: 10px;">
              <strong style="width: 150px; color: #333;">Période:</strong>
              <span style="color: #666;">${payment.month}</span>
            </div>
            <div style="display: flex; margin-bottom: 10px;">
              <strong style="width: 150px; color: #333;">Montant du loyer:</strong>
              <span style="color: #666;">${payment.amount.toLocaleString()} FCFA</span>
            </div>
            ${payment.lateFee && payment.lateFee > 0 ? `
              <div style="display: flex; margin-bottom: 10px;">
                <strong style="width: 150px; color: #333;">Frais de retard:</strong>
                <span style="color: #e67e22;">${payment.lateFee.toLocaleString()} FCFA</span>
              </div>
            ` : ''}
            <div style="display: flex; margin-bottom: 10px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
              <strong style="width: 150px; color: #333; font-size: 16px;">Total payé:</strong>
              <strong style="color: #27ae60; font-size: 16px;">${totalAmount.toLocaleString()} FCFA</strong>
            </div>
          </div>

          <!-- Dates and Method -->
          <div style="margin-bottom: 20px;">
            <div style="display: flex; margin-bottom: 10px;">
              <strong style="width: 150px; color: #333;">Date d'échéance:</strong>
              <span style="color: #666;">${new Date(payment.dueDate).toLocaleDateString('fr-FR')}</span>
            </div>
            <div style="display: flex; margin-bottom: 10px;">
              <strong style="width: 150px; color: #333;">Date de paiement:</strong>
              <span style="color: #666;">${new Date(payment.paidDate).toLocaleDateString('fr-FR')}</span>
            </div>
            <div style="display: flex; margin-bottom: 10px;">
              <strong style="width: 150px; color: #333;">Méthode de paiement:</strong>
              <span style="color: #666;">${payment.method}</span>
            </div>
            <div style="display: flex; margin-bottom: 10px;">
              <strong style="width: 150px; color: #333;">Statut:</strong>
              <span style="color: ${payment.status.includes('Retard') ? '#e67e22' : '#27ae60'}; font-weight: bold;">${payment.status}</span>
            </div>
          </div>
        </div>

        <hr style="border: none; border-top: 2px solid #eee; margin: 20px 0;">

        <!-- Footer -->
        <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
          <p style="margin: 5px 0;">Ce reçu constitue une preuve de paiement officielle.</p>
          <p style="margin: 5px 0;">Conservez ce document pour vos archives.</p>
        </div>
      </div>
    `;
  }

  private static printReceipt(content: string, filename: string): void {
    try {
      // Method 1: Try to use window.open with better error handling
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (printWindow && printWindow.document) {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>${filename}</title>
              <meta charset="utf-8">
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: Arial, sans-serif; 
                  background: #f5f5f5; 
                }
                @media print {
                  body { 
                    background: white; 
                    padding: 0; 
                  }
                  .no-print { 
                    display: none; 
                  }
                }
                .print-button {
                  position: fixed;
                  top: 20px;
                  right: 20px;
                  background: #007bff;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 14px;
                  z-index: 1000;
                }
                .print-button:hover {
                  background: #0056b3;
                }
                .download-button {
                  position: fixed;
                  top: 20px;
                  right: 200px;
                  background: #28a745;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 14px;
                  z-index: 1000;
                }
                .download-button:hover {
                  background: #1e7e34;
                }
              </style>
            </head>
            <body>
              <button class="print-button no-print" onclick="window.print()">Imprimer</button>
              <button class="download-button no-print" onclick="downloadPDF()">Sauvegarder PDF</button>
              ${content}
              <script>
                function downloadPDF() {
                  window.print();
                }
                
                // Auto print after a short delay
                setTimeout(function() {
                  window.focus();
                }, 100);
              </script>
            </body>
          </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        return;
      } else {
        throw new Error('Popup blocked');
      }
    } catch (error) {
      // Method 2: Fallback to blob URL approach
      try {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>${filename}</title>
              <meta charset="utf-8">
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: Arial, sans-serif; 
                  background: white; 
                }
                @media print {
                  body { 
                    padding: 0; 
                  }
                  .no-print { 
                    display: none; 
                  }
                }
                .print-controls {
                  position: fixed;
                  top: 20px;
                  right: 20px;
                  background: white;
                  padding: 10px;
                  border-radius: 5px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                  z-index: 1000;
                }
                .print-button, .close-button {
                  background: #007bff;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 3px;
                  cursor: pointer;
                  font-size: 14px;
                  margin: 0 5px;
                }
                .print-button:hover {
                  background: #0056b3;
                }
                .close-button {
                  background: #dc3545;
                }
                .close-button:hover {
                  background: #c82333;
                }
              </style>
            </head>
            <body>
              <div class="print-controls no-print">
                <button class="print-button" onclick="window.print()">Imprimer / PDF</button>
                <button class="close-button" onclick="window.close()">Fermer</button>
              </div>
              ${content}
              <script>
                // Focus window when opened
                window.focus();
                
                // Add keyboard shortcut for printing
                document.addEventListener('keydown', function(e) {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                    e.preventDefault();
                    window.print();
                  }
                });
              </script>
            </body>
          </html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const newWindow = window.open(url, '_blank');
        
        if (newWindow) {
          // Clean up the URL after the window is opened
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);
        } else {
          throw new Error('Popup still blocked');
        }
      } catch (secondError) {
        // Method 3: Create a temporary iframe in the current page
        this.printReceiptInline(content, filename);
      }
    }
  }

  private static printReceiptInline(content: string, filename: string): void {
    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    
    document.body.appendChild(iframe);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <meta charset="utf-8">
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif; 
              background: white;
              font-size: 14px;
              line-height: 1.6;
            }
            @media print {
              body { 
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;

    if (iframe.contentDocument) {
      iframe.contentDocument.write(htmlContent);
      iframe.contentDocument.close();

      // Wait for the content to load, then print
      setTimeout(() => {
        try {
          if (iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          }
        } catch (printError) {
          console.error('Erreur lors de l\'impression:', printError);
          // As last resort, show content in a modal or alert
          this.showReceiptModal(content, filename);
        }

        // Clean up the iframe after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    } else {
      // Clean up if iframe creation failed
      document.body.removeChild(iframe);
      this.showReceiptModal(content, filename);
    }
  }

  private static showReceiptModal(content: string, filename: string): void {
    // Create a modal dialog to show the receipt content
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '10000';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '20px';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '10px';
    modalContent.style.maxWidth = '800px';
    modalContent.style.maxHeight = '90vh';
    modalContent.style.overflow = 'auto';
    modalContent.style.position = 'relative';

    const header = document.createElement('div');
    header.style.position = 'sticky';
    header.style.top = '0';
    header.style.backgroundColor = 'white';
    header.style.padding = '15px 20px';
    header.style.borderBottom = '1px solid #eee';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';

    const title = document.createElement('h3');
    title.textContent = filename;
    title.style.margin = '0';
    title.style.color = '#333';

    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.padding = '5px';
    closeButton.style.color = '#666';

    const printButton = document.createElement('button');
    printButton.textContent = 'Imprimer';
    printButton.style.backgroundColor = '#007bff';
    printButton.style.color = 'white';
    printButton.style.border = 'none';
    printButton.style.padding = '8px 16px';
    printButton.style.borderRadius = '5px';
    printButton.style.cursor = 'pointer';
    printButton.style.marginRight = '10px';

    const bodyContent = document.createElement('div');
    bodyContent.innerHTML = content;
    bodyContent.style.padding = '20px';

    header.appendChild(title);
    const buttonGroup = document.createElement('div');
    buttonGroup.appendChild(printButton);
    buttonGroup.appendChild(closeButton);
    header.appendChild(buttonGroup);

    modalContent.appendChild(header);
    modalContent.appendChild(bodyContent);
    modal.appendChild(modalContent);

    // Event listeners
    closeButton.onclick = () => document.body.removeChild(modal);
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };
    printButton.onclick = () => {
      window.print();
    };

    document.body.appendChild(modal);

    // Add escape key listener
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.body.removeChild(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }
}