package com.eventzen.service;

import com.eventzen.model.Vendor;
import com.eventzen.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorService {
    private final VendorRepository vendorRepository;

    @Transactional(readOnly = true)
    public Page<Vendor> getAllVendors(Pageable pageable) {
        return vendorRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Vendor getVendorById(String id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
    }

    @Transactional
    public Vendor createVendor(Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    @Transactional
    public Vendor updateVendor(String id, Vendor vendorDetails) {
        Vendor vendor = getVendorById(id);

        vendor.setName(vendorDetails.getName());
        vendor.setDescription(vendorDetails.getDescription());
        vendor.setContactPerson(vendorDetails.getContactPerson());
        vendor.setEmail(vendorDetails.getEmail());
        vendor.setPhone(vendorDetails.getPhone());
        vendor.setAddress(vendorDetails.getAddress());
        vendor.setType(vendorDetails.getType());

        return vendorRepository.save(vendor);
    }

    @Transactional
    public void deleteVendor(String id) {
        Vendor vendor = getVendorById(id);
        vendorRepository.delete(vendor);
    }

    @Transactional(readOnly = true)
    public Page<Vendor> searchVendors(String name, Pageable pageable) {
        return vendorRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    @Transactional(readOnly = true)
    public List<Vendor> getVendorsByType(Vendor.VendorType type) {
        return vendorRepository.findByType(type);
    }

    @Transactional(readOnly = true)
    public List<Vendor> getVendorsByEmail(String email) {
        return vendorRepository.findByEmailContainingIgnoreCase(email);
    }

    @Transactional(readOnly = true)
    public List<Vendor> getVendorsByServiceArea(String area) {
        // Implementation needed
        throw new UnsupportedOperationException("Method not implemented");
    }

    @Transactional(readOnly = true)
    public List<Vendor> getVendorsByEventId(String eventId) {
        // Implementation needed
        throw new UnsupportedOperationException("Method not implemented");
    }

    @Transactional(readOnly = true)
    public List<Vendor> getActiveVendors(boolean isActive) {
        // Implementation needed
        throw new UnsupportedOperationException("Method not implemented");
    }
}