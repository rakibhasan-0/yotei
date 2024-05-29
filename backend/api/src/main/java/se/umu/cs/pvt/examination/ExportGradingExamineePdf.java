package se.umu.cs.pvt.examination;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.awt.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.boot.json.JsonParserFactory;

public class ExportGradingExamineePdf {
    private Examinee examinee;
    private Grading grading;
    private List<ExaminationResult> examinationResults;
    private List<ExaminationComment> examinationComments;
    private List<Examinee> examinees;
    private PDDocument document;
    private int pageWidth, pageHeight;
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

    public ExportGradingExamineePdf(String gradingProtocol, Grading grading,Examinee examinee, List<ExaminationResult> examinationResults, 
    List<ExaminationComment> examinationComments, List<ExamineePair> examineePairs, List<Examinee> examinees) throws IOException {
        this.gradingProtocol = gradingProtocol;
        this.grading = grading;
        this.examinee = examinee;
        this.examinationResults = examinationResults;
        this.examinationComments = examinationComments;
        this.examineePairs = examineePairs;
        this.examinees = examinees;
        this.protocol = parseJson(gradingProtocol);
        fontPath = System.getenv("PDF_ASSET_PATH") + "/NotoSans-Regular.ttf";
        
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

        //createTablePage();

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



        List<ExaminationComment> examineePaircomments = new ArrayList<>();
        
        for(ExamineePair e: examineePairs){
            if(e.getExaminee1Id() == examinee.getExamineeId() || e.getExaminee2Id() == examinee.getExamineeId()){
                for (ExaminationComment examineePairComment : examinationComments) {
                    if(examineePairComment.getExamineePairId() == e.getExamineePairId()) {
                        examineePaircomments.add( examineePairComment);
                    }
                }
            }

        }
        if(examineePaircomments.size() > 0)
            createPairCommentPage(examineePaircomments);
    
        List<ExaminationComment> examineeComments = new ArrayList<>();
        for (ExaminationComment examineeComment : examinationComments) {
            if(examinee.getExamineeId() == examineeComment.getExamineeId()) {
                examineeComments.add(examineeComment);
            }
        }
        
        if(examineeComments.size() > 0)
            createExamineeCommentPage(examineeComments);

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
        String path = System.getenv("PDF_ASSET_PATH") + "/ubk-logga.jpg";
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
    private void createTablePage() throws IOException {
        PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
        document.addPage(page);
        pageWidth = (int)page.getMediaBox().getWidth(); 
        pageHeight = (int)page.getMediaBox().getHeight(); 


        //Calculate where starting x position for the table should be
        int tableStartXPos = (pageWidth/2) - ((2)* CELL_WIDTH + 30)/2;

        int currentXPos = tableStartXPos;
        int currentYPos = pageHeight-75;

        PDType0Font font = PDType0Font.load(document, new File (fontPath));
        PDPageContentStream contentStream = new PDPageContentStream(document,page);
        contentStream.setStrokingColor(Color.DARK_GRAY);
        contentStream.setLineWidth(1);
  
        createHeader(code, color, contentStream);

        drawImage(page, contentStream);
        contentStream.addRect(currentXPos, currentYPos, CELL_WIDTH+30, -CELL_HEIGHT);
        contentStream.stroke();
        writeToCell(currentXPos, currentYPos, contentStream, "Namn", font);
        int count = 1;

        currentXPos+=CELL_WIDTH+30;
        // for(int j = (onPage*MAX_NUM_COLUMNS); j<(onPage*MAX_NUM_COLUMNS)+MAX_NUM_COLUMNS && j < examinees.size();j++){
        //     contentStream.addRect(currentXPos,currentYPos,CELL_WIDTH,-CELL_HEIGHT);

        //     writeToCell(currentXPos, currentYPos, contentStream, shortenString(examinees.get(j).getName(), MAX_NAME_LENGTH), font);

        //     currentXPos+=CELL_WIDTH;
        //     count++;
        // }
        contentStream.addRect(currentXPos,currentYPos,CELL_WIDTH,-CELL_HEIGHT);
        contentStream.stroke();
        writeToCell(currentXPos, currentYPos, contentStream, shortenString(examinee.getName(), MAX_NAME_LENGTH), font);
        currentXPos = tableStartXPos;
        currentYPos -= CELL_HEIGHT;
        for(int i = 0; i < examinationTechniqueCategories.size(); i++) {
                
            contentStream.addRect(currentXPos, currentYPos, CELL_WIDTH*count+30, -CELL_HEIGHT);
            contentStream.stroke();
            writeToCell(currentXPos, currentYPos, contentStream, examinationTechniqueCategories.get(i).getCategoryName(), font);

            for(int j = 0; j < examinationTechniqueCategories.get(i).getTechniques().size(); j++) {
                currentYPos -=CELL_HEIGHT;
                contentStream.addRect(currentXPos, currentYPos, CELL_WIDTH+30, -CELL_HEIGHT);
                contentStream.stroke();
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

             //   for (int k = 0 ; k < count-1 ; k++) {
                contentStream.addRect(currentXPos, currentYPos, CELL_WIDTH, -CELL_HEIGHT);
                contentStream.stroke();
                String grade = "";
                for (int l = 0 ; l < examinationResults.size() ; l++) {
                    if ((examinationTechniqueCategories.get(i).getTechniques().get(j).toString()).equals(examinationResults.get(l).getTechniqueName())) {
                        // if (examinees.get(k + (onPage*MAX_NUM_COLUMNS)).getExamineeId() == examinationResults.get(l).getExamineeId()) {
                        if (examinationResults.get(l).getPass() == null) {
                            grade = "";
                            continue;
                        }

                        if (examinationResults.get(l).getPass()) 
                            grade = "G";
                        else
                            grade = "U";
                        //}
                    }
                }

                for (int l = 0; l < examinationComments.size() ; l++) {
                    if ((examinationTechniqueCategories.get(i).getTechniques().get(j).toString()).equals(examinationComments.get(l).getTechniqueName())) {
                        if (examinee.getExamineeId() == examinationComments.get(l).getExamineeId()) 
                            grade += " - " + examinationComments.get(l).getComment();
                    }
                }
                writeToCell(currentXPos, currentYPos, contentStream, shortenString(grade, 25), font);
                currentXPos+=CELL_WIDTH;
         //       }

                currentXPos = tableStartXPos;

                
                //Creates a new page if the techniques don't fit on the page, j != examinationTC size -1 is a quick fix to avoid a bug where a empty page is created.
                if(currentYPos - CELL_HEIGHT - 70 < 0 && j != examinationTechniqueCategories.get(i).getTechniques().size() - 1) {
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
                    contentStream.addRect(currentXPos,currentYPos,CELL_WIDTH,-CELL_HEIGHT);
    
                    writeToCell(currentXPos, currentYPos, contentStream, shortenString(examinee.getName(), MAX_NAME_LENGTH), font);
    
                    currentXPos+=CELL_WIDTH;
                    
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
        
        switch(split[0]) {
            case "GULT":
                return Color.decode("#FFDD33");
            case "BRUNT":
                return Color.decode("#83530C");
            case "ORANGE":
                return Color.decode("#FFA133");
            case "GRÖNT":
                return Color.decode("#0C7D2B");
            case "BLÅTT":
                return Color.decode("#1E9CE3");
            default:
                return new Color(1f,1f,1f);
        }
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
            contentStream.showText(rows.get(i).replaceAll("\\u000a", ""));
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
    private void createPairCommentPage(List<ExaminationComment> examinationPairComments) throws IOException {
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

        String examinee1, examinee2;
        examinee1 = examinee.getName(); 
        examinee2 = "";
        // for (Long pairId: rows.keySet()) { 
        //     //Skip empty comment list
        //     if(rows.get(pairId).size() == 0)
        //         continue;

        for (ExamineePair examineePair : examineePairs) {
            if(examineePair.getExaminee1Id() == examinee.getExamineeId() || examineePair.getExaminee2Id() == examinee.getExamineeId()) {
                for(Examinee e : examinees) {
                    if(examineePair.getExaminee1Id() == e.getExamineeId()) {
                        examinee1 = e.getName();
                    }
                }
            }    
        }

        //Checks if the next comment block will fit on the page, if not a new page is created
        /*if (currentYPos - (rows.get(pairId).size() * 15 + 30) <= 0) {
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
        }*/
        
        contentStream.beginText();
        contentStream.newLineAtOffset(currentXPos + 5, currentYPos);
        contentStream.setFont(font, 12);
        contentStream.showText((examinee1 + " & " + examinee2).replaceAll("\\u000a", ""));
        contentStream.setFont(font, 10);

        for(ExaminationComment ec : examinationPairComments) {
            //This newLineAtOffset position is relative to the previous due to it being in the same beginText to endText section
            contentStream.newLineAtOffset(0, -15);
            contentStream.showText(ec.getComment().replaceAll("\\u000a", ""));
        }    
    
        contentStream.endText();

        //Calculates the size of the rectangle which encapsulates the comment
        contentStream.addRect(currentXPos, currentYPos - (5 + examinationPairComments.size()*15), CELL_WIDTH * 7 + 30, examinationPairComments.size() * 15);
        contentStream.stroke();
        //Calculates the distance between the comments
        //currentYPos -= rows.get(pairId).size() * 15 + 30;
            
        //}        
        contentStream.close();
    }
    
    /**
      * Creates the examinee comment pdf page and writes the group comment to the pdf page. 
      * @param examineeComments - The individual comments of each examinee of a examination
      * @throws IOException
    */
    private void createExamineeCommentPage(List<ExaminationComment> examineeComments) throws IOException {
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


        contentStream.beginText();
        contentStream.newLineAtOffset(currentXPos + 5, currentYPos);
        contentStream.setFont(font, 12);
        contentStream.showText(examinee.getName().replaceAll("\\u000a", ""));
        contentStream.setFont(font, 10);
        for( ExaminationComment ec: examineeComments){
            //This newLineAtOffset position is relative to the previous due to it being in the same beginText to endText section
            contentStream.newLineAtOffset(0, -15);
            contentStream.showText(ec.getComment().replaceAll("\\u0009", " "));
        }
        contentStream.endText();

        //Calculates the size of the rectangle to enclose the comment
        contentStream.addRect(currentXPos, currentYPos - (5 + examineeComments.size()*15), CELL_WIDTH * 7 + 30, examinationComments.size() * 15);
        contentStream.stroke();
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
            if (currentYPos - (rows.size() * 15 + 30) <= 0) {
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
            contentStream.showText(techniqueComment.getTechniqueName().replaceAll("\\u000a", ""));
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

                String tmpStr = string.substring(startIndex, stopIndex);
                tmpStr = string.substring(startIndex, stopIndex).replaceAll("\\u0009", "").replaceAll("\\u000a", "");
                rows.add(tmpStr);
                
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
