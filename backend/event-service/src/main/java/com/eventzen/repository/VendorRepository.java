package com.eventzen.repository;

import com.eventzen.model.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends MongoRepository<Vendor, String> {
    Page<Vendor> findByNameContainingIgnoreCase(String name, Pageable pageable);

    List<Vendor> findByType(Vendor.VendorType type);

    List<Vendor> findByEmailContainingIgnoreCase(String email);

    List<Vendor> findByServiceAreasContaining(String area);

    List<Vendor> findByEventIdsContaining(String eventId);

    List<Vendor> findByIsActive(boolean isActive);
}