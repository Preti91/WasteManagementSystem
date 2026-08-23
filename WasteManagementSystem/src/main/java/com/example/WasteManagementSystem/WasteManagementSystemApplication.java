package com.example.WasteManagementSystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication//(exclude = {DataSourceAutoConfiguration.class})
public class WasteManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(WasteManagementSystemApplication.class, args);
		System.out.println("hiiiiiiiiiiiiiii");
	}

}
