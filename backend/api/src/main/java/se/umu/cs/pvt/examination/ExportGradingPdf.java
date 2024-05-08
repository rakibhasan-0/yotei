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


    private List<Examinee> examinees;
    private Grading grading;
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

        PDType0Font font = PDType0Font.load(document, new File("/usr/share/fonts/noto/NotoSans-Regular.ttf"));
        PDPageContentStream contentStream = new PDPageContentStream(document,page);
        contentStream.setStrokingColor(Color.DARK_GRAY);
        contentStream.setLineWidth(1);
        Map<String, Object> protocol = parseJson(gradingProtocol);
        Map<String, Object> gradingProtocolObj = (Map<String, Object>) protocol.get("grading_protocol");

        String code = (String) gradingProtocolObj.get("code");
        String color = (String) gradingProtocolObj.get("color");

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd  HH:mm");
        createHeader(code + " " + color, sdf.format(grading.getCreated_at()).toString(), contentStream);

        drawImage(page, contentStream);
        contentStream.addRect(initX, initY, CELL_WIDTH+30, -CELL_HEIGHT);
        writeToCell(initX, initY, contentStream, "Namn", font);
        int count = 1;

        initX+=CELL_WIDTH+30;
        for(int j = (onPage*MAX_NUM_COLUMNS); j<(onPage*MAX_NUM_COLUMNS)+MAX_NUM_COLUMNS && j < examinees.size();j++){
            contentStream.addRect(initX,initY,CELL_WIDTH,-CELL_HEIGHT);

            writeToCell(initX, initY, contentStream, examinees.get(j).getName(), font);

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

                if(row_count > MAX_NUM_ROWS) {
                    contentStream.stroke();
                    contentStream.close();
                    PDPage page2 = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
                    initX = TABLE_START_X_POS;
                    initY = pageHeight -75;
                    document.addPage(page2);

                    row_count = 0;
                    contentStream = new PDPageContentStream(document,page2);
                    createHeader(code + " " + color, sdf.format(grading.getCreated_at()).toString(), contentStream);
                    drawImage(page, contentStream);
                    contentStream.addRect(initX, initY, CELL_WIDTH+30, -CELL_HEIGHT);
                    writeToCell(initX, initY, contentStream, "Namn", font);
                    int count2 = 1;
                    
                    initX+=CELL_WIDTH+30;
                    for(int j2 = (onPage*MAX_NUM_COLUMNS); j2<(onPage*MAX_NUM_COLUMNS)+MAX_NUM_COLUMNS && j2 < examinees.size();j2++){
                        contentStream.addRect(initX,initY,CELL_WIDTH,-CELL_HEIGHT);
        
                        writeToCell(initX, initY, contentStream, examinees.get(j2).getName(), font);
        
                        initX+=CELL_WIDTH;
                        count2++;
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


    private void createHeader(String belt_name, String date, PDPageContentStream contentStream) throws IOException {
        PDType0Font font = PDType0Font.load(document, new File("/usr/share/fonts/noto/NotoSans-Regular.ttf"));
        int initX = TABLE_START_X_POS;
        int initY = pageHeight-75;

        //Set header data
        contentStream.beginText();
        contentStream.setFont(font, 10);
        contentStream.newLineAtOffset(initX, initY + 50);
        contentStream.showText("Graderingprotokoll");
        contentStream.newLineAtOffset(0, -15);
        contentStream.showText(belt_name);
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

        //Här skapar vi sidorna för kommentarerna där de står t.ex. #1 Bra jobbat\n #2 du suger
        createGroupCommentPage();
        document.save("/home/marcus/school/yotei/test.pdf");
        document.close();
    }

    private void createGroupCommentPage() throws IOException {
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

        createHeader(code + " " + color, "2024-05-07", contentStream);
        drawImage(page, contentStream);

        String groupComment = """                
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultrices nibh ac nibh tempor sagittis. Proin non eleifend diam. Aliquam eget egestas neque. Sed tortor dui, tincidunt eu venenatis in, sollicitudin sit amet risus. Mauris pharetra turpis in lectus euismod, ac lobortis urna tincidunt. Vestibulum tincidunt luctus sapien ut rhoncus. Curabitur sit amet orci purus. Praesent consectetur, ante vitae pharetra euismod, sapien lorem interdum dolor, vitae fringilla orci tellus et sem.

Proin eu orci eu dolor dapibus consectetur. Nunc mollis augue felis. Vestibulum vitae suscipit massa, consectetur suscipit mauris. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent finibus blandit placerat. Nullam imperdiet eleifend maximus. Pellentesque tempus vel mauris euismod scelerisque. Vivamus nisi leo, accumsan a ex non, molestie molestie libero. Phasellus sit amet tincidunt nibh. Nulla vel pretium nisi, ac varius elit. Praesent molestie sem velit, et scelerisque sapien mollis at. Proin tempus aliquam neque, vel sagittis orci condimentum at.

Suspendisse eget scelerisque tortor. Cras at ornare felis, ut varius nibh. Nunc nec odio velit. Morbi non placerat urna. Proin augue nunc, tempor ut nisl consequat, tincidunt consequat dolor. Aliquam elementum scelerisque lectus, vitae elementum sapien condimentum eu. Fusce eget augue sit amet arcu pellentesque rutrum. Nullam lacinia non massa id pulvinar. Sed hendrerit velit sapien, sed porttitor nulla fermentum eu. Proin a ullamcorper ante, in sodales dolor. Pellentesque in suscipit arcu. Fusce vitae neque orci.

Nunc eget blandit leo. Nulla non pretium nulla. Sed id placerat ligula. Vestibulum risus sem, egestas non dolor eu, gravida eleifend purus. Mauris tempor quam id nulla molestie, ut euismod purus sagittis. Suspendisse varius diam venenatis tortor facilisis mollis. Vivamus at elit sit amet mi gravida vestibulum vitae posuere enim. Sed finibus rhoncus neque eget feugiat. Phasellus semper ligula nulla, porta rhoncus dui commodo non. Proin eget dapibus lacus. Nam fermentum dui a velit pellentesque porttitor. Maecenas bibendum eros nulla, id tempus elit rhoncus nec. Mauris mattis malesuada felis malesuada volutpat. Sed nec sem quis leo volutpat pellentesque. Nullam consectetur faucibus mauris eu facilisis.

Praesent enim risus, facilisis vitae varius ut, convallis vel arcu. Maecenas vestibulum fermentum felis eu consequat. Maecenas vitae libero venenatis, volutpat est nec, aliquet metus. Sed tincidunt massa a turpis maximus, quis tristique orci congue. Proin vitae felis est. Aenean sodales purus dui. Nullam nec risus lectus. Integer egestas diam velit, at congue ex rutrum non. Phasellus vitae condimentum massa. Nunc in lacus et tellus rutrum tempor ut at dui. Mauris eleifend leo id lectus pharetra, ultrices rutrum justo condimentum. Nullam pharetra volutpat leo, nec dapibus tortor sagittis vitae. Nunc congue nec ante et ultricies. Cras vel imperdiet velit, sed tempus risus. Ut pellentesque nibh in tellus scelerisque posuere ut vitae felis. Sed eu lacus consectetur, gravida lectus sed, porttitor augue.

Ut orci ligula, ornare at quam ut, ultrices euismod orci. Aenean et pretium libero. Integer tempor ultrices magna, vitae malesuada ipsum faucibus non. Duis vel aliquam nunc. Nulla lacinia mi eget eros tristique, non faucibus est eleifend. Cras fringilla ligula nec augue molestie convallis. Mauris auctor. 
                """;

        List<String> rows = new ArrayList<>();

        if(groupComment.length() > 120) {

            int numRows = (int)Math.ceil((double)groupComment.length() / 120);

            int startIndex = 0;
            int stopIndex = 120;

            for(int i = 0; i < numRows; i++) {
                System.out.println("Stopindex start: " + stopIndex);

                int lastSpaceIndex = groupComment.substring(startIndex, stopIndex).lastIndexOf(' ');

                if(lastSpaceIndex > 0) {
                    stopIndex = lastSpaceIndex + startIndex +1;
                }

                System.out.println(startIndex);
                System.out.println(stopIndex);
                System.out.println("====================");

                rows.add(groupComment.substring(startIndex, stopIndex).replaceAll("\\u000a", ""));

                startIndex = stopIndex;
                if(stopIndex + 120 <= groupComment.length())
                    stopIndex = stopIndex + 120;
                else
                    stopIndex = groupComment.length();

            }
        }
        
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

    private String stripName(String name) {
        if(name.length() > 15) {
            name = name.substring(0, 12);
            name = name + "...";
        }
        return name;
    }
}
