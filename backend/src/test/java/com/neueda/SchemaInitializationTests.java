package com.neueda;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootTest(properties = {
	"spring.sql.init.mode=always",
	"spring.datasource.url=jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1",
	"spring.datasource.driverClassName=org.h2.Driver",
	"spring.datasource.username=sa",
	"spring.datasource.password="
})
class SchemaInitializationTests {

	private static final List<String> EXPECTED_TABLES = List.of(
		"USERS",
		"TYPES",
		"ASSETS",
		"ACTIONS",
		"HOLDINGS"
	);

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Test
	void createsAllExpectedTables() {
		List<String> actualTables = jdbcTemplate.queryForList(
			"SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'PUBLIC'",
			String.class
		);

		assertThat(actualTables).containsAll(EXPECTED_TABLES);
	}

	@Test
	void holdingsTableHasExpectedForeignKeys() {
		Integer foreignKeyCount = jdbcTemplate.queryForObject(
			"""
			SELECT COUNT(*)
			FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
			WHERE TABLE_SCHEMA = 'PUBLIC'
			  AND TABLE_NAME = 'HOLDINGS'
			  AND CONSTRAINT_TYPE = 'FOREIGN KEY'
			""",
			Integer.class
		);

		assertThat(foreignKeyCount).isEqualTo(3);
	}
}