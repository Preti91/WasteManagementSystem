package com.example.WasteManagementSystem.repository;

import com.example.WasteManagementSystem.entity.Certificate;
import com.example.WasteManagementSystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    List<Certificate> findByUserOrderByIssuedAtDesc(User user);

    Optional<Certificate> findByCertificateCode(String certificateCode);

    boolean existsByCertificateCode(String certificateCode);
}
