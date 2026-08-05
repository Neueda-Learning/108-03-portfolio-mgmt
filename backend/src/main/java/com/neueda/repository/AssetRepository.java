package com.neueda.repository;

import com.neueda.model.Assets;
import org.springframework.data.repository.CrudRepository;

public interface AssetRepository extends CrudRepository<Assets, Integer> {
}
