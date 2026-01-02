package com.lr.construcao.management.controller;

import com.lr.construcao.management.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/dashboard")
public class DashboardController {

    private final DashboardService service;

    @GetMapping(
            value = "/totalDrillingMonth"
    )
    public ResponseEntity<Integer> getTotalDrillingMonth() {
        return ResponseEntity.status(HttpStatus.OK).body(service.getTotalDrillingMonth());
    }

    @GetMapping(
            value = "/monthlyRevenue"
    )
    public ResponseEntity<BigDecimal> getMonthlyRevenue() {
        return ResponseEntity.status(HttpStatus.OK).body(service.getMonthlyRevenue());
    }

    @GetMapping(
            value = "/totalPaidBuildMonth"
    )
    public ResponseEntity<BigDecimal> getTotalPaidBuildMonth() {
        return ResponseEntity.status(HttpStatus.OK).body(service.getTotalPaidBuildMonth());
    }

    @GetMapping(
            value = "/totalClients"
    )
    public ResponseEntity<Integer> getTotalClients() {
        return ResponseEntity.status(HttpStatus.OK).body(service.getTotalClients());
    }


}
