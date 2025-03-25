package com.eventzen.service;

import com.eventzen.model.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VendorService {
    Page<Vendor> getAllVendors(Pageable pageable);

    Vendor getVendorById(String id);

    Vendor createVendor(Vendor vendor);

    Vendor updateVendor(String id, Vendor vendorDetails);

    void deleteVendor(String id);

    Page<Vendor> searchVendors(String name, Pageable pageable);

    List<Vendor> getVendorsByType(Vendor.VendorType type);

    List<Vendor> getVendorsByEmail(String email);

    List<Vendor> getVendorsByServiceArea(String area);

    List<Vendor> getVendorsByEventId(String eventId);

    List<Vendor> getActiveVendors(boolean isActive);
}