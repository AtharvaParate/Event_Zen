package com.eventzen.service.impl;

import com.eventzen.exception.ResourceNotFoundException;
import com.eventzen.model.Vendor;
import com.eventzen.repository.VendorRepository;
import com.eventzen.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {

    private static final Logger logger = LoggerFactory.getLogger(VendorServiceImpl.class);

    private final VendorRepository vendorRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<Vendor> getAllVendors(Pageable pageable) {
        logger.debug("Getting all vendors with pagination");
        return vendorRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Vendor getVendorById(String id) {
        logger.debug("Getting vendor with ID: {}", id);
        return vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));
    }

    @Override
    @Transactional
    public Vendor createVendor(Vendor vendor) {
        logger.debug("Creating new vendor: {}", vendor.getName());
        vendor.setCreatedAt(LocalDateTime.now());
        vendor.setUpdatedAt(LocalDateTime.now());
        vendor.setActive(true);
        return vendorRepository.save(vendor);
    }

    @Override
    @Transactional
    public Vendor updateVendor(String id, Vendor vendorDetails) {
        logger.debug("Updating vendor with ID: {}", id);
        Vendor vendor = getVendorById(id);

        vendor.setName(vendorDetails.getName());
        vendor.setEmail(vendorDetails.getEmail());
        vendor.setPhone(vendorDetails.getPhone());
        vendor.setDescription(vendorDetails.getDescription());
        vendor.setContactPerson(vendorDetails.getContactPerson());
        vendor.setAddress(vendorDetails.getAddress());
        vendor.setType(vendorDetails.getType());
        vendor.setServiceAreas(vendorDetails.getServiceAreas());
        vendor.setUpdatedAt(LocalDateTime.now());

        return vendorRepository.save(vendor);
    }

    @Override
    @Transactional
    public void deleteVendor(String id) {
        logger.debug("Deleting vendor with ID: {}", id);
        Vendor vendor = getVendorById(id);
        vendorRepository.delete(vendor);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Vendor> searchVendors(String name, Pageable pageable) {
        logger.debug("Searching vendors with name containing: {}", name);
        return vendorRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vendor> getVendorsByType(Vendor.VendorType type) {
        logger.debug("Getting vendors by type: {}", type);
        return vendorRepository.findByType(type);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vendor> getVendorsByEmail(String email) {
        logger.debug("Getting vendors by email containing: {}", email);
        return vendorRepository.findByEmailContainingIgnoreCase(email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vendor> getVendorsByServiceArea(String area) {
        logger.debug("Getting vendors by service area: {}", area);
        return vendorRepository.findByServiceAreasContaining(area);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vendor> getVendorsByEventId(String eventId) {
        logger.debug("Getting vendors by event ID: {}", eventId);
        return vendorRepository.findByEventIdsContaining(eventId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vendor> getActiveVendors(boolean isActive) {
        logger.debug("Getting vendors by active status: {}", isActive);
        return vendorRepository.findByIsActive(isActive);
    }
}