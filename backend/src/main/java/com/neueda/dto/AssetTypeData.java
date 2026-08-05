package com.neueda.dto;

import java.math.BigDecimal;

public record AssetTypeData (
    String assetName,
    BigDecimal percentageInvested
){}
