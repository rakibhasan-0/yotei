package se.umu.cs.pvt.examination;

import java.io.IOException;
import java.util.ArrayList;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.List;


public class ExportGradingPdf {


    private List<Examinee> examinees;
    private final int totalNumColumns;
    private final int numPages;
    private PDDocument document;
    private int pageWidth, pageHeight;
    private final int   MAX_NUM_COLUMNS = 6,
                        MAX_NUM_ROWS = 15,
                        TABLE_START_X_POS = 50,
                        CELL_HEIGHT = 30,
                        CELL_WIDTH = 100;

    public ExportGradingPdf(List<Examinee> examinees) {
        this.examinees = examinees;
        this.totalNumColumns = examinees.size() + 1;
        this.numPages = (int)Math.ceil((double)examinees.size() / MAX_NUM_COLUMNS);
        document = new PDDocument();
    }

    public void createTable(int onPage) throws IOException {
        PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
        document.addPage(page);

        pageWidth = (int)page.getMediaBox().getWidth(); //get width of the page
        pageHeight = (int)page.getMediaBox().getHeight(); //get height of the page

        int initX = TABLE_START_X_POS;
        int initY = pageHeight-75;

        PDType0Font font = PDType0Font.load(document, new File("/usr/share/fonts/gnu-free/FreeSans.ttf"));
        PDPageContentStream contentStream = new PDPageContentStream(document,page);
        contentStream.setStrokingColor(Color.DARK_GRAY);
        contentStream.setLineWidth(1);

        //Set header data
        contentStream.beginText();
        contentStream.setFont(font, 12);
        contentStream.newLineAtOffset(initX, initY + 50);
        contentStream.showText("Graderingprotokoll");
        contentStream.newLineAtOffset(0, -15);
        contentStream.showText("5 KYU GULT BÄLTE");
        contentStream.newLineAtOffset(0, -15);
        contentStream.showText("Kihon waza, jigo waza, renraku waza, randori");
        contentStream.endText();

        contentStream.addRect(initX,initY,CELL_WIDTH+30, -CELL_HEIGHT);
        contentStream.beginText();
        contentStream.newLineAtOffset(initX+10,initY-CELL_HEIGHT+10);
        contentStream.setFont(font,10);
        contentStream.showText("Namn");
        contentStream.endText();

        for(int i = 1; i<=1;i++) {
            initX+=CELL_WIDTH+30;
            for(int j = (onPage*MAX_NUM_COLUMNS); j<(onPage*MAX_NUM_COLUMNS)+MAX_NUM_COLUMNS && j < examinees.size();j++){
                contentStream.addRect(initX,initY,CELL_WIDTH,-CELL_HEIGHT);

                contentStream.beginText();
                contentStream.newLineAtOffset(initX+10,initY-CELL_HEIGHT+10);
                contentStream.setFont(font,10);

                contentStream.showText(stripName(examinees.get(j).getName()));
                contentStream.endText();

                initX+=CELL_WIDTH;

            }
            initX = TABLE_START_X_POS;
            initY -=CELL_HEIGHT;
        }


        contentStream.stroke();
        contentStream.close();
    }

    public void generate() throws IOException {
        for(int i = 0; i < numPages; i++) {
            this.createTable(i);
        }

        document.save("/home/marcus/school/yotei/test.pdf");
        document.close();
        System.out.println("table pdf created");
    }

    private String stripName(String name) {
        if(name.length() > 15) {
            name = name.substring(0, 12);
            name = name + "...";
        }
        return name;
    }
}
