import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
export const extractPdfText = async (buffer) => {
    const pdf = await getDocument({
        data: new Uint8Array(buffer),
    }).promise;
    let text = "";
    for (let page = 1; page <= pdf.numPages; page++) {
        const currentPage = await pdf.getPage(page);
        const content = await currentPage.getTextContent();
        const pageText = content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ");
        text += pageText + "\n";
    }
    return text.trim();
};
