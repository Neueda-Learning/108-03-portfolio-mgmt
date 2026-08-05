package com.neueda.repository;

import com.neueda.model.Holdings;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface HoldingRepository extends CrudRepository<Holdings, Integer> {
	List<Holdings> findByUserId(int userId);
}
