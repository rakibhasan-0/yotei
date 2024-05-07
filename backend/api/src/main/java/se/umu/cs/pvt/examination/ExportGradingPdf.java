package se.umu.cs.pvt.examination;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.tomcat.util.json.JSONParser;
import org.springframework.boot.json.JsonParserFactory;

import com.fasterxml.jackson.core.JsonParser;

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
    private Long grading_id;
    private String grading_protocol;
    private final int   MAX_NUM_COLUMNS = 6,
                        MAX_NUM_ROWS = 15,
                        TABLE_START_X_POS = 50,
                        CELL_HEIGHT = 30,
                        CELL_WIDTH = 100;

    public ExportGradingPdf(Long grading_id, List<Examinee> examinees) throws IOException {
        this.examinees = examinees;
        this.totalNumColumns = examinees.size() + 1;
        this.numPages = (int)Math.ceil((double)examinees.size() / MAX_NUM_COLUMNS);
        document = new PDDocument();
        this.grading_id = grading_id;
        this.grading_protocol = Files.readString(Paths.get(System.getProperty("user.dir") + "/frontend/public/grading_protocol_yellow_1.json"));
    }

    public void drawImage(String path, int x, int y, PDPageContentStream contentStream) throws IOException {
        PDImageXObject pdImage = PDImageXObject.createFromFile(path, document);
        contentStream.drawImage(pdImage, x, y, 100, 50);
    }

    public Map<String, Object> parseJson(String json) {
        org.springframework.boot.json.JsonParser parser = JsonParserFactory.getJsonParser();
        return parser.parseMap(json);
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
        Map<String, Object> protocol = parseJson(grading_protocol);
        Map<String, Object> gradingProtocolObj = (Map<String, Object>) protocol.get("grading_protocol");

        String code = (String) gradingProtocolObj.get("code");
        String color = (String) gradingProtocolObj.get("color");
        System.out.println("Code: " + code);
        System.out.println("Color: " + color);

        createHeader(code + " " + color, "test, test2, test3", "2024-05-07", contentStream);

        drawImage(System.getProperty("user.dir") + "/frontend/public/ubk-logga.jpg", (int)page.getMediaBox().getWidth() - 163, pageHeight-60, contentStream);

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


    private void createHeader(String belt_name, String categories, String date, PDPageContentStream contentStream) throws IOException {
        PDType0Font font = PDType0Font.load(document, new File("/usr/share/fonts/gnu-free/FreeSans.ttf"));
        int initX = TABLE_START_X_POS;
        int initY = pageHeight-75;

        //Set header data
        contentStream.beginText();
        contentStream.setFont(font, 12);
        contentStream.newLineAtOffset(initX, initY + 50);
        contentStream.showText("Graderingprotokoll");
        contentStream.newLineAtOffset(0, -15);
        contentStream.showText(belt_name);
        contentStream.newLineAtOffset(0, -15);
        contentStream.showText(categories);
        contentStream.newLineAtOffset(0, -15);
        contentStream.showText(date);
        contentStream.endText();
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
