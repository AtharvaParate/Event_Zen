package com.eventzen.config;

import com.eventzen.model.Event;
import com.eventzen.model.Vendor;
import com.eventzen.repository.EventRepository;
import com.eventzen.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * Initialize the database with sample data for development and testing purposes
 */
@Configuration
@RequiredArgsConstructor
@Profile({ "dev", "test" })
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final EventRepository eventRepository;
    private final VendorRepository vendorRepository;

    /**
     * Initialize sample data
     */
    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Only initialize if the database is empty
            if (eventRepository.count() > 0 || vendorRepository.count() > 0) {
                logger.info("Database already contains data. Skipping initialization.");
                return;
            }

            logger.info("Initializing sample data...");

            // Create sample vendors
            List<Vendor> vendors = createSampleVendors();
            vendorRepository.saveAll(vendors);
            logger.info("Created {} sample vendors", vendors.size());

            // Create sample events
            List<Event> events = createSampleEvents(vendors);
            eventRepository.saveAll(events);
            logger.info("Created {} sample events", events.size());

            logger.info("Sample data initialization complete");
        };
    }

    /**
     * Create sample vendors
     */
    private List<Vendor> createSampleVendors() {
        Vendor caterer = new Vendor();
        caterer.setName("Gourmet Delights Catering");
        caterer.setEmail("contact@gourmetdelights.com");
        caterer.setPhone("555-123-4567");
        caterer.setDescription("Premium catering service for all occasions");
        caterer.setType(Vendor.VendorType.CATERING);
        caterer.setServiceAreas(Arrays.asList("San Francisco", "Oakland", "San Jose"));
        caterer.setActive(true);
        caterer.setCreatedAt(LocalDateTime.now());
        caterer.setUpdatedAt(LocalDateTime.now());

        Vendor photographer = new Vendor();
        photographer.setName("Capture Moments Photography");
        photographer.setEmail("info@capturemoments.com");
        photographer.setPhone("555-987-6543");
        photographer.setDescription("Professional photography services for events");
        photographer.setType(Vendor.VendorType.PHOTOGRAPHY);
        photographer.setServiceAreas(Arrays.asList("San Francisco", "Palo Alto", "Mountain View"));
        photographer.setActive(true);
        photographer.setCreatedAt(LocalDateTime.now());
        photographer.setUpdatedAt(LocalDateTime.now());

        Vendor venue = new Vendor();
        venue.setName("Elegant Estates");
        venue.setEmail("bookings@elegantestates.com");
        venue.setPhone("555-456-7890");
        venue.setDescription("Beautiful venues for weddings and corporate events");
        venue.setType(Vendor.VendorType.VENUE);
        venue.setServiceAreas(Arrays.asList("Napa Valley", "Sonoma", "San Francisco"));
        venue.setActive(true);
        venue.setCreatedAt(LocalDateTime.now());
        venue.setUpdatedAt(LocalDateTime.now());

        return Arrays.asList(caterer, photographer, venue);
    }

    /**
     * Create sample events
     */
    private List<Event> createSampleEvents(List<Vendor> vendors) {
        LocalDateTime now = LocalDateTime.now();

        Event corporateConference = new Event();
        corporateConference.setTitle("Annual Tech Conference 2023");
        corporateConference.setDescription("Join us for the biggest tech conference of the year");
        corporateConference.setStartTime(now.plusMonths(2));
        corporateConference.setEndTime(now.plusMonths(2).plusDays(3));
        corporateConference.setLocation("San Francisco Convention Center");
        corporateConference.setCategory("Conference");
        corporateConference.setMaxAttendees(500);
        corporateConference.setPrice(299.99);
        corporateConference.setOrganizerId("org123");
        corporateConference.setVendorIds(Arrays.asList(vendors.get(0).getId(), vendors.get(1).getId()));
        corporateConference.setStatus(Event.EventStatus.PUBLISHED);
        corporateConference.setCreatedAt(now);
        corporateConference.setUpdatedAt(now);

        Event wedding = new Event();
        wedding.setTitle("Smith & Johnson Wedding");
        wedding.setDescription("Celebration of Sarah and Michael's special day");
        wedding.setStartTime(now.plusMonths(3));
        wedding.setEndTime(now.plusMonths(3).plusHours(8));
        wedding.setLocation("Elegant Estates Vineyard");
        wedding.setCategory("Wedding");
        wedding.setMaxAttendees(150);
        wedding.setPrice(0.0);
        wedding.setOrganizerId("org456");
        wedding.setVendorIds(Arrays.asList(vendors.get(0).getId(), vendors.get(1).getId(), vendors.get(2).getId()));
        wedding.setStatus(Event.EventStatus.PUBLISHED);
        wedding.setCreatedAt(now);
        wedding.setUpdatedAt(now);

        Event musicFestival = new Event();
        musicFestival.setTitle("Bay Area Music Festival");
        musicFestival.setDescription("Three days of amazing music and performances");
        musicFestival.setStartTime(now.plusMonths(5));
        musicFestival.setEndTime(now.plusMonths(5).plusDays(3));
        musicFestival.setLocation("Golden Gate Park");
        musicFestival.setCategory("Concert");
        musicFestival.setMaxAttendees(10000);
        musicFestival.setPrice(150.0);
        musicFestival.setOrganizerId("org789");
        musicFestival.setVendorIds(Arrays.asList(vendors.get(0).getId()));
        musicFestival.setStatus(Event.EventStatus.DRAFT);
        musicFestival.setCreatedAt(now);
        musicFestival.setUpdatedAt(now);

        return Arrays.asList(corporateConference, wedding, musicFestival);
    }
}