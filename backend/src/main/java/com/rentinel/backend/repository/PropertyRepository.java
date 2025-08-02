package com.rentinel.backend.repository;

import com.rentinel.backend.model.Property;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
// import java.util.Optional;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Integer> {
    // Optional<Property> findById(Integer propertyID);

    List<Property> findByOwnerName(String ownerName);

    long countByOwnerName(String ownerName);

    @Query("SELECT AVG(p.fixedRent) FROM Property p")
    Double getAverageRent();

    @Query("SELECT AVG(p.fixedRent) FROM Property p WHERE p.ownerName = :ownerName")
    Double getAverageRentByOwnerName(String ownerName);

    @Query("""
                SELECT CASE
                         WHEN COUNT(p.propertyID) = 0 THEN 0.0
                         ELSE (COUNT(pa.propertyID) * 100.0) / COUNT(p.propertyID)
                       END
                FROM Property p
                LEFT JOIN PropertyAssignment pa ON pa.propertyID = p.propertyID
            """)
    Double getOccupancyRate();

    @Query("""
                SELECT CASE
                         WHEN COUNT(p.propertyID) = 0 THEN 0.0
                         ELSE (COUNT(pa.propertyID) * 100.0) / COUNT(p.propertyID)
                       END
                FROM Property p
                LEFT JOIN PropertyAssignment pa ON pa.propertyID = p.propertyID WHERE p.ownerName = :ownerName
            """)
    Double getOccupancyRateByOwner(String ownerName);

    @Query("""
                SELECT COUNT(pa.propertyID)
                FROM Property p
                JOIN PropertyAssignment pa ON pa.propertyID = p.propertyID WHERE p.ownerName = :ownerName
            """)
    Double getRentedPropertiesByOwner(String ownerName);

    @Query(value = """
                WITH AreaCount AS (
                    SELECT
                        CASE
                            WHEN area = '1 Kanal' THEN '1 Kanal'
                            WHEN area = '2 Kanal' THEN '2 Kanal'
                            ELSE 'Other'
                        END AS Area,
                        COUNT(*) AS Count
                    FROM property
                    GROUP BY
                        CASE
                            WHEN area = '1 Kanal' THEN '1 Kanal'
                            WHEN area = '2 Kanal' THEN '2 Kanal'
                            ELSE 'Other'
                        END
                )
                SELECT Area, Count
                FROM AreaCount
                ORDER BY
                    CASE
                        WHEN Area = '1 Kanal' THEN 1
                        WHEN Area = '2 Kanal' THEN 2
                        ELSE 3
                    END
            """, nativeQuery = true)
    List<Object[]> getAreaCount();

    @Query(value = """
                WITH AreaCount AS (
                    SELECT
                        CASE
                            WHEN area = '1 Kanal' THEN '1 Kanal'
                            WHEN area = '2 Kanal' THEN '2 Kanal'
                            ELSE 'Other'
                        END AS Area,
                        COUNT(*) AS Count
                    FROM property WHERE ownerName = :ownerName
                    GROUP BY
                        CASE
                            WHEN area = '1 Kanal' THEN '1 Kanal'
                            WHEN area = '2 Kanal' THEN '2 Kanal'
                            ELSE 'Other'
                        END
                )
                SELECT Area, Count
                FROM AreaCount
                ORDER BY
                    CASE
                        WHEN Area = '1 Kanal' THEN 1
                        WHEN Area = '2 Kanal' THEN 2
                        ELSE 3
                    END
            """, nativeQuery = true)
    List<Object[]> getAreaCountByOwner(String ownerName);
}
