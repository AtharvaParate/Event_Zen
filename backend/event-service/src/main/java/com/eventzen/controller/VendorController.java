package com.eventzen.controller;

import com.eventzen.model.Vendor;
import com.eventzen.service.VendorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendors")
@RequiredArgsConstructor
@Tag(name = "Vendors", description = "Vendor management endpoints")
public class VendorController {
    private final VendorService vendorService;

    @GetMapping
    @Operation(summary = "Get all vendors", description = "Get a paginated list of all vendors")
    public ResponseEntity<Page<Vendor>> getAllVendors(Pageable pageable) {
        return ResponseEntity.ok(vendorService.getAllVendors(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vendor by ID", description = "Get a specific vendor by its ID")
    public ResponseEntity<Vendor> getVendorById(@PathVariable String id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @PostMapping
    @Operation(summary = "Create vendor", description = "Create a new vendor")
    public ResponseEntity<Vendor> createVendor(@Valid @RequestBody Vendor vendor) {
        return ResponseEntity.ok(vendorService.createVendor(vendor));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update vendor", description = "Update an existing vendor")
    public ResponseEntity<Vendor> updateVendor(
            @PathVariable String id,
            @Valid @RequestBody Vendor vendorDetails) {
        return ResponseEntity.ok(vendorService.updateVendor(id, vendorDetails));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete vendor", description = "Delete a vendor by its ID")
    public ResponseEntity<Void> deleteVendor(@PathVariable String id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search vendors", description = "Search vendors by name")
    public ResponseEntity<Page<Vendor>> searchVendors(
            @RequestParam String name,
            Pageable pageable) {
        return ResponseEntity.ok(vendorService.searchVendors(name, pageable));
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get vendors by type", description = "Get vendors by type")
    public ResponseEntity<List<Vendor>> getVendorsByType(
            @PathVariable Vendor.VendorType type) {
        return ResponseEntity.ok(vendorService.getVendorsByType(type));
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get vendors by email", description = "Get vendors by email")
    public ResponseEntity<List<Vendor>> getVendorsByEmail(
            @PathVariable String email) {
        return ResponseEntity.ok(vendorService.getVendorsByEmail(email));
    }

    @GetMapping("/area/{area}")
    @Operation(summary = "Get vendors by service area", description = "Get vendors by service area")
    public ResponseEntity<List<Vendor>> getVendorsByServiceArea(
            @PathVariable String area) {
        return ResponseEntity.ok(vendorService.getVendorsByServiceArea(area));
    }

    @GetMapping("/event/{eventId}")
    @Operation(summary = "Get vendors by event ID", description = "Get vendors associated with a specific event")
    public ResponseEntity<List<Vendor>> getVendorsByEventId(
            @PathVariable String eventId) {
        return ResponseEntity.ok(vendorService.getVendorsByEventId(eventId));
    }

    @GetMapping("/active/{isActive}")
    @Operation(summary = "Get active vendors", description = "Get vendors by active status")
    public ResponseEntity<List<Vendor>> getActiveVendors(
            @PathVariable boolean isActive) {
        return ResponseEntity.ok(vendorService.getActiveVendors(isActive));
    }

    @GetMapping("/public")
    @Operation(summary = "Get public vendors", description = "Get publicly available vendors (active only)")
    public ResponseEntity<List<Vendor>> getPublicVendors() {
        return ResponseEntity.ok(vendorService.getActiveVendors(true));
    }
}