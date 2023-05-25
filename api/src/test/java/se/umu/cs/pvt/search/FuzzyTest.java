package se.umu.cs.pvt.search;

import org.junit.jupiter.api.Test;
import se.umu.cs.pvt.search.interfaces.SearchResponseInterface;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

public class FuzzyTest {

    @Test
    void shouldBeNull() {

        List<TestResult> databaseResult = null;

        List<TestResult> searches = Fuzzy.search("KHION", databaseResult);

        assertThat(searches).isNull();
    }

    @Test
    void hasResults() {

        List<TestResult> databaseResult = new ArrayList<>();


        databaseResult.add(new TestResult("KHION"));
        databaseResult.add(new TestResult("JIGO WAZA"));
        databaseResult.add(new TestResult("KATAME WAZA"));
        databaseResult.add(new TestResult("TACHI WAZA"));
        databaseResult.add(new TestResult("JIGO WAZA, Livtag under armarna framifrån"));
        databaseResult.add(new TestResult("JIGO WAZA, Grepp i håret framifrån"));
        databaseResult.add(new TestResult("JIGO WAZA, Påkslag mot huvudet"));

        List<TestResult> searches = Fuzzy.search("KHION", databaseResult);

        assertThat(searches.size()).isGreaterThan(0);
    }

    @Test
    void hasKhionAsTop() {

        List<TestResult> databaseResult = new ArrayList<>();


        databaseResult.add(new TestResult("JIGO WAZA"));
        databaseResult.add(new TestResult("KHION"));
        databaseResult.add(new TestResult("KATAME WAZA"));
        databaseResult.add(new TestResult("TACHI WAZA"));
        databaseResult.add(new TestResult("JIGO WAZA, Livtag under armarna framifrån"));
        databaseResult.add(new TestResult("JIGO WAZA, Grepp i håret framifrån"));
        databaseResult.add(new TestResult("JIGO WAZA, Påkslag mot huvudet"));

        List<TestResult> searches = Fuzzy.search("KHION", databaseResult);


        assertThat(searches.get(0).getName()).isEqualTo("KHION");
    }

    @Test
    void badMatchGetsRemoved() {

        List<TestResult> databaseResult = new ArrayList<>();

        databaseResult.add(new TestResult("KHION WAZA"));
        databaseResult.add(new TestResult("JIGO WAZA"));
        databaseResult.add(new TestResult("KATAME WAZA"));
        databaseResult.add(new TestResult("TACHI WAZA"));
        databaseResult.add(new TestResult("8888283823"));
        databaseResult.add(new TestResult("JIGO WAZA, Livtag under armarna framifrån"));
        databaseResult.add(new TestResult("JIGO WAZA, Grepp i håret framifrån"));
        databaseResult.add(new TestResult("JIGO WAZA, Påkslag mot huvudet"));

        List<TestResult> searches = Fuzzy.search("WAZA", databaseResult);
        String weirdResult = "";
        for (TestResult t:searches) {
            if (t.getName().equals("8888283823")){
                weirdResult = t.getName();
            }
        }
        assertThat(weirdResult).isNotEqualTo("8888283823");
    }

    @Test
    void sortingTest() {

        List<TestResult> facit = new ArrayList<>();

        facit.add(new TestResult("ABCDEF"));
        facit.add(new TestResult("ABCDEB"));

        List<TestResult> databaseResult = new ArrayList<>(facit);
        Collections.shuffle(databaseResult); //shuffle list to check sorting

        List<TestResult> searches = Fuzzy.search("ABCDEF", databaseResult);


        assertThat(searches).isEqualTo(facit);
    }
}

class TestResult implements SearchResponseInterface {

    String s;

    public TestResult(String s){
        this.s = s;

    }
    @Override
    public String getName() {
        return s;
    }
}
