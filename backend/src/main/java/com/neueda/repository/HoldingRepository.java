package com.neueda.repository;

import com.neueda.model.Holdings;
import org.springframework.data.repository.CrudRepository;

public interface HoldingRepository extends CrudRepository<Holdings, Integer> {
}
