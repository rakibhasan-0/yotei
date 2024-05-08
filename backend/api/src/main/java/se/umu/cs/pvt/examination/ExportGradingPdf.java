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

import se.umu.cs.pvt.technique.Technique;

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
    private String gradingProtocol;
    private List<ExaminationTechniqueCategory> examinationTechniqueCategories;
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
        this.gradingProtocol = Files.readString(Paths.get(System.getProperty("user.dir") + "/frontend/public/grading_protocol_yellow_1.json"));
        this.examinationTechniqueCategories = new ArrayList<>();
    }

    private void drawImage(String path, int x, int y, PDPageContentStream contentStream) throws IOException {
        PDImageXObject pdImage = PDImageXObject.createFromFile(path, document);
        contentStream.drawImage(pdImage, x, y, 100, 50);
    }

    private Map<String, Object> parseJson(String json) {
        org.springframework.boot.json.JsonParser parser = JsonParserFactory.getJsonParser();
        return parser.parseMap(json);
    }


    private void createTable(int onPage) throws IOException {
        PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
        document.addPage(page);

        pageWidth = (int)page.getMediaBox().getWidth(); //get width of the page
        pageHeight = (int)page.getMediaBox().getHeight(); //get height of the page

        int initX = TABLE_START_X_POS;
        int initY = pageHeight-75;

        PDType0Font font = PDType0Font.load(document, new File("/usr/share/fonts/noto/NotoSans-Regular.ttf"));
        PDPageContentStream contentStream = new PDPageContentStream(document,page);
        contentStream.setStrokingColor(Color.DARK_GRAY);
        contentStream.setLineWidth(1);
        Map<String, Object> protocol = parseJson(gradingProtocol);
        Map<String, Object> gradingProtocolObj = (Map<String, Object>) protocol.get("grading_protocol");

        String code = (String) gradingProtocolObj.get("code");
        String color = (String) gradingProtocolObj.get("color");

        createHeader(code + " " + color, "test, test2, test3", "2024-05-07", contentStream);

        drawImage(System.getProperty("user.dir") + "/frontend/public/ubk-logga.jpg", (int)page.getMediaBox().getWidth() - 163, pageHeight-60, contentStream);

        writeToCell(initX, initY, contentStream, "Namn", font);
        int count = 1;
        for(int i = 1; i<=1;i++) {
            initX+=CELL_WIDTH+30;
            for(int j = (onPage*MAX_NUM_COLUMNS); j<(onPage*MAX_NUM_COLUMNS)+MAX_NUM_COLUMNS && j < examinees.size();j++){
                contentStream.addRect(initX,initY,CELL_WIDTH,-CELL_HEIGHT);

                writeToCell(initX, initY, contentStream, examinees.get(j).getName(), font);

                initX+=CELL_WIDTH;
                count++;
            }
            initX = TABLE_START_X_POS;
            initY -=CELL_HEIGHT;
        }


        for(int i = 0; i < examinationTechniqueCategories.size(); i++) {
                
            contentStream.addRect(initX, initY, CELL_WIDTH*count+30, -CELL_HEIGHT);
            writeToCell(initX, initY, contentStream, examinationTechniqueCategories.get(i).getCategoryName(), font);

            for(int j = 0; j < examinationTechniqueCategories.get(i).getTechniques().size(); j++) {
                initY -=CELL_HEIGHT;
                contentStream.addRect(initX, initY, CELL_WIDTH+30, -CELL_HEIGHT);
                
                //funktion korta ner teknik strängen och dela upp i två å skriva den på två rader
                String name = examinationTechniqueCategories.get(i).getTechniques().get(j).toString();
                if(name.length() > 63)
                    name = name.substring(0, 60) + "...";

                System.out.println(name);

                int splitOnIndex = 35;
                if(name.length() > 35) {
                    for(int k = 0; k < 35; k++) {
                        if(name.charAt(k) == ' ')
                            splitOnIndex = k;
                    }

                    writeToCell(initX, initY+10, contentStream, name.substring(0, splitOnIndex), font);


                    writeToCell(initX, initY, contentStream, name.substring(splitOnIndex, name.length()), font);
                } else  {
                    writeToCell(initX, initY, contentStream, examinationTechniqueCategories.get(i).getTechniques().get(j).toString(), font);
                }

                initX+=CELL_WIDTH+30;

                for (int k = 0 ; k < count-1 ; k++) {
                    contentStream.addRect(initX, initY, CELL_WIDTH, -CELL_HEIGHT);
                    writeToCell(initX, initY, contentStream, "G", font);
                    initX+=CELL_WIDTH;
                }

                initX = TABLE_START_X_POS;
            }

            initY -=CELL_HEIGHT;
        }
        
        contentStream.stroke();
        contentStream.close();
    }


    private void writeToCell(int initX, int initY, PDPageContentStream contentStream, String cellText, PDType0Font font) throws IOException {
        contentStream.beginText();
        contentStream.newLineAtOffset(initX+10,initY-CELL_HEIGHT+10);
        contentStream.setFont(font,7);
        contentStream.showText(cellText);
        contentStream.endText();
    }


    private void createHeader(String belt_name, String categories, String date, PDPageContentStream contentStream) throws IOException {
        PDType0Font font = PDType0Font.load(document, new File("/usr/share/fonts/noto/NotoSans-Regular.ttf"));
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
        Map<String, Object> parsedProtocol = parseJson(gradingProtocol);

        List<Map<String, Object>> categories = (List<Map<String, Object>>)parsedProtocol.get("categories");

        for(int i = 0; i < categories.size(); i++) {
            ExaminationTechniqueCategory category = new ExaminationTechniqueCategory(categories.get(i).get("category_name").toString());
            List<Map<String, Object>> techniques = (List<Map<String, Object>>)categories.get(i).get("techniques");

            for(int j = 0; j < techniques.size(); j++) {
                category.addTechnique(techniques.get(j).get("text").toString().replaceAll("\\u0009", ""));
            }
            examinationTechniqueCategories.add(category);
        }

        for(int i = 0; i < numPages; i++)  {
            this.createTable(i);
        }

        System.out.println("table pdf created");

        //Här skapar vi sidorna för kommentarerna där de står t.ex. #1 Bra jobbat\n #2 du suger
        document.save("/home/marcus/school/yotei/test.pdf");
        document.close();
    }

    private String stripName(String name) {
        if(name.length() > 15) {
            name = name.substring(0, 12);
            name = name + "...";
        }
        return name;
    }
}
