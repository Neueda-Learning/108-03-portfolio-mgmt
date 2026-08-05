package com.neueda.controller;

import com.neueda.dto.Point;
import com.neueda.service.TimeChartService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/timechart")
public class TimeChartController {
    private final TimeChartService timeChartService;
    public TimeChartController(TimeChartService timeChartService) {
        this.timeChartService = timeChartService;
    }

    @GetMapping("/{accountId}")
    public List<Point> getTimeChart(@PathVariable String accountId) {
        return timeChartService.getTotalInvestedChart(Integer.parseInt(accountId));
    }
}
