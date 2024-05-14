package se.umu.cs.pvt.examination;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;

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

    /*
     * koden behöver grov refaktorisering 
     */
    private List<Examinee> examinees;
    private Grading grading;
    private List<ExaminationResult> examinationResults;
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

    public ExportGradingPdf(Grading grading, List<Examinee> examinees) throws IOException {
        this.examinees = examinees;
        this.totalNumColumns = examinees.size() + 1;
        this.numPages = (int)Math.ceil((double)examinees.size() / MAX_NUM_COLUMNS);
        document = new PDDocument();
        this.gradingProtocol = Files.readString(Paths.get(System.getProperty("user.dir") + "/frontend/public/grading_protocol_yellow_1.json"));
        this.examinationTechniqueCategories = new ArrayList<>();
        this.grading = grading;
    }

    private void drawImage(PDPage page, PDPageContentStream contentStream) throws IOException {
        String path = System.getProperty("user.dir") + "/frontend/public/ubk-logga.jpg";
        int x = (int)page.getMediaBox().getWidth() - 163;
        int y = pageHeight-60;
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

        PDType0Font font = PDType0Font.load(document, new File("/usr/share/fonts/truetype/freefont/FreeSerif.ttf"));
        PDPageContentStream contentStream = new PDPageContentStream(document,page);
        contentStream.setStrokingColor(Color.DARK_GRAY);
        contentStream.setLineWidth(1);
        Map<String, Object> protocol = parseJson(gradingProtocol);
        Map<String, Object> gradingProtocolObj = (Map<String, Object>) protocol.get("grading_protocol");

        String code = (String) gradingProtocolObj.get("code");
        String color = (String) gradingProtocolObj.get("color");

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd  HH:mm");
        
        createHeader(code, color, contentStream);

        drawImage(page, contentStream);
        contentStream.addRect(initX, initY, CELL_WIDTH+30, -CELL_HEIGHT);
        writeToCell(initX, initY, contentStream, "Namn", font);
        int count = 1;

        initX+=CELL_WIDTH+30;
        for(int j = (onPage*MAX_NUM_COLUMNS); j<(onPage*MAX_NUM_COLUMNS)+MAX_NUM_COLUMNS && j < examinees.size();j++){
            contentStream.addRect(initX,initY,CELL_WIDTH,-CELL_HEIGHT);

            writeToCell(initX, initY, contentStream, stripName(examinees.get(j).getName()), font);

            initX+=CELL_WIDTH;
            count++;
        }
        initX = TABLE_START_X_POS;
        initY -=CELL_HEIGHT;
    
        int row_count = 0;
        for(int i = 0; i < examinationTechniqueCategories.size(); i++) {
                
            contentStream.addRect(initX, initY, CELL_WIDTH*count+30, -CELL_HEIGHT);
            row_count++;
            writeToCell(initX, initY, contentStream, examinationTechniqueCategories.get(i).getCategoryName(), font);

            for(int j = 0; j < examinationTechniqueCategories.get(i).getTechniques().size(); j++) {
                initY -=CELL_HEIGHT;
                contentStream.addRect(initX, initY, CELL_WIDTH+30, -CELL_HEIGHT);
                row_count++;
                
                String name = examinationTechniqueCategories.get(i).getTechniques().get(j).toString();
                //Shorten technique name so it fits in the cell
                if(name.length() > 63)
                    name = name.substring(0, 60) + "...";

                //Splits the string at the nearest space char and writes the rest on the next line in the cell
                int splitOnIndex = 35;
                if(name.length() > 35) {
                    for(int k = 0; k < 35; k++) {
                        if(name.charAt(k) == ' ')
                            splitOnIndex = k;
                    }

                    writeToCell(initX, initY+10, contentStream, name.substring(0, splitOnIndex), font);
                    writeToCell(initX, initY, contentStream, name.substring(splitOnIndex, name.length()), font);
                } 
                else  
                    writeToCell(initX, initY, contentStream, examinationTechniqueCategories.get(i).getTechniques().get(j).toString(), font);
                

                initX+=CELL_WIDTH+30;

                for (int k = 0 ; k < count-1 ; k++) {
                    contentStream.addRect(initX, initY, CELL_WIDTH, -CELL_HEIGHT);
                    writeToCell(initX, initY, contentStream, "G", font);
                    initX+=CELL_WIDTH;
                }

                initX = TABLE_START_X_POS;

                if(row_count > MAX_NUM_ROWS) {
                    contentStream.stroke();
                    contentStream.close();
                    PDPage page2 = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
                    initX = TABLE_START_X_POS;
                    initY = pageHeight -75;
                    document.addPage(page2);

                    row_count = 0;
                    contentStream = new PDPageContentStream(document,page2);
                    createHeader(code, color, contentStream);
                    drawImage(page, contentStream);
                    contentStream.addRect(initX, initY, CELL_WIDTH+30, -CELL_HEIGHT);
                    writeToCell(initX, initY, contentStream, "Namn", font);
                    
                    initX+=CELL_WIDTH+30;
                    for(int j2 = (onPage*MAX_NUM_COLUMNS); j2<(onPage*MAX_NUM_COLUMNS)+MAX_NUM_COLUMNS && j2 < examinees.size() ; j2++){
                        contentStream.addRect(initX,initY,CELL_WIDTH,-CELL_HEIGHT);
        
                        writeToCell(initX, initY, contentStream, stripName(examinees.get(j2).getName()), font);
        
                        initX+=CELL_WIDTH;
                    }
                    initX = TABLE_START_X_POS;
                }
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


    private void createHeader(String code, String color, PDPageContentStream contentStream) throws IOException {
        PDType0Font font = PDType0Font.load(document, new File("/usr/share/fonts/truetype/freefont/FreeSerif.ttf"));
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String date = sdf.format(grading.getCreated_at()).toString();
        int initX = TABLE_START_X_POS;
        int initY = pageHeight-75;
        
        //Draws colored rectangle over belt name
        Color beltColor = getHighlightColor(color);
        contentStream.addRect(initX, initY + 30, 120, 15);
        contentStream.setStrokingColor(beltColor);
        contentStream.setNonStrokingColor(beltColor);
        contentStream.fill();
        contentStream.stroke();

        //Resets rectangle colors
        contentStream.setStrokingColor(0f,0f,0f);
        contentStream.setNonStrokingColor(0f,0f,0f);
        
        //Set header text
        contentStream.beginText();
        contentStream.setFont(font, 10);
        contentStream.newLineAtOffset(initX, initY + 50);
        contentStream.showText("Graderingprotokoll");
        contentStream.newLineAtOffset(0, -15);
        contentStream.showText(code + " " + color);
        contentStream.newLineAtOffset(0, -15);
        contentStream.showText(date);
        contentStream.endText();
    }

    private Color getHighlightColor(String color) {
        String split[] = color.split(" ");
        if (split[0].equals("GULT"))
            return Color.decode("#FFDD33");
        if (split[0].equals("BRUNT"))
            return Color.decode("#83530C");
        if (split[0].equals("ORANGE"))
            return Color.decode("#FFA133");
        if (split[0].equals("GRÖNT"))
            return Color.decode("#0C7D2B");
        if (split[0].equals("BLÅTT"))
            return Color.decode("#1E9CE3");
        return new Color(1f,1f,1f);
    }

    public void generate() throws IOException {
        Map<String, Object> parsedProtocol = parseJson(gradingProtocol);

        List<Map<String, Object>> categories = (List<Map<String, Object>>)parsedProtocol.get("categories");

        for(int i = 0; i < categories.size(); i++) {
            ExaminationTechniqueCategory category = new ExaminationTechniqueCategory(categories.get(i).get("category_name").toString());
            List<Map<String, Object>> techniques = (List<Map<String, Object>>)categories.get(i).get("techniques");
            
            //Replaces tab character from technique name
            for(int j = 0; j < techniques.size(); j++) 
                category.addTechnique(techniques.get(j).get("text").toString().replaceAll("\\u0009", ""));
            examinationTechniqueCategories.add(category);
        }

        for(int i = 0; i < numPages; i++)  
            this.createTable(i);

        createGroupCommentPage();
        createPairCommentPage();
        createExamineeCommentPage();

        document.save("/home/adam/Programming/yotei/test.pdf");
        document.close();
    }

    
    private void createGroupCommentPage() throws IOException {
        PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
        document.addPage(page);
        
        pageWidth = (int)page.getMediaBox().getWidth(); //get width of the page
        pageHeight = (int)page.getMediaBox().getHeight(); //get height of the page
        
        int initX = TABLE_START_X_POS;
        int initY = pageHeight-75;
        
        PDType0Font font = PDType0Font.load(document, new File("/usr/share/fonts/truetype/freefont/FreeSerif.ttf"));
        PDPageContentStream contentStream = new PDPageContentStream(document,page);
        contentStream.setStrokingColor(Color.DARK_GRAY);
        contentStream.setLineWidth(1);
        Map<String, Object> protocol = parseJson(gradingProtocol);
        Map<String, Object> gradingProtocolObj = (Map<String, Object>) protocol.get("grading_protocol");
        
        String code = (String) gradingProtocolObj.get("code");
        String color = (String) gradingProtocolObj.get("color");
        
        createHeader(code, color, contentStream);
        drawImage(page, contentStream);
        
        String groupComment = """                
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultrices nibh ac nibh tempor sagittis. Proin non eleifend diam. Aliquam eget egestas neque. Sed tortor dui, tincidunt eu venenatis in, sollicitudin sit amet risus. Mauris pharetra turpis in lectus euismod, ac lobortis urna tincidunt. Vestibulum tincidunt luctus sapien ut rhoncus. Curabitur sit amet orci purus. Praesent consectetur, ante vitae pharetra euismod, sapien lorem interdum dolor, vitae fringilla orci tellus et sem.
            """;
            
            List<String> rows = getRows(groupComment);
            
            contentStream.beginText();
            contentStream.setFont(font, 14);
            contentStream.newLineAtOffset(initX, initY-30);
            contentStream.showText("Gruppkommentar");
            contentStream.setFont(font, 10);
            contentStream.newLineAtOffset(0, -20);
            
            for(int i = 0; i < rows.size(); i++) {
                contentStream.showText(rows.get(i));
                contentStream.newLineAtOffset(0, -15);
            }
            
            contentStream.endText();
            contentStream.stroke();
            contentStream.close();
        }

        private void createPairCommentPage() throws IOException {
            PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
            document.addPage(page);
    
            pageWidth = (int)page.getMediaBox().getWidth(); //get width of the page
            pageHeight = (int)page.getMediaBox().getHeight(); //get height of the page
    
            int initX = TABLE_START_X_POS;
            int initY = pageHeight-75;
            
            PDType0Font font = PDType0Font.load(document, new File("/usr/share/fonts/truetype/freefont/FreeSerif.ttf"));
            PDPageContentStream contentStream = new PDPageContentStream(document,page);
            contentStream.setStrokingColor(Color.DARK_GRAY);
            contentStream.setLineWidth(1);
            Map<String, Object> protocol = parseJson(gradingProtocol);
            Map<String, Object> gradingProtocolObj = (Map<String, Object>) protocol.get("grading_protocol");
            
            String code = (String) gradingProtocolObj.get("code");
            String color = (String) gradingProtocolObj.get("color");
            
            drawImage(page, contentStream);
            createHeader(code, color, contentStream);
            contentStream.beginText();
            contentStream.setFont(font, 14);
            contentStream.newLineAtOffset(initX, initY-30);
            contentStream.showText("Par Kommentarer");
            contentStream.endText();
            //-60 is the distance between the title and where the comments begin
            initY -= 60;
            for (int i = 0 ; i < examinees.size() ; i+=2) { 
                //lägg till "teknik: kommentar" till rows, sen kanske en tom rad ifall en ny teknik följer och sen upprepa 
                String examineeComment = "2. Shotei uchi, chudan, rak stöt med främre och bakre handen: Bra form!                                                 9. Grepp i ärmen med drag O soto osae, ude henkan gatame: Bra form! ";
                List<String> rows = getRows(examineeComment);

                //Checks if the next comment block will fit on the page, if not a new page is created
                if (initY - rows.size() * 15 + 30 <= 0) {
                    contentStream.close();
                    page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
                    document.addPage(page);        
                    contentStream = new PDPageContentStream(document,page);
                    drawImage(page, contentStream);
                    createHeader(code, color, contentStream);
                    initY = pageHeight-75;
                    contentStream.beginText();
                    contentStream.setFont(font, 14);
                    contentStream.newLineAtOffset(initX, initY-30);
                    contentStream.showText("Par Kommentarer");
                    contentStream.endText();
                    initY -= 60;
                }
                contentStream.beginText();
                contentStream.newLineAtOffset(initX + 5, initY);
                contentStream.setFont(font, 12);
                contentStream.showText(examinees.get(i).getName() + " & " + examinees.get(i+1).getName());
                contentStream.setFont(font, 10);
                for(int j = 0; j < rows.size(); j++) {
                    contentStream.newLineAtOffset(0, -15);
                    contentStream.showText(rows.get(j));
                }
                contentStream.endText();
                //Calculates the size of the rectangle to enclose the comment
                contentStream.addRect(initX, initY - (5 + rows.size()*15), CELL_WIDTH * 7 + 30, rows.size() * 15);
                contentStream.stroke();
                initY -= rows.size() * 15 + 30;
            }        
            contentStream.close();
        }

        private void createExamineeCommentPage() throws IOException {
            PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
            document.addPage(page);
    
            pageWidth = (int)page.getMediaBox().getWidth(); //get width of the page
            pageHeight = (int)page.getMediaBox().getHeight(); //get height of the page
    
            int initX = TABLE_START_X_POS;
            int initY = pageHeight-75;
            
            PDType0Font font = PDType0Font.load(document, new File("/usr/share/fonts/truetype/freefont/FreeSerif.ttf"));
            PDPageContentStream contentStream = new PDPageContentStream(document,page);
            contentStream.setStrokingColor(Color.DARK_GRAY);
            contentStream.setLineWidth(1);
            Map<String, Object> protocol = parseJson(gradingProtocol);
            Map<String, Object> gradingProtocolObj = (Map<String, Object>) protocol.get("grading_protocol");
            
            String code = (String) gradingProtocolObj.get("code");
            String color = (String) gradingProtocolObj.get("color");
            
            drawImage(page, contentStream);
            createHeader(code, color, contentStream);
            contentStream.beginText();
            contentStream.setFont(font, 14);
            contentStream.newLineAtOffset(initX, initY-30);
            contentStream.showText("Personliga Kommentarer");
            contentStream.endText();
            //-60 is the distance between the title and where the comments begin
            initY -= 60;

            for (int i = 0 ; i < examinees.size() ; i++) {
                String examineeComment = "Lorem ipsum dolor sit ame ipsum dolor sit amet, consectetur adipiscing elit.coLorem ipsum dolor sit amet, consectetur adipiscing elit.coLorem ipsum dolor sit amet, consectetur adipiscing elit.cosectetur adipiscing elit.consectetur adipiscing eLorem ipsum dolor sit amet, consectetur adipiscing elit.consectetur adipiscing elit.consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.consectetur adipiscing elit.consectetur adipiscing elit.lit.";
                List<String> rows = getRows(examineeComment);
                
                //Checks if the next comment block will fit on the page, if not a new page is created
                if (initY - rows.size() * 15 + 30 <= 0) {
                    contentStream.close();
                    page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
                    document.addPage(page);        
                    contentStream = new PDPageContentStream(document,page);
                    drawImage(page, contentStream);
                    createHeader(code, color, contentStream);
                    initY = pageHeight-75;
                    contentStream.beginText();
                    contentStream.setFont(font, 14);
                    contentStream.newLineAtOffset(initX, initY-30);
                    contentStream.showText("Personliga Kommentarer");
                    contentStream.endText();
                    initY -= 60;
                }
                contentStream.beginText();
                contentStream.newLineAtOffset(initX + 5, initY);
                contentStream.setFont(font, 12);
                contentStream.showText(examinees.get(i).getName());
                contentStream.setFont(font, 10);
                for(int j = 0; j < rows.size(); j++) {
                    //-15 is relative to the previous call of newLineAtOffset
                    contentStream.newLineAtOffset(0, -15);
                    contentStream.showText(rows.get(j));
                }
                contentStream.endText();
                //Calculates the size of the rectangle to enclose the comment
                contentStream.addRect(initX, initY - (5 + rows.size()*15), CELL_WIDTH * 7 + 30, rows.size() * 15);
                contentStream.stroke();
                initY -= rows.size() * 15 + 30;
            }        
            contentStream.close();
        }

        private List<String> getRows(String examineeComment) {
            List<String> rows = new ArrayList<>();
            if(examineeComment.length() > 120) {
                int numRows = (int)Math.ceil((double)examineeComment.length() / 120);
                
                int startIndex = 0;
                int stopIndex = 120;
                
                for(int j = 0; j < numRows; j++) {                        
                    int lastSpaceIndex = examineeComment.substring(startIndex, stopIndex).lastIndexOf(' ');
                    
                    if(lastSpaceIndex > 0) 
                        stopIndex = lastSpaceIndex + startIndex +1;

                    rows.add(examineeComment.substring(startIndex, stopIndex).replaceAll("\\u000a", ""));
                    
                    startIndex = stopIndex;
                    if(stopIndex + 120 <= examineeComment.length())
                        stopIndex = stopIndex + 120;
                    else
                        stopIndex = examineeComment.length();
                }
            }
            else
                rows.add(examineeComment);
            return rows;
        }
        
        private String stripName(String name) {
            if(name.length() > 30) {
                name = name.substring(0, 27);
                name = name + "...";
            }
            System.out.println(name);
            return name;
        }
    }
    