import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

function visitantesPDF(visitantes) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const reportTitle = [
        {
            text: 'Relatório de Visitantes',
            fontSize: 15,
            bold: true,
            margin: [15, 20, 0, 45] // left, top, right, bottom
        }
    ];

    const dados = visitantes.map((visitante) => {
        return [
            { text: visitante.fullName, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: visitante.phoneWhatsApp, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: visitante.street},
            { text: visitante.street + ', ' + visitante.num + (visitante.complement ? ', ' + visitante.complement : '') + ', ' + visitante.district, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: visitante.city + ', ' + visitante.uf + ', ' + visitante.postalCode, fontSize: 9, margin: [0, 2, 0, 2] }
        ]
    });
    console.log("🚀 ~ file: visitantes.jsx:24 ~ dados ~ dados:", dados)

    const details = [
        {
            table: {
                headerRows: 1,
                widths: ['*', '*', '*', '*', '*'],
                body: [
                    [
                        { text: 'Nome', style: 'tableHeader', fontSize: 10 },
                        { text: 'WhatsApp', style: 'tableHeader', fontSize: 10 },
                        { text: 'Endereço', style: 'tableHeader', fontSize: 10 },
                        { text: 'TESTE', style: 'tableHeader', fontSize: 10 },
                        { text: 'Cidade/UF/CEP', style: 'tableHeader', fontSize: 10 }
                    ],
                    ...dados
                ]
            },
            layout: 'lightHorizontalLines'
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

export default visitantesPDF;
