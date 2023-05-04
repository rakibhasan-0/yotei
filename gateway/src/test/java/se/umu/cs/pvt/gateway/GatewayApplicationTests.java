package se.umu.cs.pvt.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest(classes = GatewayApplication.class)
class GatewayApplicationTests {

	static {
		System.setProperty("BACKEND_HOST", "http://localhost:80");
		System.setProperty("WEBSERVER_HOST", "http://localhost:80");
	}

	@Test
	void contextLoads() {
	}

}
