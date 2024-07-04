import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const createInvoicePdf = async ({
    title = '',
    invoiceNumber = '',
    date,
    customerName,
    customerId,
    tableNumber,
    tableData,
    totalAmount
}) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const contentFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Invoice title
    page.drawText(title, {
        x: 50,
        y: height - 50,
        size: 20,
        font: titleFont,
        color: rgb(0, 0, 0)
    });

    // Invoice details
    const invoiceDetails = [
        { label: 'Invoice Number:', value: invoiceNumber },
        { label: 'Date:', value: date },
        { label: 'Customer Id:', value: customerId },
        { label: 'Customer Name:', value: customerName },
        { label: 'Table Number:', value: tableNumber }
    ];

    let y = height - 100;
    const detailsX = 50; // Adjusted to move to the left side
    const labelX = detailsX;
    const valueX = detailsX + 120; // Adjust spacing to avoid cutting off text

    invoiceDetails.forEach(({ label, value }) => {
        page.drawText(label, {
            x: labelX,
            y,
            size: 12,
            font: contentFont,
            color: rgb(0, 0, 0)
        });

        page.drawText(value, {
            x: valueX,
            y,
            size: 12,
            font: contentFont,
            color: rgb(0, 0, 0)
        });

        y -= 20;
    });

    const columnWidths = [250, 100, 100];
    const rowHeight = 30;
    const tableStartY = height - 200;

    // Draw table headers
    y = tableStartY;
    page.drawRectangle({
        x: 50,
        y: y - rowHeight,
        width: width - 100,
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        color: rgb(0.9, 0.9, 0.9)
    });

    tableData[0].forEach((header, i) => {
        page.drawText(header, {
            x: 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 10,
            y: y - 20,
            size: 14, // Increased font size for table headers
            font: contentFont,
            color: rgb(0, 0, 0)
        });
    });

    // Draw table rows
    y -= rowHeight;
    tableData.slice(1).forEach((row, rowIndex) => {
        const bgColor = rowIndex % 2 === 0 ? rgb(0.95, 0.95, 0.95) : rgb(1, 1, 1);
        page.drawRectangle({
            x: 50,
            y: y - rowHeight,
            width: width - 100,
            height: rowHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
            color: bgColor
        });

        row.forEach((cell, cellIndex) => {
            page.drawText(cell, {
                x: 50 + columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0) + 10,
                y: y - 20,
                size: 12, // Increased font size for table data
                font: contentFont,
                color: rgb(0, 0, 0)
            });
        });

        y -= rowHeight;
    });

    page.drawText(`Total Amount: ${totalAmount}rs`, {
        x: 50,
        y: y - 40,
        size: 12,
        font: contentFont,
        color: rgb(0, 0, 0)
    });

    // Footer
    page.drawText('Thank you for dining with us!', {
        x: 50,
        y: 50,
        size: 12,
        font: contentFont,
        color: rgb(0, 0, 0)
    });

    // Save the PDF to a file or buffer
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};
