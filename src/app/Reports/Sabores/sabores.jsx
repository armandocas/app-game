import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

function saboresPDF(sabores) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const reportTitle = [
        {
            text: 'Sabores',
            fontSize: 15,
            bold: true,
            margin: [15, 20, 0, 45] // left, top, right, bottom
        }
    ];

    const dados = sabores.map((sabor) => {
        return [
            { text: sabor.codigo, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: sabor.sabor, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: sabor.ingredientes, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: sabor.preco, fontSize: 9, margin: [0, 2, 0, 2] }
        ]
    });

    const details = [
        {
            table: {
                headerRows: 1,
                widths: ['*', '*', '*', '*'],
                body: [
                    [
                        { text: 'Código', style: 'tableHeader', fontSize: 10 },
                        { text: 'Sabor', style: 'tableHeader', fontSize: 10 },
                        { text: 'Ingredientes', style: 'tableHeader', fontSize: 10 },
                        { text: 'Preço', style: 'tableHeader', fontSize: 10 }
                    ],
                    ...dados
                ]
            },
            layout: 'lightHorizontalLines' // headerLineOnly
        }
    ];

    function Rodape(currentPage, pageCount) {
        return [
            {
                text: currentPage + ' / ' + pageCount,
                alignment: 'right',
                fontSize: 9,
                margin: [0, 10, 20, 0] // left, top, right, bottom
            }
        ]
    }

    const docDefinitios = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40],

        header: [reportTitle],
        content: [details],
        footer: Rodape
    }

    pdfMake.createPdf(docDefinitios).download();
}

export default saboresPDF;