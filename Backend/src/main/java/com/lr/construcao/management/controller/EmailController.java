package com.lr.construcao.management.controller;

import com.lr.construcao.management.controller.Docs.EmailControllerDoc;
import com.lr.construcao.management.dto.request.Email.EmailRequestDTO;
import com.lr.construcao.management.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/email")
public class EmailController implements EmailControllerDoc {

    private final EmailService service;

    @PostMapping("/send")
    @Override
    public ResponseEntity<String> sendEmailWithAttachment(@RequestBody EmailRequestDTO dto) {
        service.sendSimpleEmail(dto);
        return new ResponseEntity<>("e-Mail sent with success", HttpStatus.OK);
    }

    @PostMapping("/sendWithAttachment")
    @Override
    public ResponseEntity<String> sendEmailWithAttachment(
            @RequestParam("emailRequest") String emailRequest,
            @RequestParam("attachment") MultipartFile attachment) {
        service.sendEmailWithAttachment(emailRequest, attachment);
        return new ResponseEntity<>("e-Mail with attachment sent successfully", HttpStatus.OK);
    }

}
