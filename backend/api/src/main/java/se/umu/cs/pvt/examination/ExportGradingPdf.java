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
import se.umu.cs.pvt.examination.ExaminationController;
import com.fasterxml.jackson.core.JsonParser;

import se.umu.cs.pvt.technique.Technique;

import static org.mockito.ArgumentMatchers.anySet;

import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.List;

/**
 * This class uses the help of PDFBox to generate a PDF-file which contains the contents of a completed examination.
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since YYYY-MM-DD
 */
public class ExportGradingPdf {

    /*
     * koden behöver lite refaktorisering, kanske nytt namn på inity å x?
     */
    private List<Examinee> examinees;
    private Grading grading;
    private List<ExaminationResult> examinationResults;
    private List<ExaminationComment> examinationComments;
    private final int totalNumColumns;
    private final int numPages;
    private PDDocument document;
    private int pageWidth, pageHeight;
    private Long grading_id;
    private String gradingProtocol;
    private List<ExaminationTechniqueCategory> examinationTechniqueCategories;
    private final int   MAX_NUM_COLUMNS = 6,
                        MAX_NUM_ROWS = 15, /*måsta ändra de här eftersom de klipps av annars på första sidorna eftersom de är just lite för mycke.. om den 
                                            *ändras till 14 så blir det en extra sida med bara namn så kanske komma på nå där vi kollar om nästa initY värde blir mindre än 0...
                                            och då skapar vi en ny sida */
                        TABLE_START_X_POS = 55, //behöver bättre namn
                        CELL_HEIGHT = 30,
                        CELL_WIDTH = 100,
                        MAX_NAME_LENGTH = 30,
                        MAX_TECHNIQUE_NAME_LENGTH = 63;

    public ExportGradingPdf(Grading grading, List<Examinee> examinees, List<ExaminationResult> examinationResults, List<ExaminationComment> examinationComments) throws IOException {
        this.examinees = examinees;
        this.examinationResults = examinationResults;
        this.examinationComments = examinationComments;
        this.totalNumColumns = examinees.size() + 1;
        this.numPages = (int)Math.ceil((double)examinees.size() / MAX_NUM_COLUMNS); //byt namn på numPages
        document = new PDDocument();
        this.gradingProtocol = Files.readString(Paths.get(System.getProperty("user.dir") + "/frontend/public/grading_protocol_yellow_1.json"));
        this.examinationTechniqueCategories = new ArrayList<>();
        this.grading = grading;
    }

    /**
     * Draws the ubk logo in the top right corner. 
     * 
     * @param page, PDPage (Page for PDF)
     * @param contentStream, PDPageContentstream
     * @throws IOException
     */
    private void drawImage(PDPage page, PDPageContentStream contentStream) throws IOException {
        String path = System.getProperty("user.dir") + "/frontend/public/ubk-logga.jpg";
        int x = (int)page.getMediaBox().getWidth() - 155;
        int y = pageHeight-60;
        PDImageXObject pdImage = PDImageXObject.createFromFile(path, document);
        contentStream.drawImage(pdImage, x, y, 100, 50);
    }

    /**
     * Parses the json String and returns a Map containing the json elements.
     *
     * @param json, a String containing the json contents.
     * @return A Map<String, Object> is returned containing the json elements.
     */
    private Map<String, Object> parseJson(String json) {
        org.springframework.boot.json.JsonParser parser = JsonParserFactory.getJsonParser();
        return parser.parseMap(json);
    }

    /**
     * Creates the pages which contains the table for which examinee has passed or not on each technique.
     * 
     * @param onPage, an int, to keep track which page is being written to... //might need to be changed due to bad variable name...
     * @throws IOException
     */
    private void createTablePage(int onPage) throws IOException {
        PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
        document.addPage(page);
        pageWidth = (int)page.getMediaBox().getWidth(); 
        pageHeight = (int)page.getMediaBox().getHeight(); 

        //Get number of examinees that will be on the page
        int numExamineesOnPage = examinees.size() - (onPage * MAX_NUM_COLUMNS);
        if (numExamineesOnPage > MAX_NUM_COLUMNS)
            numExamineesOnPage = MAX_NUM_COLUMNS;

        //Calculate where starting x position will be depending on number of examinees on the page
        int tableStartXPos = (pageWidth/2) - ((numExamineesOnPage + 1)* CELL_WIDTH + 30)/2;

        int initX = tableStartXPos; //kom på nå bättre namn
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
        contentStream.addRect(initX, initY, CELL_WIDTH+30, -CELL_HEIGHT);
        writeToCell(initX, initY, contentStream, "Namn", font);
        int count = 1;

        initX+=CELL_WIDTH+30;
        for(int j = (onPage*MAX_NUM_COLUMNS); j<(onPage*MAX_NUM_COLUMNS)+MAX_NUM_COLUMNS && j < examinees.size();j++){
            contentStream.addRect(initX,initY,CELL_WIDTH,-CELL_HEIGHT);

            writeToCell(initX, initY, contentStream, shortenString(examinees.get(j).getName(), MAX_NAME_LENGTH), font);

            initX+=CELL_WIDTH;
            count++;
        }
        initX = tableStartXPos;
        initY -= CELL_HEIGHT;
        //Programing warcrimes incomming
        for(int i = 0; i < examinationTechniqueCategories.size(); i++) {
                
            contentStream.addRect(initX, initY, CELL_WIDTH*count+30, -CELL_HEIGHT);
            writeToCell(initX, initY, contentStream, examinationTechniqueCategories.get(i).getCategoryName(), font);

            for(int j = 0; j < examinationTechniqueCategories.get(i).getTechniques().size(); j++) {
                initY -=CELL_HEIGHT;
                contentStream.addRect(initX, initY, CELL_WIDTH+30, -CELL_HEIGHT);
                
                String techniqueName = examinationTechniqueCategories.get(i).getTechniques().get(j).toString();
                techniqueName = shortenString(techniqueName, MAX_TECHNIQUE_NAME_LENGTH);

                //Splits the string at the nearest space char and writes the rest on the next line in the cell
                int splitOnIndex = 35;
                if(techniqueName.length() > 35) {
                    for(int k = 0; k < 35; k++) {
                        if(techniqueName.charAt(k) == ' ')
                            splitOnIndex = k;
                    }

                    writeToCell(initX, initY+10, contentStream, techniqueName.substring(0, splitOnIndex), font);
                    writeToCell(initX, initY, contentStream, techniqueName.substring(splitOnIndex, techniqueName.length()), font);
                } 
                else  
                    writeToCell(initX, initY, contentStream, techniqueName, font);
                

                initX+=CELL_WIDTH+30;

                for (int k = 0 ; k < count-1 ; k++) {
                    contentStream.addRect(initX, initY, CELL_WIDTH, -CELL_HEIGHT);
                    String grade = "";
                    for (int l = 0 ; l < examinationResults.size() ; l++) {
                        if ((examinationTechniqueCategories.get(i).getTechniques().get(j).toString()).equals(examinationResults.get(l).getTechnique_name())) {
                            if (examinees.get(k).getExaminee_id() == examinationResults.get(l).getExaminee_id()) {
                                if (examinationResults.get(l).getPass()) 
                                    grade += "G";
                                else
                                    grade += "U";
                            }
                        }
                    }

                    for (int l = 0; l < examinationComments.size() ; l++) {
                        if ((examinationTechniqueCategories.get(i).getTechniques().get(j).toString()).equals(examinationComments.get(l).getTechniqueName())) {
                            if (examinees.get(k).getExaminee_id() == examinationComments.get(l).getExamineeId()) 
                                grade += " - " + examinationComments.get(l).getComment();
                        }
                    }
                    writeToCell(initX, initY, contentStream, grade, font); // gör om detta till en sträng som innehåller G eller U och följs med : Kommentar som rymms...
                    initX+=CELL_WIDTH;
                }

                initX = tableStartXPos;

                if(initY - CELL_HEIGHT - 35 < 0) {
                    contentStream.stroke();
                    contentStream.close();
                    PDPage page2 = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
                    initX = tableStartXPos;
                    initY = pageHeight -75;
                    document.addPage(page2);

                    contentStream = new PDPageContentStream(document,page2);
                    createHeader(code, color, contentStream);
                    drawImage(page, contentStream);
                    contentStream.addRect(initX, initY, CELL_WIDTH+30, -CELL_HEIGHT);
                    writeToCell(initX, initY, contentStream, "Namn", font);
                    
                    initX+=CELL_WIDTH+30;
                    for(int j2 = (onPage*MAX_NUM_COLUMNS); j2<(onPage*MAX_NUM_COLUMNS)+MAX_NUM_COLUMNS && j2 < examinees.size() ; j2++){
                        contentStream.addRect(initX,initY,CELL_WIDTH,-CELL_HEIGHT);
        
                        writeToCell(initX, initY, contentStream, shortenString(examinees.get(j2).getName(), MAX_NAME_LENGTH), font);
        
                        initX+=CELL_WIDTH;
                    }
                    initX = tableStartXPos;
                }
            }

            initY -=CELL_HEIGHT;
        }
        
        contentStream.stroke();
        contentStream.close();
    }


    /**
     * Writes to the cell at a given position the given text.
     * 
     * @param initX, the X position of the cell?
     * @param initY, the Y position of the cell?
     * @param contentStream, the PDPageContentStream
     * @param cellText, the String containing the text that will be written to the cell.
     * @param font, the PDType0Font that will be used.
     * @throws IOException
     */
    private void writeToCell(int initX, int initY, PDPageContentStream contentStream, String cellText, PDType0Font font) throws IOException {
        contentStream.beginText();
        contentStream.newLineAtOffset(initX+10,initY-CELL_HEIGHT+10);
        contentStream.setFont(font,7);
        contentStream.showText(cellText);
        contentStream.endText();
    }

    /**
     * Writes the header text to the pdf page.
     * 
     * @param code, a String containing the belt code.
     * @param color, a String containing the belt color.
     * @param contentStream, the PDPageContentStream.
     * @throws IOException
     */
    private void createHeader(String code, String color, PDPageContentStream contentStream) throws IOException {
        PDType0Font font = PDType0Font.load(document, new File("/usr/share/fonts/truetype/freefont/FreeSerif.ttf"));
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String date = sdf.format(grading.getCreated_at()).toString();
        int initX = TABLE_START_X_POS;
        int initY = pageHeight-25;
        
        //Draws colored rectangle over belt name
        Color beltColor = getHighlightColor(color);
        contentStream.addRect(initX - 2, initY - 20, 120, 15);
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
        contentStream.newLineAtOffset(initX, initY);
        contentStream.showText("Graderingprotokoll");
        contentStream.newLineAtOffset(0, -15);
        contentStream.showText(code + " " + color);
        contentStream.newLineAtOffset(0, -15);
        contentStream.showText(date);
        contentStream.endText();
    }

    /**
     * Gets which color will be used to highlight the belt name in the header.
     * @param color, a String containing the color.
     * @return Color, the color which will be used to highlight the belt name in the header.
     */
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

    /**
     * The main method for the program which generates the entire PDF by calling private methods.
     * 
     * @throws IOException
     */
    public void generate() throws IOException {
        Map<String, Object> parsedProtocol = parseJson(gradingProtocol);

        List<Map<String, Object>> categories = (List<Map<String, Object>>)parsedProtocol.get("categories");

        for(int i = 0; i < categories.size(); i++) {
            ExaminationTechniqueCategory category = new ExaminationTechniqueCategory(categories.get(i).get("category_name").toString());
            List<Map<String, Object>> techniques = (List<Map<String, Object>>)categories.get(i).get("techniques");
            
            //Removes tab character from technique name and adds it
            for(int j = 0; j < techniques.size(); j++) 
                category.addTechnique(techniques.get(j).get("text").toString().replaceAll("\\u0009", "")); // Vi kan lägga till här att vi tar bort alla common unicode characters som inte supportas av fonter
            examinationTechniqueCategories.add(category);
        }

        for(int i = 0; i < numPages; i++)  
            createTablePage(i);

        createExaminationCommentPage();
        //createGroupCommentPage();
        createPairCommentPage();
        createExamineeCommentPage();

        document.save("/home/adam/Programming/yotei/test.pdf");
        document.close();
    }

    /**
     * Creates the group comment pdf page and writes the group comment to the pdf page.
     * 
     * @throws IOException
     */
    private void createExaminationCommentPage() throws IOException {
        PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
        document.addPage(page);
        
        pageWidth = (int)page.getMediaBox().getWidth(); 
        pageHeight = (int)page.getMediaBox().getHeight();         
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
            
        List<String> rows = getRows(groupComment, 120);
        
        contentStream.beginText();
        contentStream.setFont(font, 14);
        contentStream.newLineAtOffset(initX, initY -= 30);
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

    /**
     * Creates the pair comment pdf page and writes the group comment to the pdf page.
     * 
     * @throws IOException
     */
    private void createPairCommentPage() throws IOException {
        PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
        document.addPage(page);

        pageWidth = (int)page.getMediaBox().getWidth(); 
        pageHeight = (int)page.getMediaBox().getHeight();     
        int initX = TABLE_START_X_POS;
        int initY = pageHeight-105;
        
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
        contentStream.newLineAtOffset(initX, initY);
        contentStream.showText("Par Kommentarer");
        contentStream.endText();
        //30 pixels is the distance between the title and where the comments section begin
        initY -= 30;
        for (int i = 0 ; i < examinees.size() ; i+=2) { 
            //lägg till "teknik: kommentar" till rows, sen kanske en tom rad ifall en ny teknik följer och sen upprepa 
            String examineeComment = "2. Shotei uchi, chudan, rak stöt med främre och bakre handen: Bra form!                                                 9. Grepp i ärmen med drag O soto osae, ude henkan gatame: Bra form! ";
            List<String> rows = getRows(examineeComment, 120);

            //Checks if the next comment block will fit on the page, if not a new page is created
            if (initY - rows.size() * 15 + 30 <= 0) {
                contentStream.close();
                page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
                document.addPage(page);        
                contentStream = new PDPageContentStream(document,page);
                drawImage(page, contentStream);
                createHeader(code, color, contentStream);
                initY = pageHeight-105;
                contentStream.beginText();
                contentStream.setFont(font, 14);
                contentStream.newLineAtOffset(initX, initY);
                contentStream.showText("Par Kommentarer");
                contentStream.endText();
                initY -= 30;
            }
            
            contentStream.beginText();
            contentStream.newLineAtOffset(initX + 5, initY);
            contentStream.setFont(font, 12);

            contentStream.showText(examinees.get(i).getName() + " & " + examinees.get(i+1).getName()); // går ej att ha udda antal examinees
            contentStream.setFont(font, 10);
            for(int j = 0; j < rows.size(); j++) {
                //This newLineAtOffset position is relative to the previous due to it being in the same beginText to endText section
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText(rows.get(j));
            }
            contentStream.endText();

            //Calculates the size of the rectangle which encapsulates the comment
            contentStream.addRect(initX, initY - (5 + rows.size()*15), CELL_WIDTH * 7 + 30, rows.size() * 15);
            contentStream.stroke();
            //Calculates the distance between the comments
            initY -= rows.size() * 15 + 30;
            
        }        
        contentStream.close();
    }

    /**
     * Creates the examinee comment pdf page and writes the group comment to the pdf page.
     * 
     * @throws IOException
     */
    private void createExamineeCommentPage() throws IOException {
        PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
        document.addPage(page);

        pageWidth = (int)page.getMediaBox().getWidth(); 
        pageHeight = (int)page.getMediaBox().getHeight();     
        int initX = TABLE_START_X_POS;
        int initY = pageHeight-105;
        
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
        contentStream.newLineAtOffset(initX, initY);
        contentStream.showText("Personliga Kommentarer");
        contentStream.endText();
        //30 pixels is the distance between the title and where the comments section begin
        initY -= 30;

        for (int i = 0 ; i < examinees.size() ; i++) {
            String examineeComment = "2. Shotei uchi, chudan, rak stöt med främre och bakre handen: Bra form!                                                 3. Gedan geri, rak spark med främre och bakre benet: Snyggt sparkat!                                                   9. Grepp i ärmen med drag O soto osae, ude henkan gatame: Bra form! ";
            List<String> rows = getRows(examineeComment, 120);
            
            //Checks if the next comment block will fit on the page, if not a new page is created
            if (initY - rows.size() * 15 + 30 <= 0) {
                contentStream.close();
                page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
                document.addPage(page);        
                contentStream = new PDPageContentStream(document,page);
                drawImage(page, contentStream);
                createHeader(code, color, contentStream);
                initY = pageHeight - 105;
                contentStream.beginText();
                contentStream.setFont(font, 14);
                contentStream.newLineAtOffset(initX, initY);
                contentStream.showText("Personliga Kommentarer");
                contentStream.endText();
                initY -= 30;
            }

            contentStream.beginText();
            contentStream.newLineAtOffset(initX + 5, initY);
            contentStream.setFont(font, 12);
            contentStream.showText(examinees.get(i).getName());
            contentStream.setFont(font, 10);
            for(int j = 0; j < rows.size(); j++) {
                //This newLineAtOffset position is relative to the previous due to it being in the same beginText to endText section
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

    /**
     * The the comment split up into section so that the text wont exceed the page width. In
     * other words, newline is added.
     * 
     * @param string, the String that will be split up in to sections
     * @return a List of Strings which contains the split up sections of the comment.
     */
    private List<String> getRows(String string, int maxLength) {
        List<String> rows = new ArrayList<>();
        if(string.length() > maxLength) {
            int numRows = (int)Math.ceil((double)string.length() / maxLength);
            
            int startIndex = 0;
            int stopIndex = maxLength;
            
            for(int j = 0; j < numRows; j++) {                        
                int lastSpaceIndex = string.substring(startIndex, stopIndex).lastIndexOf(' ');
                
                if(lastSpaceIndex > 0) 
                    stopIndex = lastSpaceIndex + startIndex +1;

                rows.add(string.substring(startIndex, stopIndex).replaceAll("\\u000a", ""));
                
                startIndex = stopIndex;
                if(stopIndex + maxLength <= string.length())
                    stopIndex = stopIndex + maxLength;
                else
                    stopIndex = string.length();
            }
        }
        else
            rows.add(string);
        return rows;
    }
    
    /**
     * Cuts of the String containing a name if it is too long and adds ... to the end.
     * 
     * @param string, the String containing the string
     * @return, the String containing the string, if it is too long, the shortened string.
     */
    private String shortenString(String string, int maxLength) {
        if(string.length() > maxLength) {
            string = string.substring(0, maxLength - 3);
            string = string + "...";
        }
        
        return string;
    }
}
