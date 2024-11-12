import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

function bebidaPDF(bebidas) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const reportTitle = [
        {
            text: 'Bebidas',
            fontSize: 15,
            bold: true,
            margin: [15, 20, 0, 45] // left, top, right, bottom
        }
    ];

    const dados = bebidas.map((bebida) => [
        { text: bebida.codigo, fontSize: 9, margin: [0, 2, 0, 2] },
        { text: bebida.nome, fontSize: 9, margin: [0, 2, 0, 2] },
        { text: bebida.ml_litro, fontSize: 9, margin: [0, 2, 0, 2] },
        { text: bebida.preco, fontSize: 9, margin: [0, 2, 0, 2] },
        { text: bebida.quantidade, fontSize: 9, margin: [0, 2, 0, 2] }
    ]);

    const details = [
        {
            table: {
                headerRows: 1,
                widths: ['*', '*', '*', '*', '*'],
                body: [
                    [
                        { text: 'Código', style: 'tableHeader', fontSize: 10 },
                        { text: 'Nome', style: 'tableHeader', fontSize: 10 },
                        { text: 'Quantidade ML-L', style: 'tableHeader', fontSize: 10 },
                        { text: 'Preço', style: 'tableHeader', fontSize: 10 },
                        { text: 'Quantidade em Estoque', style: 'tableHeader', fontSize: 10 }
                    ],
                    ...dados
                ]
            },
            layout: 'lightHorizontalLines'
        }
    ];

    // Função simplificada para o rodapé
    const Rodape = (currentPage, pageCount) => [
        {
            text: `${currentPage} / ${pageCount}`,
            alignment: 'right',
            fontSize: 9,
            margin: [0, 10, 20, 0] // left, top, right, bottom
        }
    ];

    // Corrigindo o nome da variável para algo mais claro
    const docDefinitions = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40],
        header: [reportTitle],
        content: [details],
        footer: Rodape
    };

    pdfMake.createPdf(docDefinitions).download();
}

export default bebidaPDF;
