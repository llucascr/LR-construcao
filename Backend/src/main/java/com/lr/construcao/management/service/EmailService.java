package com.lr.construcao.management.service;

import com.lr.construcao.management.config.EmailConfig;
import com.lr.construcao.management.dto.request.Email.EmailRequestDTO;
import com.lr.construcao.management.mail.EmailSender;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;

@RequiredArgsConstructor
@Service
public class EmailService {

    private final EmailSender emailSender;
    private final EmailConfig emailConfig;

    public void sendSimpleEmail(EmailRequestDTO dto) {
        emailSender
                .to(dto.getTo())
                .withSubject(dto.getSubject())
                .withMessage(dto.getBody())
                .send(emailConfig);
    }

    public void sendEmailWithAttachment(String emailRequestjson, MultipartFile attachment) {

        File tempFile = null;

        try {
            EmailRequestDTO dto = new ObjectMapper().readValue(emailRequestjson, EmailRequestDTO.class);
            tempFile = File.createTempFile("attachment", attachment.getOriginalFilename());
            attachment.transferTo(tempFile);

            emailSender
                    .to(dto.getTo())
                    .withSubject(dto.getSubject())
                    .withMessage(dto.getBody())
                    .attach(tempFile.getAbsolutePath())
                    .send(emailConfig);

        } catch (IOException e) {
            throw new RuntimeException("Error processing the attachment", e);
        } finally {
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }

    }

}
