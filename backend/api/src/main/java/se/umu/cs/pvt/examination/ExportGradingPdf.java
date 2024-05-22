/**
 * This class uses the help of PDFBox to generate a PDF-file which contains the contents of a completed examination.
 * 
 * Good luck debugging this! :)
 * 
 * @author Team Granatäpple
 * @version 1.0
 * @since 2024-05-20
 */

package se.umu.cs.pvt.examination;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.boot.json.JsonParserFactory;

import java.awt.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.*;
import java.util.List;
import java.util.stream.Stream;


public class ExportGradingPdf {
    private List<Examinee> examinees;
    private Grading grading;
    private List<ExaminationResult> examinationResults;
    private List<ExaminationComment> examinationComments;
    private final int numPages;
    private PDDocument document;
    private int pageWidth, pageHeight;
    private Long grading_id;
    private String gradingProtocol;
    private List<ExaminationTechniqueCategory> examinationTechniqueCategories;
    private List<ExamineePair> examineePairs;
    private Map<String, Object> protocol;

    private String code;
    private String color;

    private final int   MAX_NUM_COLUMNS = 6,
                        PAGE_X_OFFSET = 55,
                        CELL_HEIGHT = 30,
                        CELL_WIDTH = 100,
                        MAX_NAME_LENGTH = 30,
                        MAX_TECHNIQUE_NAME_LENGTH = 63;

    private String fontPath;

    public ExportGradingPdf(String gradingProtocol, Grading grading, List<Examinee> examinees, List<ExaminationResult> examinationResults, List<ExaminationComment> examinationComments, List<ExamineePair> examineePairs) throws IOException {
        this.examinees = examinees;
        this.examinationResults = examinationResults;
        this.examinationComments = examinationComments;
        //This is the number of pages required to fit every examinee in a table (the max per page is 6)
        this.numPages = (int)Math.ceil((double)examinees.size() / MAX_NUM_COLUMNS);
        document = new PDDocument();
        this.gradingProtocol = gradingProtocol;
        this.examinationTechniqueCategories = new ArrayList<>();
        this.grading = grading;
        this.examineePairs = examineePairs;
        this.protocol = parseJson(gradingProtocol);

        String currentPath = new java.io.File(".").getCanonicalPath();

        fontPath = currentPath + "/infra/fonts/NotoSans-Regular.ttf";

        Map<String, Object> gradingProtocolObj = (Map<String, Object>) protocol.get("examination_protocol");
        this.code = (String)gradingProtocolObj.get("code");
        this.color = (String)gradingProtocolObj.get("color");
    }
    /**
     * The main method for the program which generates the entire PDF by calling private methods.
     * 
     * @throws IOException
     */
    public InputStream generate() throws IOException {

        List<Map<String, Object>> categories = (List<Map<String, Object>>)protocol.get("categories");

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

        ExaminationComment examinationComment = getExaminationComment();

        if(examinationComment != null)
            createExaminationCommentPage(examinationComment.getComment());

        List<ExaminationComment> techniqueComments = new ArrayList<>();
        for (ExaminationComment techniqueComment : examinationComments) {
            if(techniqueComment.getExamineeId() == null && techniqueComment.getExamineePairId() == null) {
                techniqueComments.add( techniqueComment);
            }
        }

        if(techniqueComments.size() > 0)
            createGroupCommentPage(techniqueComments);


        Map<Long, List<ExaminationComment>> pairMap = new HashMap<>();

        for (ExamineePair examineePair : examineePairs) {
            List<ExaminationComment> pairComments = new ArrayList<>();
            for (ExaminationComment pairComment : examinationComments) {
                if(pairComment.getExamineePairId() == examineePair.getExamineePairId()) {
                    pairComments.add( pairComment);
                }
            }
            pairMap.put(examineePair.getExamineePairId(), pairComments); 
        }

        Map<Long, List<ExaminationComment>> examineeCommentMap = new HashMap<>();

        for (Examinee examinee : examinees) {
            List<ExaminationComment> examineeComments = new ArrayList<>();
            for (ExaminationComment examineeComment : examinationComments) {
                if(examineeComment.getExamineeId() == examinee.getExamineeId()) {
                    examineeComments.add(examineeComment);
                }
            }
            examineeCommentMap.put(examinee.getExamineeId(), examineeComments); 
        }

        createPairCommentPage(pairMap);
        createExamineeCommentPage(examineeCommentMap);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        document.save(byteArrayOutputStream);
        document.close();

        return new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
    }
    
    /**
     * Get the examination comment for a grading.
     * 
     * @return Get the comment for the entire examination.
     */
    private ExaminationComment getExaminationComment() {
        for (ExaminationComment examinationComment : examinationComments) {
            if(examinationComment.getExamineeId() == null && examinationComment.getExamineePairId() == null &&
                examinationComment.getTechniqueName() == null)
                return examinationComment;
        }
        return null;
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
     * @param onPage, an int, to keep track which page is being written to...
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

        int currentXPos = tableStartXPos;
        int currentYPos = pageHeight-75;

        PDType0Font font = PDType0Font.load(document, new File (fontPath));
        PDPageContentStream contentStream = new PDPageContentStream(document,page);
        contentStream.setStrokingColor(Color.DARK_GRAY);
        contentStream.setLineWidth(1);
  
        createHeader(code, color, contentStream);

        drawImage(page, contentStream);
        contentStream.addRect(currentXPos, currentYPos, CELL_WIDTH+30, -CELL_HEIGHT);
        writeToCell(currentXPos, currentYPos, contentStream, "Namn", font);
        int count = 1;

        currentXPos+=CELL_WIDTH+30;
        for(int j = (onPage*MAX_NUM_COLUMNS); j<(onPage*MAX_NUM_COLUMNS)+MAX_NUM_COLUMNS && j < examinees.size();j++){
            contentStream.addRect(currentXPos,currentYPos,CELL_WIDTH,-CELL_HEIGHT);

            writeToCell(currentXPos, currentYPos, contentStream, shortenString(examinees.get(j).getName(), MAX_NAME_LENGTH), font);

            currentXPos+=CELL_WIDTH;
            count++;
        }
        currentXPos = tableStartXPos;
        currentYPos -= CELL_HEIGHT;
        for(int i = 0; i < examinationTechniqueCategories.size(); i++) {
                
            contentStream.addRect(currentXPos, currentYPos, CELL_WIDTH*count+30, -CELL_HEIGHT);
            writeToCell(currentXPos, currentYPos, contentStream, examinationTechniqueCategories.get(i).getCategoryName(), font);

            for(int j = 0; j < examinationTechniqueCategories.get(i).getTechniques().size(); j++) {
                currentYPos -=CELL_HEIGHT;
                contentStream.addRect(currentXPos, currentYPos, CELL_WIDTH+30, -CELL_HEIGHT);
                
                String techniqueName = examinationTechniqueCategories.get(i).getTechniques().get(j).toString();
                techniqueName = shortenString(techniqueName, MAX_TECHNIQUE_NAME_LENGTH);

                //Splits the string at the nearest space char and writes the rest on the next line in the cell
                int splitOnIndex = 35;
                if(techniqueName.length() > 35) {
                    for(int k = 0; k < 35; k++) {
                        if(techniqueName.charAt(k) == ' ')
                            splitOnIndex = k;
                    }

                    writeToCell(currentXPos, currentYPos+10, contentStream, techniqueName.substring(0, splitOnIndex), font);
                    writeToCell(currentXPos, currentYPos, contentStream, techniqueName.substring(splitOnIndex, techniqueName.length()), font);
                } 
                else  
                    writeToCell(currentXPos, currentYPos, contentStream, techniqueName, font);
                
                currentXPos+=CELL_WIDTH+30;

                for (int k = 0 ; k < count-1 ; k++) {
                    contentStream.addRect(currentXPos, currentYPos, CELL_WIDTH, -CELL_HEIGHT);
                    String grade = "";
                    for (int l = 0 ; l < examinationResults.size() ; l++) {
                        if ((examinationTechniqueCategories.get(i).getTechniques().get(j).toString()).equals(examinationResults.get(l).getTechniqueName())) {
                            if (examinees.get(k + (onPage*MAX_NUM_COLUMNS)).getExamineeId() == examinationResults.get(l).getExamineeId()) {
                                if (examinationResults.get(l).getPass() == null) {
                                    grade = "";
                                    continue;
                                }

                                if (examinationResults.get(l).getPass()) 
                                    grade = "G";
                                else
                                    grade = "U";
                            }
                        }
                    }

                    for (int l = 0; l < examinationComments.size() ; l++) {
                        if ((examinationTechniqueCategories.get(i).getTechniques().get(j).toString()).equals(examinationComments.get(l).getTechniqueName())) {
                            if (examinees.get(k + (onPage*MAX_NUM_COLUMNS)).getExamineeId() == examinationComments.get(l).getExamineeId()) 
                                grade += " - " + examinationComments.get(l).getComment();
                        }
                    }
                    writeToCell(currentXPos, currentYPos, contentStream, shortenString(grade, 25), font);
                    currentXPos+=CELL_WIDTH;
                }

                currentXPos = tableStartXPos;

                if(currentYPos - CELL_HEIGHT - 70 < 0) {
                    contentStream.stroke();
                    contentStream.close();
                    PDPage page2 = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
                    currentXPos = tableStartXPos;
                    currentYPos = pageHeight -75;
                    document.addPage(page2);

                    contentStream = new PDPageContentStream(document,page2);
                    createHeader(code, color, contentStream);
                    drawImage(page, contentStream);
                    contentStream.addRect(currentXPos, currentYPos, CELL_WIDTH+30, -CELL_HEIGHT);
                    writeToCell(currentXPos, currentYPos, contentStream, "Namn", font);
                    
                    currentXPos+=CELL_WIDTH+30;
                    for(int j2 = (onPage*MAX_NUM_COLUMNS); j2<(onPage*MAX_NUM_COLUMNS)+MAX_NUM_COLUMNS && j2 < examinees.size() ; j2++){
                        contentStream.addRect(currentXPos,currentYPos,CELL_WIDTH,-CELL_HEIGHT);
        
                        writeToCell(currentXPos, currentYPos, contentStream, shortenString(examinees.get(j2).getName(), MAX_NAME_LENGTH), font);
        
                        currentXPos+=CELL_WIDTH;
                    }
                    currentXPos = tableStartXPos;
                }
            }

            currentYPos -=CELL_HEIGHT;
        }
        
        contentStream.stroke();
        contentStream.close();
    }

    /**
     * Writes to the cell at a given position the given text.
     * 
     * @param currentXPos, the X position of the cell?
     * @param currentYPos, the Y position of the cell?
     * @param contentStream, the PDPageContentStream
     * @param cellText, the String containing the text that will be written to the cell.
     * @param font, the PDType0Font that will be used.
     * @throws IOException
     */
    private void writeToCell(int currentXPos, int currentYPos, PDPageContentStream contentStream, String cellText, PDType0Font font) throws IOException {
        contentStream.beginText();
        contentStream.newLineAtOffset(currentXPos+10,currentYPos-CELL_HEIGHT+10);
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
        PDType0Font font = PDType0Font.load(document, new File(fontPath));
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String date = sdf.format(grading.getCreatedAt()).toString();
        int currentXPos = PAGE_X_OFFSET;
        int currentYPos = pageHeight-25;
        
        //Draws colored rectangle over belt name
        Color beltColor = getHighlightColor(color);
        contentStream.addRect(currentXPos - 2, currentYPos - 20, 120, 15);
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
        contentStream.newLineAtOffset(currentXPos, currentYPos);
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
      * Creates the group comment pdf page and writes the group comment to the pdf page.
      * @param examinationComment - The comment, if any, of a grading/examination
      * @throws IOException
      */
    private void createExaminationCommentPage(String examinationComment) throws IOException {
        PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
        document.addPage(page);
        
        pageWidth = (int)page.getMediaBox().getWidth(); 
        pageHeight = (int)page.getMediaBox().getHeight();         
        int currentXPos = PAGE_X_OFFSET;
        int currentYPos = pageHeight-75;
        
        PDType0Font font = PDType0Font.load(document, new File(fontPath));
        PDPageContentStream contentStream = new PDPageContentStream(document,page);
        contentStream.setStrokingColor(Color.DARK_GRAY);
        contentStream.setLineWidth(1);
        
        createHeader(code, color, contentStream);
        drawImage(page, contentStream);
          
        List<String> rows = getRows(examinationComment, 120);
        
        contentStream.beginText();
        contentStream.setFont(font, 14);
        contentStream.newLineAtOffset(currentXPos, currentYPos -= 30);
        contentStream.showText("Passkommentar");
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
      * @param pairMap - a map containing all pair comments of a grading
      * @throws IOException
    */
    private void createPairCommentPage(Map<Long, List<ExaminationComment>> pairMap) throws IOException {
        PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
        document.addPage(page);

        pageWidth = (int)page.getMediaBox().getWidth(); 
        pageHeight = (int)page.getMediaBox().getHeight();     
        int currentXPos = PAGE_X_OFFSET;
        int currentYPos = pageHeight-105;
        
        PDType0Font font = PDType0Font.load(document, new File(fontPath));
        PDPageContentStream contentStream = new PDPageContentStream(document,page);
        contentStream.setStrokingColor(Color.DARK_GRAY);
        contentStream.setLineWidth(1);
        drawImage(page, contentStream);
        createHeader(code, color, contentStream);
        contentStream.beginText();
        contentStream.setFont(font, 14);
        contentStream.newLineAtOffset(currentXPos, currentYPos);
        contentStream.showText("Parkommentarer");
        contentStream.endText();
        //30 pixels is the distance between the title and where the comments section begin
        currentYPos -= 30;

        Map<Long, List<String>> rows = new HashMap<>();

        for (Long pairId : pairMap.keySet()) {
            List<String> pairRows = new ArrayList<>();
            for (ExaminationComment c: pairMap.get(pairId)) {
                List<String> tempRows = getRows(c.getTechniqueName() +" - "+ c.getComment(), 120);
                pairRows = Stream.concat(pairRows.stream(), tempRows.stream()).toList();
            } 
            rows.put(pairId, pairRows); 
        }

        String examinee1, examinee2;
        examinee1 = examinee2 = "";
        for (Long pairId: rows.keySet()) { 
            //Skip empty comment list
            if(rows.get(pairId).size() == 0)
                continue;

            for (ExamineePair examineePair : examineePairs) {
                if(pairId == examineePair.getExamineePairId()) {
                    for (Examinee examinee : examinees) {
                        if(examineePair.getExaminee1Id() == examinee.getExamineeId()) {
                            examinee1 = examinee.getName();
                        } else if(examineePair.getExaminee2Id() == examinee.getExamineeId()) {
                            examinee2 = examinee.getName();
                        }
                    }
                }    
            }

            //Checks if the next comment block will fit on the page, if not a new page is created
            if (currentYPos - rows.get(pairId).size() * 15 + 30 <= 0) {
                contentStream.close();
                page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
                document.addPage(page);        
                contentStream = new PDPageContentStream(document,page);
                drawImage(page, contentStream);
                createHeader(code, color, contentStream);
                currentYPos = pageHeight-105;
                contentStream.beginText();
                contentStream.setFont(font, 14);
                contentStream.newLineAtOffset(currentXPos, currentYPos);
                contentStream.showText("Parkommentarer");
                contentStream.endText();
                currentYPos -= 30;
            }
            
            contentStream.beginText();
            contentStream.newLineAtOffset(currentXPos + 5, currentYPos);
            contentStream.setFont(font, 12);
            contentStream.showText(examinee1 + " & " + examinee2);
            contentStream.setFont(font, 10);

            for(int j = 0; j < rows.get(pairId).size(); j++) {
                //This newLineAtOffset position is relative to the previous due to it being in the same beginText to endText section
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText(rows.get(pairId).get(j));
            }    
        
            contentStream.endText();

            //Calculates the size of the rectangle which encapsulates the comment
            contentStream.addRect(currentXPos, currentYPos - (5 + rows.get(pairId).size()*15), CELL_WIDTH * 7 + 30, rows.get(pairId).size() * 15);
            contentStream.stroke();
            //Calculates the distance between the comments
            currentYPos -= rows.get(pairId).size() * 15 + 30;
            
        }        
        contentStream.close();
    }

    /**
      * Creates the examinee comment pdf page and writes the group comment to the pdf page. 
      * @param examineeComments - The individual comments of each examinee of a examination
      * @throws IOException
    */
    private void createExamineeCommentPage(Map<Long, List<ExaminationComment>> examineeComments) throws IOException {
        PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
        document.addPage(page);

        pageWidth = (int)page.getMediaBox().getWidth(); 
        pageHeight = (int)page.getMediaBox().getHeight();     
        int currentXPos = PAGE_X_OFFSET;
        int currentYPos = pageHeight-105;
        
        PDType0Font font = PDType0Font.load(document, new File(fontPath));
        PDPageContentStream contentStream = new PDPageContentStream(document,page);
        contentStream.setStrokingColor(Color.DARK_GRAY);
        contentStream.setLineWidth(1);

        
        drawImage(page, contentStream);
        createHeader(code, color, contentStream);
        contentStream.beginText();
        contentStream.setFont(font, 14);
        contentStream.newLineAtOffset(currentXPos, currentYPos);
        contentStream.showText("Personliga Kommentarer");
        contentStream.endText();
        //30 pixels is the distance between the title and where the comments section begin
        currentYPos -= 30;

        Map<Long, List<String>> rows = new HashMap<>();

        for (Long examineeId : examineeComments.keySet()) {
            List<String> commentRows = new ArrayList<>();
            for (ExaminationComment c: examineeComments.get(examineeId)) {
                List<String> tempRows = getRows(c.getTechniqueName() +" - "+ c.getComment(), 120);
                commentRows = Stream.concat(commentRows.stream(), tempRows.stream()).toList();
            } 
            rows.put(examineeId, commentRows); 
        }

        for (Examinee examinee: examinees) {         
            if(rows.get(examinee.getExamineeId()).size() == 0)
                continue;   
            //Checks if the next comment block will fit on the page, if not a new page is created
            if (currentYPos - rows.get(examinee.getExamineeId()).size() * 15 + 30 <= 0) {
                contentStream.close();
                page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
                document.addPage(page);        
                contentStream = new PDPageContentStream(document,page);
                drawImage(page, contentStream);
                createHeader(code, color, contentStream);
                currentYPos = pageHeight - 105;
                contentStream.beginText();
                contentStream.setFont(font, 14);
                contentStream.newLineAtOffset(currentXPos, currentYPos);
                contentStream.showText("Personliga kommentarer");
                contentStream.endText();
                currentYPos -= 30;
            }

            contentStream.beginText();
            contentStream.newLineAtOffset(currentXPos + 5, currentYPos);
            contentStream.setFont(font, 12);
            contentStream.showText(examinee.getName());
            contentStream.setFont(font, 10);
            for(int j = 0; j < rows.get(examinee.getExamineeId()).size(); j++) {
                //This newLineAtOffset position is relative to the previous due to it being in the same beginText to endText section
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText(rows.get(examinee.getExamineeId()).get(j).replaceAll("\\u0009", " "));
            }
            contentStream.endText();

            //Calculates the size of the rectangle to enclose the comment
            contentStream.addRect(currentXPos, currentYPos - (5 + rows.get(examinee.getExamineeId()).size()*15), CELL_WIDTH * 7 + 30, rows.get(examinee.getExamineeId()).size() * 15);
            contentStream.stroke();
            currentYPos -= rows.get(examinee.getExamineeId()).size() * 15 + 30;
        }        
        contentStream.close();
    }

   /**
    * Creates the examinee comment pdf page and writes the group comment to the pdf page.
    *
    * @param techniqueComments - A list containing technique comments
    * @throws IOException
    */
    private void createGroupCommentPage(List<ExaminationComment> techniqueComments) throws IOException {
        PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
        document.addPage(page);

        pageWidth = (int)page.getMediaBox().getWidth(); 
        pageHeight = (int)page.getMediaBox().getHeight();     
        int currentXPos = PAGE_X_OFFSET;
        int currentYPos = pageHeight-105;
        
        PDType0Font font = PDType0Font.load(document, new File(fontPath));
        PDPageContentStream contentStream = new PDPageContentStream(document,page);
        contentStream.setStrokingColor(Color.DARK_GRAY);
        contentStream.setLineWidth(1);
        
        drawImage(page, contentStream);
        createHeader(code, color, contentStream);
        contentStream.beginText();
        contentStream.setFont(font, 14);
        contentStream.newLineAtOffset(currentXPos, currentYPos);
        contentStream.showText("Teknikkommentarer");
        contentStream.endText();
        //30 pixels is the distance between the title and where the comments section begin
        currentYPos -= 30;


        for (ExaminationComment techniqueComment : techniqueComments){
            String examineeComment = techniqueComment.getComment();
            List<String> rows = getRows(examineeComment, 120);
            
            //Checks if the next comment block will fit on the page, if not a new page is created
            if (currentYPos - rows.size() * 15 + 30 <= 0) {
                contentStream.close();
                page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
                document.addPage(page);        
                contentStream = new PDPageContentStream(document,page);
                drawImage(page, contentStream);
                createHeader(code, color, contentStream);
                currentYPos = pageHeight - 105;
                contentStream.beginText();
                contentStream.setFont(font, 14);
                contentStream.newLineAtOffset(currentXPos, currentYPos);
                contentStream.showText("Teknikkommentarer");
                contentStream.endText();
                currentYPos -= 30;
            }

            contentStream.beginText();
            contentStream.newLineAtOffset(currentXPos + 5, currentYPos);
            contentStream.setFont(font, 12);
            contentStream.showText(techniqueComment.getTechniqueName());
            contentStream.setFont(font, 10);
            for(int j = 0; j < rows.size(); j++) {
                //This newLineAtOffset position is relative to the previous due to it being in the same beginText to endText section
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText(rows.get(j));
            }
            contentStream.endText();

            //Calculates the size of the rectangle to enclose the comment
            contentStream.addRect(currentXPos, currentYPos - (5 + rows.size()*15), CELL_WIDTH * 7 + 30, rows.size() * 15);
            contentStream.stroke();
            currentYPos -= rows.size() * 15 + 30;
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

                rows.add(string.substring(startIndex, stopIndex).replaceAll("\\u000a\\u0009", ""));
                
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
